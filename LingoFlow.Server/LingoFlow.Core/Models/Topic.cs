using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Models
{
    public class Topic
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Level { get; set; }
        public List<Word> Words { get; set; } = new();
    }
}
