﻿//כו סיון - גירסה מומלצצת
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
        private readonly IVocabularyRepository _vocabularyRepo;
        private readonly IConfiguration _configuration;

        public FeedbackAnalysisService(HttpClient httpClient, IVocabularyRepository vocabularyRepo, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _vocabularyRepo = vocabularyRepo;
            _configuration = configuration;

            var apiKey = _configuration["OpenAI:GptKey"];
            Console.WriteLine("apiKey: " + apiKey);
            if (string.IsNullOrEmpty(apiKey))
                throw new ArgumentException("OpenAI API key is missing in configuration.");

            if (!_httpClient.DefaultRequestHeaders.Contains("Authorization"))
            {
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            }
        }

        public async Task<Feedback> AnalyzeAsync(string transcription, int topicId, int recordingId)
        {
            Console.WriteLine("feedback analyze service");
            var words = await _vocabularyRepo.GetVocabularyByTopicIdAsync(topicId);
            
            var wordList = string.Join(", ", words.Select(w => w.Word));

            var prompt = BuildPrompt(transcription, wordList);
            var gptResult = await SendToGPT(prompt);

            return new Feedback
            {
                recordingId = recordingId,
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

        private string BuildPrompt(string transcription, string wordList)
        {
            return $@"אתה מורה פרטי לאנגלית המלמד תלמידים בצורה אישית ומעודדת.

קיבלת תמלול משיחה של תלמיד במסגרת שיעור בנושא מסוים.
הנה הטקסט של השיחה:
""{transcription}""

והנה רשימת מילים רלוונטיות לנושא של השיחה:
{wordList}

אנא בצע את הדברים הבאים:

1. בדוק כמה מילים מתוך הרשימה של המילים הרלוונטיות בלבד הופיעו בשיחה (בלי הטיות).
2. תן ציון לדקדוק (Grammar) מ-0 עד 10, כולל הערה קצרה.
3. תן ציון לשטף הדיבור (Fluency) מ-0 עד 10, כולל הערה קצרה.
4. תן ציון לאוצר מילים (Vocabulary) מ-0 עד 10, כולל הערה קצרה.
5. תן ציון כללי מ-0 עד 100 על בסיס שלושת המדדים יחד.
6. חשוב: תן משוב אישי ומעודד לתלמיד.

החזר את התשובה בפורמט JSON בלבד, כך:
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
  ""score"": 82
}}";
        }

        private async Task<GptFeedbackResult> SendToGPT(string prompt)
        {
            var body = new
            {
                model = "gpt-4o-mini",
                messages = new[]
                {
                    new
                    {
                        role = "system",
                        content = "אתה מחזיר אך ורק JSON תקני (ללא תגיות ```json, הסברים או טקסט נוסף) עם השדות: usedWordsCount, totalWordsRequired, grammarScore, grammarComment, fluencyScore, fluencyComment, vocabularyScore, vocabularyComment, generalFeedback, score. המשוב בעברית בלבד."
                    },
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

            var responseText = await response.Content.ReadAsStringAsync();
            Console.WriteLine("GPT Raw JSON:\n" + responseText);

            using var doc = JsonDocument.Parse(responseText);
            var rawText = doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();
            Console.WriteLine("GPT content:\n" + rawText);

            var cleanJson = ExtractJsonFromText(rawText);
            Console.WriteLine("Cleaned JSON:\n" + cleanJson);

            try
            {
                var result = JsonSerializer.Deserialize<GptFeedbackResult>(cleanJson);
                if (result == null)
                    throw new Exception("Could not parse GPT result (null result).");

                return result;
            }
            catch (JsonException je)
            {
                throw new Exception("Failed to parse GPT response as JSON. Raw content:\n" + cleanJson, je);
            }
        }

        private string ExtractJsonFromText(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                throw new Exception("GPT returned an empty response.");

            text = text.Trim();

            var startTag = "```json";
            var endTag = "```";

            var startIdx = text.IndexOf(startTag);
            if (startIdx >= 0)
            {
                var endIdx = text.IndexOf(endTag, startIdx + startTag.Length);
                if (endIdx == -1)
                    throw new Exception("Invalid GPT response: missing closing ```");

                return text.Substring(startIdx + startTag.Length, endIdx - (startIdx + startTag.Length)).Trim();
            }

            var braceStart = text.IndexOf('{');
            var braceEnd = text.LastIndexOf('}');
            if (braceStart >= 0 && braceEnd >= braceStart)
            {
                return text.Substring(braceStart, braceEnd - braceStart + 1).Trim();
            }

            throw new Exception("Could not extract JSON from GPT response.");
        }
    }
}


////מוצשק יח סיון
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
//    public class FeedbackAnalysisService : IFeedbackAnalysisService
//    {
//        private readonly HttpClient _httpClient;
//        private readonly IVocabularyRepository _vocabularyRepo;
//        private readonly IConfiguration _configuration;

