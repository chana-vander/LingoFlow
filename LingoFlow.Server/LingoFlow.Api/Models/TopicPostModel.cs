using LingoFlow.Core.Models;

namespace LingoFlow.Api.Models
{
    public class TopicPostModel
    {
        public string Name { get; set; }
        public List<Word> Words { get; set; } = new();
    }
}
