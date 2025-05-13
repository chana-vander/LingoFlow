using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Models
{
    public class Word
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Translation { get; set; }
        public string Sentence { get; set; }
        public string SentenceTranslate { get; set; }
        public int TopicId { get; set; }
        public Topic Topic { get; set; }
    }
}
