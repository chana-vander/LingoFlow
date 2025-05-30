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
////        // 1. ����� ���� ������ ����� ���
////        var words = await _wordRepo.GetWordsByTopicIdAsync(topicId);
////        var wordList = string.Join(", ", words.Select(w => w.Name));

////        // 2. ����� ����� (Prompt) ����� �-GPT
////        var prompt = BuildPrompt(transcription, wordList);

////        // 3. ����� �-GPT ��� OpenAI API
////        var gptResult = await SendToGPT(prompt);

////        var feedback = new Feedback
////        {
////            recordingId = recordingId,
////            UsedWordsCount = gptResult.UsedWordsCount,
////            TotalWordsRequired = gptResult.TotalWordsRequired,

////            GrammarScore = gptResult.GrammarScore,
////            GrammarComment = gptResult.GrammarComment ?? "�� ����� ���� �� �����.",

////            FluencyScore = gptResult.FluencyScore,
////            FluencyComment = string.IsNullOrWhiteSpace(gptResult.FluencyComment)
////        ? "�� ����� ���� �� ��� ������."
////        : gptResult.FluencyComment,

////            VocabularyScore = gptResult.VocabularyScore,
////            VocabularyComment = gptResult.VocabularyComment ?? "�� ����� ���� �� ���� �����.",

////            GeneralFeedback = gptResult.GeneralFeedback ?? "�� ����� ���� �����.",

////            Score = gptResult.Score,
////            GivenAt = DateTime.UtcNow
////        };



////        return feedback;
////    }

////    private string BuildPrompt(string transcription, string wordList)
////    {
////        return $@"��� ���� ���� ������� ����� ������� ����� ����� �������.
////��� ��: ����� ���� ������ ���� ������. **����� ��� ���� ����� �������** ������ �� ��� ������ ������ ������ �������.   ��� ����� ����� ���� �� ������ ���� ����� ������
////    ����� ����� ����� �� ����� ������ ����� ����� �����.
////    ��� ����� �� �����:
////    ""{transcription}""

////    ���� ����� ����� ��������� ����� �� �����:
////    {wordList}

////    ��� ��� �� ������ �����:

////    1. ���� ��� ����� ���� ������ ������ ����� (�� ����� ������ � �� ���� ���� �����).
////    2. �� ���� ������ (Grammar) �-0 �� 10, ���� ���� ����.
////    3. �� ���� ���� ������ (Fluency) �-0 �� 10, ���� ���� ����.
////    4. �� ���� ����� ����� (Vocabulary) �-0 �� 10, ���� ���� ����.
////    5. �� ���� ���� �-0 �� 100 �� ���� ����� ������ ���.
////    6. ����: �� ���� ���� ������ ������ �� �����. ����� ���� ����� ���� (""�� �����!"", ""���� ������ ������ ���"", ""������ ����"", ""����� ���"" ������).
////    ��� �� ������ JSON ���. �� ����� ������, ����� �� ���� ��� ��������� JSON.
////    �� ���� �� ����� ������ �� ����� ����� �� ������ �� �� ������� �� ���� ����


////    ���� �� �� ������� ������ JSON �����, ��:
////    {{
////      ""usedWordsCount"": 5,
////      ""totalWordsRequired"": 10,
////      ""grammarScore"": 8,
////      ""grammarComment"": ""��� ������ ������, �� ��� ������� ������."",
////      ""fluencyScore"": 7,
////      ""fluencyComment"": ""����� ���� �����, ��� ���� ������."",
////      ""vocabularyScore"": 6,
////      ""vocabularyComment"": ""���� ����� ����� ����� ����� ����."",
////      ""generalFeedback"": ""�� �����! ������ ���� ����� ��������� ����� ��� �� ������ ������. ����� ����� ������� �� ���� ������ ���!"",
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
////            new { role = "system", content = "��� ���� ����� ������� ����� ���� ��������." },
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
//////��� ���� ���� �������. ����� �� ����� ��� ������ ���� �� �����:

//////""{transcription}""

//////��� ��� �� ������ �����:
//////1. ��� ����� ���� ������ ���� ������ �����: {wordList}
//////2. ��� ������ ��� ����? ��� ���� '��', '��', ������?
//////3. ��� �� ������ �����?
//////4. ��� ����� �������� ����.
//////5. �� ���� ���� ��� 0 �-100.

//////���� �� ����� ������ JSON ��:
//////{{
////// ���� �� ����� ������ JSON ��:
//////{{
//////  ""usedWordsCount"": 5,
//////  ""totalWordsRequired"": 10,
//////  ""fluencyComment"": ""����� ���� ����, ���� ��� �������."",
//////  ""grammarComment"": ""��� ������ ����� ������"",
//////  ""vocabularyScore"": 9,
//////  ""vocabularyComment"": ""������ ������ ������� �� ����� ��� ��������."",
//////  ""generalFeedback"": ""�� �����! ������ ���� ������ ������ ���� ����."",
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
//                ? "�� ����� ���� �� �����."
//                : gptResult.GrammarComment,

//            FluencyScore = gptResult.FluencyScore,
//            FluencyComment = string.IsNullOrWhiteSpace(gptResult.FluencyComment)
//                ? "�� ����� ���� �� ��� ������."
//                : gptResult.FluencyComment,

//            VocabularyScore = gptResult.VocabularyScore,
//            VocabularyComment = string.IsNullOrWhiteSpace(gptResult.VocabularyComment)
//                ? "�� ����� ���� �� ���� �����."
//                : gptResult.VocabularyComment,

//            GeneralFeedback = string.IsNullOrWhiteSpace(gptResult.GeneralFeedback)
//                ? "�� ����� ���� �����."
//                : gptResult.GeneralFeedback,

//            Score = gptResult.Score,
//            GivenAt = DateTime.UtcNow
//        };
//    }

//    private string BuildPrompt(string transcription, string wordList)
//    {
//        return $@"
//��� ���� ���� ������� ����� ������� ����� ����� �������.

//��� ��: ����� ���� ������ ���� ������. **����� ��� ���� ����� �������**, �� ���� �� ������ ����� ����� ���� ����� ������.

//��� ����� �����:
//""{transcription}""

//���� ����� ����� ��������� ����� �����:
//{wordList}

//��� ��� �� ������ �����:

//1. ���� ��� ����� ���� ������ ������ ����� (���� ����� �� �����).
//2. �� ���� ������ (Grammar) �-0 �� 10, ���� ���� ����.
//3. �� ���� ���� ������ (Fluency) �-0 �� 10, ���� ���� ����.
//4. �� ���� ����� ����� (Vocabulary) �-0 �� 10, ���� ���� ����.
//5. �� ���� ���� �-0 �� 100 �� ���� ����� ������.
//6. �� ���� ���� ������ ������ � ����, ����, �������.

//���� �� �� ������� ������ JSON ����, ������:
//{{
//  ""usedWordsCount"": 5,
//  ""totalWordsRequired"": 10,
//  ""grammarScore"": 8,
//  ""grammarComment"": ""��� ������ ������, �� ��� ������� ������."",
//  ""fluencyScore"": 7,
//  ""fluencyComment"": ""����� ���� �����, ��� ���� ������."",
//  ""vocabularyScore"": 6,
//  ""vocabularyComment"": ""���� ����� ����� ����� ����� ����."",
//  ""generalFeedback"": ""�� �����! ������ ���� ����� ��������� ����� ��� �� ������ ������. ����� ����� ������� �� ���� ������ ���!"",
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
//                new { role = "system", content = "��� ���� ����� ������� ����� ���� ��������." },
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
