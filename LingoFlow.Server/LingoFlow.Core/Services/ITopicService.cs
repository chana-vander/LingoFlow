using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Services
{
    public interface ITopicService
    {
        Task<IEnumerable<Topic>> GetAllTopicsAsync();
        Task<Topic> GetTopicByIdAsync(int id);
        Task<List<Topic>> GetTopicsByLevelAsync(int level);
        Task<TopicDto> AddTopicAsync(TopicDto TopicDto);
        Task<TopicDto> UpdateTopicAsync(int id, string TopicName);
        Task<bool> DeleteTopicAsync(int id);
    }

}
