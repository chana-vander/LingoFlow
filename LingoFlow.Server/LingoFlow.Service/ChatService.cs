using Amazon.Runtime;
using LingoFlow.Core.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Json;

namespace LingoFlow.Service
{
    public class ChatService
    {

        private readonly System.Net.Http.IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _config;

        public ChatService(System.Net.Http.IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _httpClientFactory = httpClientFactory;
            _config = config;
        }

        public async Task<string> AskLingoBot(ChatRequest chatRequest)
        {
            var apiKey = _config["OpenAI:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
                return "❌ חסר מפתח API";

            if (chatRequest.Messages == null || chatRequest.Messages.Count == 0)
                return "❌ לא סופקו הודעות";

            var vocabularyKeywords = new[]
            {
            "מילה", "תרגום", "איך אומרים", "פירוש", "משמעות", "example", "meaning", "translate", "vocabulary", "definition"
        };

            bool isRelevant = chatRequest.Messages.Any(m =>
                vocabularyKeywords.Any(keyword =>
                    m.Content.Contains(keyword, StringComparison.OrdinalIgnoreCase)
                )
            );

            if (!isRelevant)
                return "🧠 הצ'אט מיועד ללימוד אנגלית ואוצר מילים בלבד. שאל שאלה בסגנון 'מה הפירוש של…' או 'איך אומרים…'";

            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var body = new
            {
                model = "gpt-4o",
                messages = chatRequest.Messages,
                max_tokens = 400,
                temperature = 0.7
            };

            var response = await client.PostAsJsonAsync("https://api.openai.com/v1/chat/completions", body);
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return $"❌ שגיאה מהשרת: {error}";
            }
            var result = await response.Content.ReadFromJsonAsync<OpenAIResponse>();
            return result?.Choices?.FirstOrDefault()?.Message?.Content?.Trim() ?? "❓ לא התקבלה תשובה.";
        }
    }
}