//        public FeedbackAnalysisService(HttpClient httpClient, IVocabularyRepository vocabularyRepo, IConfiguration configuration)
//        {
//            _httpClient = httpClient;
//            _vocabularyRepo = vocabularyRepo;
//            _configuration = configuration;

//            var apiKey = _configuration["OpenAI:GptKey"];
//            if (string.IsNullOrEmpty(apiKey))
//                throw new ArgumentException("OpenAI API key is missing in configuration.");

//            if (!_httpClient.DefaultRequestHeaders.Contains("Authorization"))
//            {
//                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
//            }
//        }

//        public async Task<Feedback> AnalyzeAsync(string transcription, int topicId, int recordingId)
//        {
//            var words = await _vocabularyRepo.GetVocabularyByTopicIdAsync(topicId);
//            var wordList = string.Join(", ", words.Select(w => w.Word));

//            var prompt = BuildPrompt(transcription, wordList);
//            var gptResult = await SendToGPT(prompt);

//            return new Feedback
//            {
//                recordingId = recordingId,
//                UsedWordsCount = gptResult.UsedWordsCount,
//                TotalWordsRequired = gptResult.TotalWordsRequired,
//                GrammarScore = gptResult.GrammarScore,
//                GrammarComment = gptResult.GrammarComment,
//                FluencyScore = gptResult.FluencyScore,
//                FluencyComment = gptResult.FluencyComment,
//                VocabularyScore = gptResult.VocabularyScore,
//                VocabularyComment = gptResult.VocabularyComment,
//                GeneralFeedback = gptResult.GeneralFeedback,
//                Score = gptResult.Score,
//                GivenAt = DateTime.UtcNow
//            };
//        }

//        private string BuildPrompt(string transcription, string wordList)
//        {
//            return $@"אתה מורה פרטי לאנגלית המלמד תלמידים בצורה אישית ומעודדת.

//קיבלת תמלול משיחה של תלמיד במסגרת שיעור בנושא מסוים.
//הנה הטקסט של השיחה:
//""{transcription}""

//והנה רשימת מילים רלוונטיות לנושא של השיחה:
//{wordList}

//אנא בצע את הדברים הבאים:

//1. בדוק כמה מילים מתוך הרשימה של המילים הרלוונטיות שקיבלת בלבד הופיעו בשיחה (אל תתחשב בהטיות – רק מילה דומה מאד נחשבת).
//2. תן ציון לדקדוק (Grammar) מ-0 עד 10, כולל הערה קצרה.
//3. תן ציון לשטף הדיבור (Fluency) מ-0 עד 10, כולל הערה קצרה.
//4. תן ציון לאוצר מילים (Vocabulary) מ-0 עד 10, כולל הערה קצרה.
//5. תן ציון כללי מ-0 עד 100 על בסיס שלושת המדדים יחד.
//6. חשוב: תן משוב אישי ומעודד לתלמיד על השיחה. המשוב צריך להיות ישיר (""כל הכבוד!"", ""ידעת להשתמש במילים יפה"", ""השתפרת מאוד"", ""תמשיך ככה"" וכדומה).

//החזר את כל התשובות בפורמט JSON מדויק, כך:
//{{
//  ""usedWordsCount"": 5,
//  ""totalWordsRequired"": 10,
//  ""grammarScore"": 8,
//  ""grammarComment"": ""מעט שגיאות בדקדוק, אך רוב המשפטים נכונים."",
//  ""fluencyScore"": 7,
//  ""fluencyComment"": ""דיבור שוטף יחסית, היו מספר הפסקות."",
//  ""vocabularyScore"": 6,
//  ""vocabularyComment"": ""נעשה שימוש באוצר מילים בסיסי בלבד."",
//  ""generalFeedback"": ""כל הכבוד! השתמשת בכמה מילים רלוונטיות ונשמע שיש לך ביטחון בדיבור. תמשיך לתרגל ולהרחיב את אוצר המילים שלך!"",
//  ""score"": 82
//}}";
//        }

//        private async Task<GptFeedbackResult> SendToGPT(string prompt)
//        {
//            var body = new
//            {
//                model = "gpt-4o-mini",
//                messages = new[]
//                {
//                    new
//                    {
//                        role = "system",
//                        content = "אתה מחזיר אך ורק JSON תקני (בלי שום טקסט מסביב, בלי הסברים) עם השדות הבאים: usedWordsCount, totalWordsRequired, grammarScore, grammarComment, fluencyScore, fluencyComment, vocabularyScore, vocabularyComment, generalFeedback, score. אל תשתמש בתגיות ```json או טקסט חיצוני. כל ההערות והמשוב חייבים להיות כתובים בעברית בלבד."
//                    },
//                    new { role = "user", content = prompt }
//                },
//                temperature = 0.7
//            };

