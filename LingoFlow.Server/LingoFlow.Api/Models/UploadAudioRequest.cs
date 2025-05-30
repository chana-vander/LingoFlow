using System.ComponentModel.DataAnnotations;

namespace LingoFlow.Api.Models
{
    public class UploadAudioRequest
    {
        [Required]
        public IFormFile File { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public string TopicName { get; set; }
    }

}
