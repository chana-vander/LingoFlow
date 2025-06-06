using AutoMapper;
using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
using LingoFlow.Core.Repositories;
using LingoFlow.Core.Services;
using LingoFlow.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Service
{
    public class VocabularyService : IVocabularyService
    {
        private readonly IVocabularyRepository _vocabularyRepository;
        private readonly IMapper _mapper;
        private readonly IManagerRepository _managerRepository;
        public VocabularyService(IVocabularyRepository vocabularyRepository, IMapper mapper, IManagerRepository managerRepository)
        {
            _vocabularyRepository = vocabularyRepository;
            _mapper = mapper;
            _managerRepository = managerRepository;
        }

        public async Task<IEnumerable<Vocabulary>> GetAllWordsAsync()
        {
            return await _vocabularyRepository.GetAllVocabularyAsync();
        }

        public async Task<Vocabulary?> GetWordByIdAsync(int id)
        {
            return await _vocabularyRepository.GetVocabularyByIdAsync(id);
        }
        public async Task<List<VocabularyDto>> GetWordsByTopicIdAsync(int TopicId)
        {
            return await _vocabularyRepository.GetVocabularyByTopicIdAsync(TopicId);
        }

        public async Task<Vocabulary> AddWordAsync(VocabularyDto word)
        {
            if (word == null)
            {
                throw new ArgumentNullException(nameof(word)); // ����� �� �� null
            }

            // ���� �� ����� ��� ����� �����
            var existingWord = await _vocabularyRepository.GetVocabularyByTextAsync(word.Word);
            if (existingWord != null)
            {
                throw new ArgumentException($"Word '{word.Word}' already exists in the database.");
            }
            var mappedWord = _mapper.Map<Vocabulary>(word);
            await _vocabularyRepository.AddVocabularyAsync(mappedWord);
            //var addedWord = await _wordRepository.AddWordAsync(mappedWord);
            await _managerRepository.SaveChangesAsync();

            return mappedWord;//addedWord
        }


        //public async Task<WordDto> UpdateWordAsync(int id, WordDto wordDto)
        //{
        //    var word = await _wordRepository.GetWordByIdAsync(id);
        //    if (word == null) return null;

        //    //var wordToUp = _mapper.Map(wordDto, word);
        //    var updatedWord = _wordRepository.UpdateWordAsync(id, wordDto);

        //    return updatedWord != null ? _mapper.Map<WordDto>(updatedWord) : null;
        //}
        public async Task<VocabularyDto> UpdateWordAsync(int id, VocabularyDto word)
        {
            // ����� �������
            if (id < 0 || word == null)
                return null;

            // ����� ����� ������ ��� ����
            var existingWord = await _vocabularyRepository.GetVocabularyByIdAsync(id);
            if (existingWord == null)
            {
                throw new ArgumentException($"Word with ID {id} not found.");
            }

            // ���� �-DTO ����� Word
            var updateWord = _mapper.Map(word, existingWord); // ����� ����� �� ����� ������ �� ����� ����

            // ����� ��������
            await _managerRepository.SaveChangesAsync();

            // ���� ����� �������� �-WordDto ������ ������
            return _mapper.Map<VocabularyDto>(updateWord);
        }


        public async Task<bool> DeleteWordAsync(int id)
        {
            var word = await _vocabularyRepository.GetVocabularyByIdAsync(id);
            if (word == null) return false;

            return await _vocabularyRepository.DeleteVocabularyAsync(id);
        }
    }
}
