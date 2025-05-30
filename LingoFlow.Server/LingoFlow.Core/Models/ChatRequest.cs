using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Models
{
    // Models/Chat/ChatRequest.cs
    public class ChatRequest
    {
        public List<ChatMessage> Messages { get; set; } = new();
    }

    public class ChatMessage
    {
        public string Role { get; set; } = "user"; // ае "system", "assistant"
        public string Content { get; set; } = string.Empty;
    }
}
