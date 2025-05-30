////using LingoFlow.Core.Models;
////using LingoFlow.Core.Repositories;
////using System.Net.Http;
////using System.Text;
////using System.Text.Json;

////public class FeedbackAnalyzerService
////{
////    private readonly HttpClient _httpClient;
////    private readonly IWordRepository _wordRepo;

////    public FeedbackAnalyzerService(HttpClient httpClient, IWordRepository wordRepo)
////    {
////        _httpClient = httpClient;
////        _wordRepo = wordRepo;
////    }

////    public async Task<Feedback> AnalyzeAsync(string transcription, int topicId, int recordingId)
////    {
////        // 1. שליפת אוצר המילים לנושא הזה
////        var words = await _wordRepo.GetWordsByTopicIdAsync(topicId);
////        var wordList = string.Join(", ", words.Select(w => w.Name));

////        // 2. בניית השאלה (Prompt) שנשלח ל-GPT
////        var prompt = BuildPrompt(transcription, wordList);

////        // 3. קריאה ל-GPT דרך OpenAI API
////        var gptResult = await SendToGPT(prompt);

////        var feedback = new Feedback
////        {
////            recordingId = recordingId,
////            UsedWordsCount = gptResult.UsedWordsCount,
////            TotalWordsRequired = gptResult.TotalWordsRequired,

////            GrammarScore = gptResult.GrammarScore,
////            GrammarComment = gptResult.GrammarComment ?? "לא ניתנה הערה על דקדוק.",

////            FluencyScore = gptResult.FluencyScore,
////            FluencyComment = string.IsNullOrWhiteSpace(gptResult.FluencyComment)
////        ? "לא ניתנה הערה על שטף הדיבור."
////        : gptResult.FluencyComment,

////            VocabularyScore = gptResult.VocabularyScore,
////            VocabularyComment = gptResult.VocabularyComment ?? "לא ניתנה הערה על אוצר מילים.",

////            GeneralFeedback = gptResult.GeneralFeedback ?? "לא ניתנה הערה כללית.",

////            Score = gptResult.Score,
////            GivenAt = DateTime.UtcNow
////        };



////        return feedback;
////    }

////    private string BuildPrompt(string transcription, string wordList)
////    {
////        return $@"אתה מורה פרטי לאנגלית המלמד תלמידים בצורה אישית ומעודדת.
////שים לב: ייתכן שחלק מהשיחה נאמר בעברית. **התעלם מכל טקסט שאינו באנגלית** והתמקד אך ורק בניתוח הקטעים שנאמרו באנגלית.   אבל במשוב הכללי עדכן את המשתמש שהיו מילים בעברית
////    קיבלת תמלול משיחה של תלמיד במסגרת שיעור בנושא מסוים.
////    הנה הטקסט של השיחה:
////    ""{transcription}""

////    והנה רשימת מילים רלוונטיות לנושא של השיחה:
////    {wordList}

////    אנא בצע את הדברים הבאים:

////    1. בדוק כמה מילים מתוך הרשימה הופיעו בשיחה (אל תתחשב בהטיות – גם מילה דומה נחשבת).
////    2. תן ציון לדקדוק (Grammar) מ-0 עד 10, כולל הערה קצרה.
////    3. תן ציון לשטף הדיבור (Fluency) מ-0 עד 10, כולל הערה קצרה.
////    4. תן ציון לאוצר מילים (Vocabulary) מ-0 עד 10, כולל הערה קצרה.
////    5. תן ציון כללי מ-0 עד 100 על בסיס שלושת המדדים יחד.
////    6. חשוב: תן משוב אישי ומעודד לתלמיד על השיחה. המשוב צריך להיות ישיר (""כל הכבוד!"", ""ידעת להשתמש במילים יפה"", ""השתפרת מאוד"", ""תמשיך ככה"" וכדומה).
////    ענה רק בפורמט JSON נקי. אל תוסיף הסברים, הערות או טקסט חוץ מהאובייקט JSON.
////    אם נישל לך טקססט בעברית זה המקום לעדכן את המשתמש על כך ולהתריע על הפעם הבאה


