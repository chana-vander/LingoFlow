using AutoMapper;
using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
using LingoFlow.Core.Repositories;
using LingoFlow.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Service
{
    public class TopicService : ITopicService
    {
        private readonly ITopicRepository _TopicRepository;
        private readonly IMapper _mapper;

        public TopicService(ITopicRepository TopicRepository, IMapper mapper)
        {
            _TopicRepository = TopicRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Topic>> GetAllTopicsAsync()
        {
            return await _TopicRepository.GetAllTopicsAsync();
        }

        public async Task<Topic?> GetTopicByIdAsync(int id)
        {
            return await _TopicRepository.GetTopicByIdAsync(id);
        }
        public async Task<List<Topic>> GetTopicsByLevelAsync(int level)
        {
            return await _TopicRepository.GetTopicsByLevelAsync(level);
        }

        public async Task<TopicDto> AddTopicAsync(TopicDto TopicDto)
        {
            var Topic = _mapper.Map<Topic>(TopicDto);
            var createdTopic = await _TopicRepository.AddAsync(Topic);

            return createdTopic == null ? null : _mapper.Map<TopicDto>(createdTopic);
        }

        public async Task<TopicDto> UpdateTopicAsync(int id, string TopicName)
        {
            var Topic = await _TopicRepository.GetTopicByIdAsync(id);
            if (Topic == null)
                return null;

            Topic.Name = TopicName;
            var updatedTopic = await _TopicRepository.UpdateAsync(Topic);

            return updatedTopic == null ? null : _mapper.Map<TopicDto>(updatedTopic);
        }

        public async Task<bool> DeleteTopicAsync(int id)
        {
            var Topic = await _TopicRepository.GetTopicByIdAsync(id);
            if (Topic == null) return false;

            return await _TopicRepository.DeleteAsync(id);
        }
    }
}
