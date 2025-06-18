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
using LingoFlow.Core.Services;

namespace LingoFlow.Service
{
    public class ChatService : IChatService
    {

        private readonly System.Net.Http.IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public ChatService(System.Net.Http.IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;


            var apiKey = _configuration["OpenAI:GptKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                throw new ArgumentException("OpenAI API key is missing in configuration.");
            }
        }

        public async Task<string> AskLingoBot(ChatRequest chatRequest)
        {
            var apiKey = _configuration["OpenAI:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
                return "? חסר מפתח API";

            if (chatRequest.Messages == null || chatRequest.Messages.Count == 0)
                return "? לא סופקו הודעות";

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
                return "?? הצ'אט מיועד ללימוד אנגלית ואוצר מילים בלבד. שאל שאלה בסגנון 'מה הפירוש של…' או 'איך אומרים…'";

            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var body = new
            {
                //model = "gpt-4o",
                model = "gpt-4o-mini",
                messages = chatRequest.Messages,
                max_tokens = 400,
                temperature = 0.7
            };

            var response = await client.PostAsJsonAsync("https://api.openai.com/v1/chat/completions", body);
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return $"? שגיאה מהשרת: {error}";
            }
            if ((int)response.StatusCode == 418)
            {
                return "נטפרי לא מרשה לי לדבר איתך על זה";
            }
            var result = await response.Content.ReadFromJsonAsync<OpenAIResponse>();
            return result?.Choices?.FirstOrDefault()?.Message?.Content?.Trim() ?? "? לא התקבלה תשובה.";
        }
    }
}



//using LingoFlow.Core.Models;
//using LingoFlow.Core.Services;
//using Microsoft.Extensions.Configuration;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Net.Http.Json;
//using System.Threading.Tasks;

//namespace LingoFlow.Service
//{
//    public class ChatService : IChatService
//    {
//        private readonly IHttpClientFactory _httpClientFactory;
//        private readonly IConfiguration _configuration;

//        // רשימת נושאי השיחה שהמערכת תומכת בהם
//        private static readonly List<string> AllowedTopics = new()
//        {
//            "מסעדה", "טיול", "עבודה", "לימודים", "בריאות", "תחבורה", "משפחה", "תחביבים"
//            // הוסף כאן את כל הנושאים הנתמכים
//        };

//        // מילות מפתח לשאלות חופשיות על מילים/תרגום
//        private static readonly string[] VocabularyKeywords = new[]
//        {
//            "מילה", "תרגום", "איך אומרים", "פירוש", "משמעות", "example", "meaning", "translate", "vocabulary", "definition"
//        };

//        public ChatService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
//        {
//            _httpClientFactory = httpClientFactory;
//            _configuration = configuration;

//            var apiKey = _configuration["OpenAI:GptKey"];
//            if (string.IsNullOrEmpty(apiKey))
//                throw new ArgumentException("OpenAI API key is missing in configuration.");
//        }

//        public async Task<string> AskLingoBot(ChatRequest chatRequest)
//        {
//            var apiKey = _configuration["OpenAI:ApiKey"];
//            if (string.IsNullOrEmpty(apiKey))
//                return "? חסר מפתח API";

//            if (chatRequest.Messages == null || chatRequest.Messages.Count == 0)
//                return "? לא סופקו הודעות";

//            var lastMessage = chatRequest.Messages.Last().Content?.Trim() ?? "";

//            // בדיקה אם זו שאלה חופשית (מילים / תרגום)
//            bool isVocabularyQuestion = VocabularyKeywords.Any(keyword =>
//                lastMessage.Contains(keyword, StringComparison.OrdinalIgnoreCase));

//            if (!isVocabularyQuestion)
//            {
//                // בדיקה אם מדובר בבקשה לנושא שיחה כללי
//                if (lastMessage.Contains("נושא שיחה") || lastMessage.Contains("רעיונות לנושא"))
//                {
//                    // חיפוש נושא ספציפי בהודעה
//                    bool topicFound = AllowedTopics.Any(topic =>
//                        lastMessage.Contains(topic, StringComparison.OrdinalIgnoreCase));

//                    if (!topicFound)
//                    {
//                        var topicsList = string.Join(", ", AllowedTopics);
//                        return $"?? ניתן לבקש נושא שיחה רק מתוך הרשימה: {topicsList}\nלדוגמה: 'תן לי רעיון לנושא שיחה על מסעדה'";
//                    }
//                }
//                else
//                {
//                    // לא מדובר לא בשאלה מילונית ולא בבקשת נושא
//                    return "?? הצ'אט מיועד ללימוד אנגלית ואוצר מילים בלבד. שאל שאלה בסגנון 'מה הפירוש של…' או 'תן לי מילים על נושא כמו…'";
//                }
//            }

//            // שליחת הבקשה ל-OpenAI
//            var client = _httpClientFactory.CreateClient();
//            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

//            var body = new
//            {
//                model = "gpt-4o-mini",
//                messages = chatRequest.Messages,
//                max_tokens = 400,
//                temperature = 0.7
//            };

//            var response = await client.PostAsJsonAsync("https://api.openai.com/v1/chat/completions", body);
//            if (!response.IsSuccessStatusCode)
//            {
//                var error = await response.Content.ReadAsStringAsync();
//                return $"? שגיאה מהשרת: {error}";
//            }

//            var result = await response.Content.ReadFromJsonAsync<OpenAIResponse>();
//            return result?.Choices?.FirstOrDefault()?.Message?.Content?.Trim() ?? "? לא התקבלה תשובה.";
//        }
//    }
//}
