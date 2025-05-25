using LingoFlow.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Dto
{
    public class FeedbackDto
    {
        //public int Id { get; set; }
        //public int ConversationId { get; set; }
        ////public Conversation Conversation { get; set; }
        //public string Comments { get; set; }
        //public int Score { get; set; } // למשל, צ
        public int Id { get; set; }
        public int ConversationId { get; set; }

        public int UsedWordsCount { get; set; }
        public int TotalWordsRequired { get; set; }

        public int GrammarScore { get; set; }
        public string GrammarComment { get; set; }

        public int FluencyScore { get; set; }
        public string FluencyComment { get; set; }

        public int VocabularyScore { get; set; }
        public string VocabularyComment { get; set; }

        public string GeneralFeedback { get; set; }

        public int Score { get; set; }
        public DateTime GivenAt { get; set; }
    }
}

