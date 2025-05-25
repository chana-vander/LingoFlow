//using LingoFlow.Core.Models;
//using LingoFlow.Core.Repositories;
//using LingoFlow.Core.Services;
//using Microsoft.Extensions.Configuration;
//using System;
//using System.Linq;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Text;
//using System.Text.Json;
//using System.Threading.Tasks;

//namespace LingoFlow.Service
//{
//    public class FeedbackAnalysisService:IFeedbackAnalysisService
//    {
//        private readonly HttpClient _httpClient;
//        private readonly IWordRepository _wordRepo;
//        private readonly IConfiguration _configuration;

//        public FeedbackAnalysisService(HttpClient httpClient, IWordRepository wordRepo, IConfiguration configuration)
//        {
//            _httpClient = httpClient;
//            _wordRepo = wordRepo;
//            _configuration = configuration;

//            // קבלת מפתח ה-API מהקונפיגורציה
//            var apiKey = _configuration["OpenAI:ApiKey"];
//            Console.WriteLine("Gpt ai key:   " + apiKey);
//            if (string.IsNullOrEmpty(apiKey))
//            {
//                Console.WriteLine("api key is missing");
//                throw new ArgumentException("OpenAI API key is missing in configuration.");
//            }

//            // הוספת כותרת Authorization ל-HttpClient
//            if (!_httpClient.DefaultRequestHeaders.Contains("Authorization"))
//            {
//                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
//            }
//        }

//        public async Task<Feedback> AnalyzeAsync(string transcription, int topicId, int conversationId)
//        {
//            var words = await _wordRepo.GetWordsByTopicIdAsync(topicId);
//            var wordList = string.Join(", ", words.Select(w => w.Name));

//            var prompt = BuildPrompt(transcription, wordList);

//            var gptResult = await SendToGPT(prompt);

//            var feedback = new Feedback
//            {
//                ConversationId = conversationId,
//                Comments = gptResult.GeneralFeedback,
//                Score = gptResult.Score,
//                GivenAt = DateTime.UtcNow
//            };

//            return feedback;
//        }

//        private string BuildPrompt(string transcription, string wordList)
//        {
//            return $@"
//אתה מורה פרטי לאנגלית. קיבלת את הטקסט הבא מהקלטת שיחה של תלמיד:

//""{transcription}""

//אנא בצע את הדברים הבאים:
//1. כמה מילים מתוך הרשימה הבאה הופיעו בשיחה: {wordList}
//2. הערך את רמת הדקדוק של התלמיד ונתן ציון מספרי מ-0 עד 10.
//3. הערך את שטף הדיבור (fluency) של התלמיד ונתן ציון מספרי מ-0 עד 10.
//4. הערך את אוצר המילים של התלמיד ונתן ציון מספרי מ-0 עד 10.
//5. תן הערות טקסטואליות קצרות עבור כל אחד מהפרמטרים לעיל.
//6. תן ציון כללי בין 0 ל-100, על בסיס משוקלל של הציונים הנפרדים.
//7. סכם במשוב כללי קצר.

//החזר תשובה בפורמט JSON מדויק כך:
//{{
//  ""usedWordsCount"": 5,
//  ""totalWordsRequired"": 10,
//  ""grammarScore"": 8,
//  ""grammarComment"": ""מעט שגיאות בדקדוק, אך רוב המשפטים נכונים."",
//  ""fluencyScore"": 7,
//  ""fluencyComment"": ""דיבור שוטף יחסית, היו מספר הפסקות."",
//  ""vocabularyScore"": 6,
//  ""vocabularyComment"": ""נעשה שימוש באוצר מילים בסיסי בלבד."",
//  ""generalFeedback"": ""התלמיד דיבר בביטחון, אך כדאי להרחיב את אוצר המילים ולהפחית היסוסים."",
//  ""score"": 75
//}}";
//        }


