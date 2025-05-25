using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text.Json;

namespace MagicalMusic.Api.Controllers
{
    [ApiController]
    [Route("api/transcription")]
    public class TranscriptionController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public TranscriptionController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> TranscribeFromUrl([FromBody] TranscriptionRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.FileUrl))
                return BadRequest("Missing file URL");

            var httpClient = _httpClientFactory.CreateClient();

            Stream audioStream;
            try
            {
                audioStream = await httpClient.GetStreamAsync(request.FileUrl);
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to download audio: {ex.Message}");
            }

            var whisperClient = _httpClientFactory.CreateClient();
            var openAiApiKey = _configuration["OpenAI:ApiKey"];
            if (string.IsNullOrEmpty(openAiApiKey))
                return StatusCode(500, "OpenAI API key is not configured.");

            whisperClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", openAiApiKey);

            using var content = new MultipartFormDataContent();

            var audioContent = new StreamContent(audioStream);
            audioContent.Headers.ContentType = new MediaTypeHeaderValue("audio/mpeg");

            content.Add(audioContent, "file", "audio.mp3");
            content.Add(new StringContent("whisper-1"), "model");
            content.Add(new StringContent("en"), "language");

            HttpResponseMessage response;
            try
            {
                response = await whisperClient.PostAsync("https://api.openai.com/v1/audio/transcriptions", content);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to call OpenAI: {ex.Message}");
            }

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return StatusCode((int)response.StatusCode, $"OpenAI error: {error}");
            }

            var resultJson = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<JsonElement>(resultJson);

            return Ok(result);
        }
    }

    public class TranscriptionRequest
    {
        public string FileUrl { get; set; }
    }
}
