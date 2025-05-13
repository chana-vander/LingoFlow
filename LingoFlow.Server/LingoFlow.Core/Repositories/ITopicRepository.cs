using LingoFlow.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Repositories
{
    public interface ITopicRepository
    {
        Task<IEnumerable<Topic>> GetAllTopicsAsync();
        Task<Topic?> GetTopicByIdAsync(int id);
        Task<List<Topic>> GetTopicsByLevelAsync(int level);
        Task<Topic> AddAsync(Topic Topic);
        Task<Topic> UpdateAsync(Topic Topic);
        Task<bool> DeleteAsync(int id);
    }
}
