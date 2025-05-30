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
                return "? ��� ���� API";

            if (chatRequest.Messages == null || chatRequest.Messages.Count == 0)
                return "? �� ����� ������";

            var vocabularyKeywords = new[]
            {
            "����", "�����", "��� ������", "�����", "������", "example", "meaning", "translate", "vocabulary", "definition"
        };

            bool isRelevant = chatRequest.Messages.Any(m =>
                vocabularyKeywords.Any(keyword =>
                    m.Content.Contains(keyword, StringComparison.OrdinalIgnoreCase)
                )
            );

            if (!isRelevant)
                return "?? ��'�� ����� ������ ������ ����� ����� ����. ��� ���� ������ '�� ������ ��' �� '��� ������'";

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
                return $"? ����� �����: {error}";
            }
            if ((int)response.StatusCode == 418)
            {
                return "����� �� ���� �� ���� ���� �� ��";
            }
            var result = await response.Content.ReadFromJsonAsync<OpenAIResponse>();
            return result?.Choices?.FirstOrDefault()?.Message?.Content?.Trim() ?? "? �� ������ �����.";
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

//        // ����� ����� ����� ������� ����� ���
//        private static readonly List<string> AllowedTopics = new()
//        {
//            "�����", "����", "�����", "�������", "������", "������", "�����", "�������"
//            // ���� ��� �� �� ������� �������
//        };

//        // ����� ���� ������ ������� �� �����/�����
//        private static readonly string[] VocabularyKeywords = new[]
//        {
//            "����", "�����", "��� ������", "�����", "������", "example", "meaning", "translate", "vocabulary", "definition"
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
//                return "? ��� ���� API";

//            if (chatRequest.Messages == null || chatRequest.Messages.Count == 0)
//                return "? �� ����� ������";

//            var lastMessage = chatRequest.Messages.Last().Content?.Trim() ?? "";

//            // ����� �� �� ���� ������ (����� / �����)
//            bool isVocabularyQuestion = VocabularyKeywords.Any(keyword =>
//                lastMessage.Contains(keyword, StringComparison.OrdinalIgnoreCase));

//            if (!isVocabularyQuestion)
//            {
//                // ����� �� ����� ����� ����� ���� ����
//                if (lastMessage.Contains("���� ����") || lastMessage.Contains("������� �����"))
//                {
//                    // ����� ���� ������ ������
//                    bool topicFound = AllowedTopics.Any(topic =>
//                        lastMessage.Contains(topic, StringComparison.OrdinalIgnoreCase));

//                    if (!topicFound)
//                    {
//                        var topicsList = string.Join(", ", AllowedTopics);
//                        return $"?? ���� ���� ���� ���� �� ���� ������: {topicsList}\n������: '�� �� ����� ����� ���� �� �����'";
//                    }
//                }
//                else
//                {
//                    // �� ����� �� ����� ������� ��� ����� ����
//                    return "?? ��'�� ����� ������ ������ ����� ����� ����. ��� ���� ������ '�� ������ ��' �� '�� �� ����� �� ���� ���'";
//                }
//            }

//            // ����� ����� �-OpenAI
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
//                return $"? ����� �����: {error}";
//            }

//            var result = await response.Content.ReadFromJsonAsync<OpenAIResponse>();
//            return result?.Choices?.FirstOrDefault()?.Message?.Content?.Trim() ?? "? �� ������ �����.";
//        }
//    }
//}
