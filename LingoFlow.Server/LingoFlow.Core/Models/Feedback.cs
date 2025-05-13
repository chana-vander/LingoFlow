using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Models
{
    public class Feedback
    {
        public int Id { get; set; }
        public int ConversationId { get; set; }
        public Conversation Conversation { get; set; }
        public string Comments { get; set; }
        public int Score { get; set; } // למשל, ציון מ-1 עד 10
        public DateTime GivenAt { get; set; }
    }
}
