using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace LingoFlow.Core.Models
{
    public class GptFeedbackResult
    {

        [JsonPropertyName("fluencyComment")]
        public string FluencyComment { get; set; }

        [JsonPropertyName("fluencyScore")]
        public int FluencyScore { get; set; }

        [JsonPropertyName("grammarComment")]
        public string GrammarComment { get; set; }

        [JsonPropertyName("grammarScore")]
        public int GrammarScore { get; set; }

        [JsonPropertyName("vocabularyComment")]
        public string VocabularyComment { get; set; }

        [JsonPropertyName("vocabularyScore")]
        public int VocabularyScore { get; set; }

        [JsonPropertyName("usedWordsCount")]
        public int UsedWordsCount { get; set; }

        [JsonPropertyName("totalWordsRequired")]
        public int TotalWordsRequired { get; set; }

        [JsonPropertyName("generalFeedback")]
        public string GeneralFeedback { get; set; }

        [JsonPropertyName("score")]
        public int Score { get; set; }
    }

}