//            var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

//            var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);

//            if (!response.IsSuccessStatusCode)
//            {
//                var error = await response.Content.ReadAsStringAsync();
//                throw new Exception("OpenAI API error: " + error);
//            }

//            var json = await response.Content.ReadAsStringAsync();
//            using var doc = JsonDocument.Parse(json);
//            var rawText = doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();

//            var cleanJson = ExtractJsonFromText(rawText);

//            try
//            {
//                var resultJson = JsonSerializer.Deserialize<GptFeedbackResult>(cleanJson);
//                if (resultJson == null)
//                    throw new Exception("Could not parse GPT result (null result).");

//                return resultJson;
//            }
//            catch (JsonException je)
//            {
//                throw new Exception("Failed to parse GPT response as JSON. Raw content:\n" + cleanJson, je);
//            }
//        }

//        private string ExtractJsonFromText(string text)
//        {
//            if (string.IsNullOrWhiteSpace(text))
//                throw new Exception("GPT returned an empty response.");

//            text = text.Trim();

//            var startTag = "```json";
//            var endTag = "```";

//            var startIdx = text.IndexOf(startTag);
//            if (startIdx >= 0)
//            {
//                var endIdx = text.IndexOf(endTag, startIdx + startTag.Length);
//                if (endIdx == -1)
//                    throw new Exception("Invalid GPT response: missing closing ```");

//                return text.Substring(startIdx + startTag.Length, endIdx - (startIdx + startTag.Length)).Trim();
//            }

//            // אם אין תגיות – נחפש בלוק JSON פשוט
//            var braceStart = text.IndexOf('{');
//            var braceEnd = text.LastIndexOf('}');
//            if (braceStart >= 0 && braceEnd >= braceStart)
//            {
//                return text.Substring(braceStart, braceEnd - braceStart + 1).Trim();
//            }

//            throw new Exception("Could not extract JSON from GPT response.");
//        }
//    }
//}


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
//    public class FeedbackAnalysisService : IFeedbackAnalysisService
//    {
//        private readonly HttpClient _httpClient;
//        private readonly IVocabularyRepository _vocabularyRepo;
//        private readonly IConfiguration _configuration;

//        public FeedbackAnalysisService(HttpClient httpClient, IVocabularyRepository vocabularyRepo, IConfiguration configuration)
//        {
//            _httpClient = httpClient;
//            _vocabularyRepo = vocabularyRepo;
//            _configuration = configuration;

//            var apiKey = _configuration["OpenAI:GptKey"];
//            Console.WriteLine("apiKey :"+ apiKey);
//            if (string.IsNullOrEmpty(apiKey))
//            {
//                throw new ArgumentException("OpenAI API key is missing in configuration.");
//            }

//            if (!_httpClient.DefaultRequestHeaders.Contains("Authorization"))
//            {
//                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
//            }
//        }

//        public async Task<Feedback> AnalyzeAsync(string transcription, int topicId, int recordingId)
//        {
//            var words = await _vocabularyRepo.GetVocabularyByTopicIdAsync(topicId);
//            var wordList = string.Join(", ", words.Select(w => w.Word));

//            var prompt = BuildPrompt(transcription, wordList);
//            var gptResult = await SendToGPT(prompt);

//            return new Feedback
//            {
//                recordingId = recordingId,
//                UsedWordsCount = gptResult.UsedWordsCount,
//                TotalWordsRequired = gptResult.TotalWordsRequired,
//                GrammarScore = gptResult.GrammarScore,
//                GrammarComment = gptResult.GrammarComment,
//                FluencyScore = gptResult.FluencyScore,
//                FluencyComment = gptResult.FluencyComment,
//                VocabularyScore = gptResult.VocabularyScore,
//                VocabularyComment = gptResult.VocabularyComment,
//                GeneralFeedback = gptResult.GeneralFeedback,
//                Score = gptResult.Score,
//                GivenAt = DateTime.UtcNow
//            };
//        }
//        private string BuildPrompt(string transcription, string wordList)
//        {
//            return $@"אתה מורה פרטי לאנגלית המלמד תלמידים בצורה אישית ומעודדת.

//קיבלת תמלול משיחה של תלמיד במסגרת שיעור בנושא מסוים.
//הנה הטקסט של השיחה:
//""{transcription}""

//והנה רשימת מילים רלוונטיות לנושא של השיחה:
//{wordList}

//אנא בצע את הדברים הבאים:

