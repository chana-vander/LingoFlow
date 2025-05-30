using LingoFlow.Core.Repositories;
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
        private readonly IrecordingRepository _recordingRepository;

        public TranscriptionController(IHttpClientFactory httpClientFactory, IConfiguration configuration, IrecordingRepository recordingRepository)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _recordingRepository = recordingRepository;
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

            // --- שלב שמירת התמלול במסד נתונים ---
            var transcriptionText = result.GetProperty("text").GetString();

            var recording = await _recordingRepository.GetrecordingByIdAsync(request.recordingId);
            if (recording == null)
                return NotFound($"recording with ID {request.recordingId} not found.");

            recording.Transcription = transcriptionText;

            await _recordingRepository.UpdateAsync(recording); // או SaveChangesAsync() לפי המימוש

            return Ok(new { transcription = transcriptionText });
        }

        //[HttpPost]
        //public async Task<IActionResult> TranscribeFromUrl([FromBody] TranscriptionRequest request)
        //{
        //    if (string.IsNullOrWhiteSpace(request.FileUrl))
        //        return BadRequest("Missing file URL");

        //    var httpClient = _httpClientFactory.CreateClient();

        //    Stream audioStream;
        //    try
        //    {
        //        audioStream = await httpClient.GetStreamAsync(request.FileUrl);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest($"Failed to download audio: {ex.Message}");
        //    }

        //    var whisperClient = _httpClientFactory.CreateClient();
        //    var openAiApiKey = _configuration["OpenAI:ApiKey"];
        //    if (string.IsNullOrEmpty(openAiApiKey))
        //        return StatusCode(500, "OpenAI API key is not configured.");

        //    whisperClient.DefaultRequestHeaders.Authorization =
        //        new AuthenticationHeaderValue("Bearer", openAiApiKey);

        //    using var content = new MultipartFormDataContent();

        //    var audioContent = new StreamContent(audioStream);
        //    audioContent.Headers.ContentType = new MediaTypeHeaderValue("audio/mpeg");

        //    content.Add(audioContent, "file", "audio.mp3");
        //    content.Add(new StringContent("whisper-1"), "model");
        //    content.Add(new StringContent("en"), "language");

        //    HttpResponseMessage response;
        //    try
        //    {
        //        response = await whisperClient.PostAsync("https://api.openai.com/v1/audio/transcriptions", content);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Failed to call OpenAI: {ex.Message}");
        //    }

        //    if (!response.IsSuccessStatusCode)
        //    {
        //        var error = await response.Content.ReadAsStringAsync();
        //        return StatusCode((int)response.StatusCode, $"OpenAI error: {error}");
        //    }

        //    var resultJson = await response.Content.ReadAsStringAsync();
        //    var result = JsonSerializer.Deserialize<JsonElement>(resultJson);
        //    _recordingRepository.
        //    return Ok(result);
        //}


    }

    public class TranscriptionRequest
    {
        public string FileUrl { get; set; }
        public int recordingId { get; set; }
    }
}




//נסיון עם העברית
//using Microsoft.AspNetCore.Mvc;
//using System.Net.Http.Headers;
//using System.Text.Json;
//using System.Text.RegularExpressions;

//namespace MagicalMusic.Api.Controllers
//{
//    [ApiController]
//    [Route("api/transcription")]
//    public class TranscriptionController : ControllerBase
//    {
//        private readonly IHttpClientFactory _httpClientFactory;
//        private readonly IConfiguration _configuration;

//        public TranscriptionController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
//        {
//            _httpClientFactory = httpClientFactory;
//            _configuration = configuration;
//        }

//        [HttpPost]
//        public async Task<IActionResult> TranscribeFromUrl([FromBody] TranscriptionRequest request)
//        {
//            if (string.IsNullOrWhiteSpace(request.FileUrl))
//                return BadRequest("Missing file URL");

//            var httpClient = _httpClientFactory.CreateClient();

//            Stream audioStream;
//            try
//            {
//                audioStream = await httpClient.GetStreamAsync(request.FileUrl);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest($"Failed to download audio: {ex.Message}");
//            }

//            var whisperClient = _httpClientFactory.CreateClient();
//            var openAiApiKey = _configuration["OpenAI:ApiKey"];
//            if (string.IsNullOrEmpty(openAiApiKey))
//                return StatusCode(500, "OpenAI API key is not configured.");

//            whisperClient.DefaultRequestHeaders.Authorization =
//                new AuthenticationHeaderValue("Bearer", openAiApiKey);

//            using var content = new MultipartFormDataContent();

//            var audioContent = new StreamContent(audioStream);
//            audioContent.Headers.ContentType = new MediaTypeHeaderValue("audio/mpeg");

//            content.Add(audioContent, "file", "audio.mp3");
//            content.Add(new StringContent("whisper-1"), "model");

//            HttpResponseMessage response;
//            try
//            {
//                response = await whisperClient.PostAsync("https://api.openai.com/v1/audio/transcriptions", content);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"Failed to call OpenAI: {ex.Message}");
//            }

//            if (!response.IsSuccessStatusCode)
//            {
//                var error = await response.Content.ReadAsStringAsync();
//                return StatusCode((int)response.StatusCode, $"OpenAI error: {error}");
//            }

//            var resultJson = await response.Content.ReadAsStringAsync();
//            string fullText;

//            try
//            {
//                // מנסה לקרוא JSON עם שדה text
//                var result = JsonSerializer.Deserialize<JsonElement>(resultJson);
//                fullText = result.GetProperty("text").GetString() ?? "";
//            }
//            catch
//            {
//                // fallback אם זו מחרוזת רגילה (למשל: "hello world")
//                fullText = resultJson.Trim('"');
//            }

//            // בדיקת עברית
//            bool containsHebrew = fullText.Any(c => c >= 0x0590 && c <= 0x05FF);

//            // חילוץ רק קטעים באנגלית
//            var englishText = ExtractEnglishText(fullText);

//            var responseObject = new
//            {
//                //fullText,
//                englishText,
//                containsHebrew,
//                message = containsHebrew
//                    ? "?? חלק מהתמלול כולל עברית. רק הקטעים באנגלית נותחו."
//                    : "? התמלול כולו באנגלית."
//            };

//            return Ok(responseObject);
//        }

//        /// <summary>
//        /// מחלץ רק מילים באנגלית, משאיר סימני פיסוק פשוטים.
//        /// </summary>
//        private string ExtractEnglishText(string input)
//        {
//            if (string.IsNullOrEmpty(input))
//                return string.Empty;

//            // שמור רק תווים אנגליים, רווחים, וסימני פיסוק בסיסיים
//            var matches = Regex.Matches(input, @"[\w\s,.!?'\-:;()]+", RegexOptions.IgnoreCase);
//            var englishParts = matches
//                .Select(m => m.Value)
//                .Where(s => s.All(c => c <= 127)) // ASCII בלבד
//                .ToList();

//            return string.Join(" ", englishParts);
//        }
//    }

//    public class TranscriptionRequest
//    {
//        public string FileUrl { get; set; }
//    }
//}