//        private async Task<(string FluencyComment, string GrammarComment, string GeneralFeedback, int Score)> SendToGPT(string prompt)
//        {
//            var body = new
//            {
//                model = "gpt-4",
//                messages = new[]
//                {
//                    new { role = "system", content = "אתה מנתח שיחות באנגלית לצורך משוב למשתמשים." },
//                    new { role = "user", content = prompt }
//                },
//                temperature = 0.7
//            };

//            var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

//            var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);
//            //response.EnsureSuccessStatusCode();
//            if (!response.IsSuccessStatusCode)
//            {
//                var error = await response.Content.ReadAsStringAsync();
//                Console.WriteLine($"ERROR: {response.StatusCode}\n{error}");
//                throw new Exception("OpenAI API error: " + error);
//            }


//            var json = await response.Content.ReadAsStringAsync();
//            using var doc = JsonDocument.Parse(json);
//            var text = doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();

//            var resultJson = JsonDocument.Parse(text);

//            var root = resultJson.RootElement;

//            return (
//                FluencyComment: root.GetProperty("fluencyComment").GetString(),
//                GrammarComment: root.GetProperty("grammarComment").GetString(),
//                GeneralFeedback: root.GetProperty("generalFeedback").GetString(),
//                Score: root.GetProperty("score").GetInt32()
//            );
//        }
//    }
//}
using LingoFlow.Core.Models;
using LingoFlow.Core.Repositories;
using LingoFlow.Core.Services;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace LingoFlow.Service
{
    public class FeedbackAnalysisService : IFeedbackAnalysisService
    {
        private readonly HttpClient _httpClient;
        private readonly IWordRepository _wordRepo;
        private readonly IConfiguration _configuration;

        public FeedbackAnalysisService(HttpClient httpClient, IWordRepository wordRepo, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _wordRepo = wordRepo;
            _configuration = configuration;

            var apiKey = _configuration["OpenAI:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                throw new ArgumentException("OpenAI API key is missing in configuration.");
            }

            if (!_httpClient.DefaultRequestHeaders.Contains("Authorization"))
            {
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            }
        }

        public async Task<Feedback> AnalyzeAsync(string transcription, int topicId, int conversationId)
        {
            var words = await _wordRepo.GetWordsByTopicIdAsync(topicId);
            var wordList = string.Join(", ", words.Select(w => w.Name));

            var prompt = BuildPrompt(transcription, wordList);
            var gptResult = await SendToGPT(prompt);

            return new Feedback
            {
                ConversationId = conversationId,
                UsedWordsCount = gptResult.UsedWordsCount,
                TotalWordsRequired = gptResult.TotalWordsRequired,
                GrammarScore = gptResult.GrammarScore,
                GrammarComment = gptResult.GrammarComment,
                FluencyScore = gptResult.FluencyScore,
                FluencyComment = gptResult.FluencyComment,
                VocabularyScore = gptResult.VocabularyScore,
                VocabularyComment = gptResult.VocabularyComment,
                GeneralFeedback = gptResult.GeneralFeedback,
                Score = gptResult.Score,
                GivenAt = DateTime.UtcNow
            };
        }

        //        private string BuildPrompt(string transcription, string wordList)
        //        {
        //            return $@"
        //אתה מורה פרטי לאנגלית. קיבלת את הטקסט הבא מהקלטת שיחה של תלמיד:

        //""{transcription}""

        //אנא בצע את הדברים הבאים:
        //1. כמה מילים מתוך הרשימה הבאה הופיעו בשיחה: {wordList}
        //2. הערך את רמת הדקדוק של התלמיד ונתן ציון מספרי מ-0 עד 10.
        //3. הערך את שטף הדיבור (fluency) של התלמיד ונתן ציון מספרי מ-0 עד 10.
        //4. הערך את אוצר המילים של התלמיד ונתן ציון מספרי מ-0 עד 10.
        //5. תן הערות טקסטואליות קצרות עבור כל אחד מהפרמטרים לעיל.
        //6. תן ציון כללי בין 0 ל-100, על בסיס משוקלל של הציונים הנפרדים.
        //7. סכם במשוב כללי קצר.

        //החזר תשובה בפורמט JSON מדויק כך:
        //{{
        //  ""usedWordsCount"": 5,
        //  ""totalWordsRequired"": 10,
        //  ""grammarScore"": 8,
        //  ""grammarComment"": ""מעט שגיאות בדקדוק, אך רוב המשפטים נכונים."",
        //  ""fluencyScore"": 7,
        //  ""fluencyComment"": ""דיבור שוטף יחסית, היו מספר הפסקות."",
        //  ""vocabularyScore"": 6,
        //  ""vocabularyComment"": ""נעשה שימוש באוצר מילים בסיסי בלבד."",
        //  ""generalFeedback"": ""התלמיד דיבר בביטחון, אך כדאי להרחיב את אוצר המילים ולהפחית היסוסים."",
        //  ""score"": 75
        //}}";
        //        }
        private string BuildPrompt(string transcription, string wordList)
        {
            return $@"אתה מורה פרטי לאנגלית המלמד תלמידים בצורה אישית ומעודדת.

קיבלת תמלול משיחה של תלמיד במסגרת שיעור בנושא מסוים.
הנה הטקסט של השיחה:
""{transcription}""

והנה רשימת מילים רלוונטיות לנושא של השיחה:
{wordList}

אנא בצע את הדברים הבאים:

1. בדוק כמה מילים מתוך הרשימה הופיעו בשיחה (אל תתחשב בהטיות – גם מילה דומה נחשבת).
2. תן ציון לדקדוק (Grammar) מ-0 עד 10, כולל הערה קצרה.
3. תן ציון לשטף הדיבור (Fluency) מ-0 עד 10, כולל הערה קצרה.
4. תן ציון לאוצר מילים (Vocabulary) מ-0 עד 10, כולל הערה קצרה.
5. תן ציון כללי מ-0 עד 100 על בסיס שלושת המדדים יחד.
6. חשוב: תן משוב אישי ומעודד לתלמיד על השיחה. המשוב צריך להיות ישיר (""כל הכבוד!"", ""ידעת להשתמש במילים יפה"", ""השתפרת מאוד"", ""תמשיך ככה"" וכדומה).

החזר את כל התשובות בפורמט JSON מדויק, כך:
{{
  ""usedWordsCount"": 5,
  ""totalWordsRequired"": 10,
  ""grammarScore"": 8,
  ""grammarComment"": ""מעט שגיאות בדקדוק, אך רוב המשפטים נכונים."",
  ""fluencyScore"": 7,
  ""fluencyComment"": ""דיבור שוטף יחסית, היו מספר הפסקות."",
  ""vocabularyScore"": 6,
  ""vocabularyComment"": ""נעשה שימוש באוצר מילים בסיסי בלבד."",
  ""generalFeedback"": ""כל הכבוד! השתמשת בכמה מילים רלוונטיות ונשמע שיש לך ביטחון בדיבור. תמשיך לתרגל ולהרחיב את אוצר המילים שלך!"",
  ""score"": 75
}}";
        }

        private async Task<GptFeedbackResult> SendToGPT(string prompt)
        {
            var body = new
            {
                model = "gpt-4",
                messages = new[]
                {
                    new { role = "system", content = "אתה מנתח שיחות באנגלית לצורך משוב למשתמשים." },
                    new { role = "user", content = prompt }
                },
                temperature = 0.7
            };

            var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception("OpenAI API error: " + error);
            }

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            var text = doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();

            var resultJson = JsonSerializer.Deserialize<GptFeedbackResult>(text);

            if (resultJson == null)
                throw new Exception("Could not parse GPT result.");

            return resultJson;
        }
    }
}

