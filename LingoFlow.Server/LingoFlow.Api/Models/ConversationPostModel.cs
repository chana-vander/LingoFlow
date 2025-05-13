using LingoFlow.Core.Models;

namespace LingoFlow.Api.Models
{
    public class ConversationPostModel
    {

        //public int UserId { get; set; }
        //public int LengthConversation { get; set; }  // משך ההקלטה בדקות
        //public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
        //public string? AudioFilePath { get; set; }

        public int UserId { get; set; }
        public int TopicId { get; set; }
    }
}