////    החזר את כל התשובות בפורמט JSON מדויק, כך:
////    {{
////      ""usedWordsCount"": 5,
////      ""totalWordsRequired"": 10,
////      ""grammarScore"": 8,
////      ""grammarComment"": ""מעט שגיאות בדקדוק, אך רוב המשפטים נכונים."",
////      ""fluencyScore"": 7,
////      ""fluencyComment"": ""דיבור שוטף יחסית, היו מספר הפסקות."",
////      ""vocabularyScore"": 6,
////      ""vocabularyComment"": ""נעשה שימוש באוצר מילים בסיסי בלבד."",
////      ""generalFeedback"": ""כל הכבוד! השתמשת בכמה מילים רלוונטיות ונשמע שיש לך ביטחון בדיבור. תמשיך לתרגל ולהרחיב את אוצר המילים שלך!"",
////      ""score"": 95
////    }}";
////    }

////    private async Task<GptFeedbackResult> SendToGPT(string prompt)
////    {
////        var body = new
////        {
////            model = "gpt-4",
////            messages = new[]
////            {
////            new { role = "system", content = "אתה מנתח שיחות באנגלית לצורך משוב למשתמשים." },
////            new { role = "user", content = prompt }
////        },
////            temperature = 0.7
////        };

////        var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

////        var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);
////        if (!response.IsSuccessStatusCode)
////        {
////            var error = await response.Content.ReadAsStringAsync();
////            Console.WriteLine($"ERROR: {response.StatusCode}\n{error}");
////            throw new Exception("OpenAI API error: " + error);
////        }
////        Console.WriteLine("Response JSON: " + response);

////        var json = await response.Content.ReadAsStringAsync();

////        Console.WriteLine("jsom res: " + json);
////        using var doc = JsonDocument.Parse(json);
////        Console.WriteLine("doc " + doc);

////        var text = doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();

////        Console.WriteLine("GPT raw response:");
////        Console.WriteLine(text);

////        var result = JsonSerializer.Deserialize<GptFeedbackResult>(text);

////        return result!;
////    }

////}



//////GPT
//////private string BuildPrompt(string transcription, string wordList)
//////{
//////    Console.WriteLine("wordList "+ wordList);
//////    return $@"
//////אתה מורה פרטי לאנגלית. קיבלת את הטקסט הבא מהקלטת שיחה של תלמיד:

//////""{transcription}""

//////אנא בצע את הדברים הבאים:
//////1. כמה מילים מתוך הרשימה הבאה הופיעו בשיחה: {wordList}
//////2. האם הדיבור היה שוטף? היו הרבה 'אמ', 'אה', הפסקות?
//////3. האם יש שגיאות דקדוק?
//////4. סכם במשוב טקסטואלי כללי.
//////5. תן ציון כללי בין 0 ל-100.

//////החזר לי תשובה בפורמט JSON כך:
//////{{
////// החזר לי תשובה בפורמט JSON כך:
//////{{
//////  ""usedWordsCount"": 5,
//////  ""totalWordsRequired"": 10,
//////  ""fluencyComment"": ""דיברת שוטף מאוד, כמעט בלי היסוסים."",
//////  ""grammarComment"": ""מעט שגיאות במבנה משפטים"",
//////  ""vocabularyScore"": 9,
//////  ""vocabularyComment"": ""השתמשת במילים מגוונות אך פספסת כמה מהנדרשות."",
//////  ""generalFeedback"": ""כל הכבוד! השתמשת ברוב המילים ודיברת שוטף מאוד."",
//////  ""score"": 87,
//////  ""fluencyScore"": 8,
//////  ""grammarScore"": 7
//////}}

//////}}
//////";
//////}
//using LingoFlow.Core.Models;
//using LingoFlow.Core.Repositories;
//using System.Net.Http;
//using System.Text;
//using System.Text.Json;

//public class FeedbackAnalyzerService
//{
//    private readonly HttpClient _httpClient;
//    private readonly IWordRepository _wordRepo;

//    public FeedbackAnalyzerService(HttpClient httpClient, IWordRepository wordRepo)
//    {
//        _httpClient = httpClient;
//        _wordRepo = wordRepo;
//    }

//    public async Task<Feedback> AnalyzeAsync(string transcription, int topicId, int recordingId)
//    {
//        var words = await _wordRepo.GetWordsByTopicIdAsync(topicId);
//        var wordList = string.Join(", ", words.Select(w => w.Name));