//1. בדוק כמה מילים מתוך הרשימה הופיעו בשיחה (אל תתחשב בהטיות – גם מילה דומה נחשבת).
//2. תן ציון לדקדוק (Grammar) מ-0 עד 10, כולל הערה קצרה.
//3. תן ציון לשטף הדיבור (Fluency) מ-0 עד 10, כולל הערה קצרה.
//4. תן ציון לאוצר מילים (Vocabulary) מ-0 עד 10, כולל הערה קצרה.
//5. תן ציון כללי מ-0 עד 100 על בסיס שלושת המדדים יחד.
//6. חשוב: תן משוב אישי ומעודד לתלמיד על השיחה. המשוב צריך להיות ישיר (""כל הכבוד!"", ""ידעת להשתמש במילים יפה"", ""השתפרת מאוד"", ""תמשיך ככה"" וכדומה).

//החזר את כל התשובות בפורמט JSON מדויק, כך:
//כמובן שתגוון בתשובות שלך נתתי לך רק דוגמא
//{{
//  ""usedWordsCount"": 5,
//  ""totalWordsRequired"": 10,
//  ""grammarScore"": 8,
//  ""grammarComment"": ""מעט שגיאות בדקדוק, אך רוב המשפטים נכונים."",
//  ""fluencyScore"": 7,
//  ""fluencyComment"": ""דיבור שוטף יחסית, היו מספר הפסקות."",
//  ""vocabularyScore"": 6,
//  ""vocabularyComment"": ""נעשה שימוש באוצר מילים בסיסי בלבד."",
//  ""generalFeedback"": ""כל הכבוד! השתמשת בכמה מילים רלוונטיות ונשמע שיש לך ביטחון בדיבור. תמשיך לתרגל ולהרחיב את אוצר המילים שלך!"",
//  ""score"": 82
//}}";
//        }
//        private async Task<GptFeedbackResult> SendToGPT(string prompt)
//        {
//            var body = new
//            {
//                //model = "gpt-4",
//                //model = "gpt-3.5-turbo",
//                //model = "gpt-4o-mini\r\n",
//                model = "gpt-4o-mini",
//                messages = new[]
//                {
//            new { role = "system", content = "אתה מחזיר אך ורק JSON תקני (בלי שום טקסט מסביב, בלי הסברים) עם השדות הבאים: usedWordsCount, totalWordsRequired, grammarScore, grammarComment, fluencyScore, fluencyComment, vocabularyScore, vocabularyComment, generalFeedback, score. אל תשתמש בתגיות ```json או טקסט חיצוני." },
//            new { role = "user", content = prompt }
//        },
//                temperature = 0.7
//            };

//            var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

//            var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);

//            if (!response.IsSuccessStatusCode)
//            {
//                var error = await response.Content.ReadAsStringAsync();
//                throw new Exception("OpenAI API error: " + error);
//            }

//            var json = await response.Content.ReadAsStringAsync();
//            Console.WriteLine("json: " + json);

//            using var doc = JsonDocument.Parse(json);
//            var rawText = doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();
//            Console.WriteLine("text: " + rawText);

//            var cleanJson = ExtractJsonFromText(rawText); // סינון בלוקים מיותרים
//            var resultJson = JsonSerializer.Deserialize<GptFeedbackResult>(cleanJson);
//            Console.WriteLine("result: " + resultJson);

//            if (resultJson == null)
//                throw new Exception("Could not parse GPT result.");

//            return resultJson;
//        }

//        private string ExtractJsonFromText(string text)
//        {
//            var start = text.IndexOf("```json");
//            if (start == -1) return text.Trim(); // אין תגיות – כנראה שזה JSON נקי

//            var end = text.IndexOf("```", start + 6);
//            if (end == -1) throw new Exception("Could not find end of JSON in GPT response");

//            var json = text.Substring(start + 6, end - (start + 6)).Trim();
//            return json;
//        }

//        //private async Task<GptFeedbackResult> SendToGPT(string prompt)
//        //{
//        //    var body = new
//        //    {
//        //        model = "gpt-4",
//        //        messages = new[]
//        //        {
//        //            new { role = "system", content = "אתה מנתח שיחות באנגלית לצורך משוב למשתמשים." },
//        //            new { role = "user", content = prompt }
//        //        },
//        //        temperature = 0.7
//        //    };

//        //    var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

//        //    var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);

//        //    if (!response.IsSuccessStatusCode)
//        //    {
//        //        var error = await response.Content.ReadAsStringAsync();
//        //        throw new Exception("OpenAI API error: " + error);
//        //    }

//        //    var json = await response.Content.ReadAsStringAsync();
//        //    Console.WriteLine("json "+ json);
//        //    using var doc = JsonDocument.Parse(json);
//        //    var text = doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();
//        //    Console.WriteLine("text :"+text);
//        //    var resultJson = JsonSerializer.Deserialize<GptFeedbackResult>(text);
//        //    Console.WriteLine("result: "+resultJson);
//        //    if (resultJson == null)
//        //        throw new Exception("Could not parse GPT result.");

//        //    return resultJson;
//        //}
//    }
//}