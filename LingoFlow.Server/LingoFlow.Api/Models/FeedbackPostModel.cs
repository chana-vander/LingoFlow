using System.ComponentModel.DataAnnotations;

namespace LingoFlow.Api.Models
{
    public class FeedbackPostModel
    {
        public int ConversationId { get; set; }

        public string? Comments { get; set; }

        [Range(1, 10, ErrorMessage = "Score must be between 1 and 10.")]
        public int Score { get; set; }

        public DateTime GivenAt { get; set; }// = DateTime.UtcNow;
    }
}