//        var prompt = BuildPrompt(transcription, wordList);
//        var gptResult = await SendToGPT(prompt);

//        return new Feedback
//        {
//            recordingId = recordingId,
//            UsedWordsCount = gptResult.UsedWordsCount,
//            TotalWordsRequired = gptResult.TotalWordsRequired,

//            GrammarScore = gptResult.GrammarScore,
//            GrammarComment = string.IsNullOrWhiteSpace(gptResult.GrammarComment)
//                ? "לא ניתנה הערה על דקדוק."
//                : gptResult.GrammarComment,

//            FluencyScore = gptResult.FluencyScore,
//            FluencyComment = string.IsNullOrWhiteSpace(gptResult.FluencyComment)
//                ? "לא ניתנה הערה על שטף הדיבור."
//                : gptResult.FluencyComment,

//            VocabularyScore = gptResult.VocabularyScore,
//            VocabularyComment = string.IsNullOrWhiteSpace(gptResult.VocabularyComment)
//                ? "לא ניתנה הערה על אוצר מילים."
//                : gptResult.VocabularyComment,

//            GeneralFeedback = string.IsNullOrWhiteSpace(gptResult.GeneralFeedback)
//                ? "לא ניתנה הערה כללית."
//                : gptResult.GeneralFeedback,

//            Score = gptResult.Score,
//            GivenAt = DateTime.UtcNow
//        };
//    }

//    private string BuildPrompt(string transcription, string wordList)
//    {
//        return $@"
//אתה מורה פרטי לאנגלית המלמד תלמידים בצורה אישית ומעודדת.

//שים לב: ייתכן שחלק מהשיחה נאמר בעברית. **התעלם מכל טקסט שאינו באנגלית**, אך עדכן את התלמיד במשוב הכללי שהיו מילים בעברית.

//הנה תמלול השיחה:
//""{transcription}""

//והנה רשימת מילים רלוונטיות לנושא השיחה:
//{wordList}

//אנא בצע את הדברים הבאים:

//1. בדוק כמה מילים מתוך הרשימה הופיעו בשיחה (ניתן לכלול גם הטיות).
//2. תן ציון לדקדוק (Grammar) מ-0 עד 10, כולל הערה קצרה.
//3. תן ציון לשטף הדיבור (Fluency) מ-0 עד 10, כולל הערה קצרה.
//4. תן ציון לאוצר מילים (Vocabulary) מ-0 עד 10, כולל הערה קצרה.
//5. תן ציון כללי מ-0 עד 100 על בסיס שלושת המדדים.
//6. תן משוב אישי ומעודד לתלמיד – ישיר, מחזק, ואותנטי.

//החזר את כל התשובות בפורמט JSON בלבד, לדוגמה:
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
//  ""score"": 95
//}}";
//    }

//    private async Task<GptFeedbackResult> SendToGPT(string prompt)
//    {
//        var body = new
//        {
//            model = "gpt-4",
//            messages = new[]
//            {
//                new { role = "system", content = "אתה מנתח שיחות באנגלית לצורך משוב למשתמשים." },
//                new { role = "user", content = prompt }
//            },
//            temperature = 0.7
//        };

//        var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

//        var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);
//        var json = await response.Content.ReadAsStringAsync();

//        if (!response.IsSuccessStatusCode)
//        {
//            Console.WriteLine($"GPT ERROR {response.StatusCode}: {json}");
//            throw new Exception("OpenAI API error: " + json);
//        }

//        using var doc = JsonDocument.Parse(json);
//        var gptText = doc.RootElement
//                         .GetProperty("choices")[0]
//                         .GetProperty("message")
//                         .GetProperty("content")
//                         .GetString();

//        Console.WriteLine("GPT Response:");
//        Console.WriteLine(gptText);

//        try
//        {
//            var result = JsonSerializer.Deserialize<GptFeedbackResult>(gptText!);
//            if (result == null) throw new Exception("GPT result is null");
//            return result;
//        }
//        catch (Exception ex)
//        {
//            Console.WriteLine("Deserialization error: " + ex.Message);
//            throw new Exception("Failed to parse GPT result: " + gptText, ex);
//        }
//    }
//}
