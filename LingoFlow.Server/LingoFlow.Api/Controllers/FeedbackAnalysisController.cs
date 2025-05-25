using LingoFlow.Core.Models;
using LingoFlow.Core.Repositories;
using System.Net.Http;
using System.Text;
using System.Text.Json;

public class FeedbackAnalyzerService
{
    private readonly HttpClient _httpClient;
    private readonly IWordRepository _wordRepo;

    public FeedbackAnalyzerService(HttpClient httpClient, IWordRepository wordRepo)
    {
        _httpClient = httpClient;
        _wordRepo = wordRepo;
    }

    public async Task<Feedback> AnalyzeAsync(string transcription, int topicId, int conversationId)
    {
        // 1. שליפת אוצר המילים לנושא הזה
        var words = await _wordRepo.GetWordsByTopicIdAsync(topicId);
        var wordList = string.Join(", ", words.Select(w => w.Name));

        // 2. בניית השאלה (Prompt) שנשלח ל-GPT
        var prompt = BuildPrompt(transcription, wordList);

        // 3. קריאה ל-GPT דרך OpenAI API
        var gptResult = await SendToGPT(prompt);

        var feedback = new Feedback
        {
            ConversationId = conversationId,
            UsedWordsCount = gptResult.UsedWordsCount,
            TotalWordsRequired = gptResult.TotalWordsRequired,

            GrammarScore = gptResult.GrammarScore,
            GrammarComment = gptResult.GrammarComment ?? "לא ניתנה הערה על דקדוק.",

            FluencyScore = gptResult.FluencyScore,
            FluencyComment = string.IsNullOrWhiteSpace(gptResult.FluencyComment)
        ? "לא ניתנה הערה על שטף הדיבור."
        : gptResult.FluencyComment,

            VocabularyScore = gptResult.VocabularyScore,
            VocabularyComment = gptResult.VocabularyComment ?? "לא ניתנה הערה על אוצר מילים.",

            GeneralFeedback = gptResult.GeneralFeedback ?? "לא ניתנה הערה כללית.",

            Score = gptResult.Score,
            GivenAt = DateTime.UtcNow
        };



        return feedback;
    }

    private string BuildPrompt(string transcription, string wordList)
    {
        return $@"
    אתה מורה פרטי לאנגלית. קיבלת את הטקסט הבא מהקלטת שיחה של תלמיד:

    ""{transcription}""

    אנא בצע את הדברים הבאים:
    1. כמה מילים מתוך הרשימה הבאה הופיעו בשיחה: {wordList}
    2. האם הדיבור היה שוטף? היו הרבה 'אמ', 'אה', הפסקות?
    3. האם יש שגיאות דקדוק?
    4. סכם במשוב טקסטואלי כללי.
    5. תן ציון כללי בין 0 ל-100.

    החזר לי תשובה בפורמט JSON כך:
    {{
     החזר לי תשובה בפורמט JSON כך:
    {{
      ""usedWordsCount"": 5,
      ""totalWordsRequired"": 10,
      ""fluencyComment"": ""דיברת שוטף מאוד, כמעט בלי היסוסים."",
      ""grammarComment"": ""מעט שגיאות במבנה משפטים"",
      ""vocabularyScore"": 9,
      ""vocabularyComment"": ""השתמשת במילים מגוונות אך פספסת כמה מהנדרשות."",
      ""generalFeedback"": ""כל הכבוד! השתמשת ברוב המילים ודיברת שוטף מאוד."",
      ""score"": 87,
      ""fluencyScore"": 8,
      ""grammarScore"": 7
    }}

    }}
    ";
    }

    //    private string BuildPrompt(string transcription, string wordList)
    //    {
    //        return $@"אתה מורה פרטי לאנגלית המלמד תלמידים בצורה אישית ומעודדת.

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
    //ענה רק בפורמט JSON נקי. אל תוסיף הסברים, הערות או טקסט חוץ מהאובייקט JSON.

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
    //  ""score"": 75
    //}}";
    //    }

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
            Console.WriteLine($"ERROR: {response.StatusCode}\n{error}");
            throw new Exception("OpenAI API error: " + error);
        }
        Console.WriteLine("Response JSON: " + response);

        var json = await response.Content.ReadAsStringAsync();

        Console.WriteLine("jsom res: " + json);
        using var doc = JsonDocument.Parse(json);
        Console.WriteLine("doc " + doc);

        var text = doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();

        Console.WriteLine("GPT raw response:");
        Console.WriteLine(text);

        var result = JsonSerializer.Deserialize<GptFeedbackResult>(text);

        return result!;
    }

}