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
        public int Id { get; set; }
        public int ConversationId { get; set; }
        //public Conversation Conversation { get; set; }
        public string Comments { get; set; }
        public int Score { get; set; } // למשל, צ
    }
}
