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
    public class WordService : IWordService
    {
        private readonly IWordRepository _wordRepository;
        private readonly IMapper _mapper;
        private readonly IManagerRepository _managerRepository;
        public WordService(IWordRepository wordRepository, IMapper mapper, IManagerRepository managerRepository)
        {
            _wordRepository = wordRepository;
            _mapper = mapper;
            _managerRepository = managerRepository;
        }

        public async Task<IEnumerable<Word>> GetAllWordsAsync()
        {
            return await _wordRepository.GetAllWordsAsync();
        }

        public async Task<Word?> GetWordByIdAsync(int id)
        {
            return await _wordRepository.GetWordByIdAsync(id);
        }
        public async Task<List<WordDto>> GetWordsByTopicIdAsync(int TopicId)
        {
            return await _wordRepository.GetWordsByTopicIdAsync(TopicId);
        }

        public async Task<Word> AddWordAsync(WordDto word)
        {
            if (word == null)
            {
                throw new ArgumentNullException(nameof(word)); // בדיקה אם לא null
            }

            // בדוק אם המילה כבר קיימת בטבלה
            var existingWord = await _wordRepository.GetWordByTextAsync(word.Name);
            if (existingWord != null)
            {
                throw new ArgumentException($"Word '{word.Name}' already exists in the database.");
            }
            var mappedWord = _mapper.Map<Word>(word);
            await _wordRepository.AddWordAsync(mappedWord);
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
        public async Task<WordDto> UpdateWordAsync(int id, WordDto word)
        {
            // בדיקת פרמטרים
            if (id < 0 || word == null)
                return null;

            // חיפוש המילה הקיימת לפי מזהה
            var existingWord = await _wordRepository.GetWordByIdAsync(id);
            if (existingWord == null)
            {
                throw new ArgumentException($"Word with ID {id} not found.");
            }

            // המרת ה-DTO לישות Word
            var updateWord = _mapper.Map(word, existingWord); // עדכון השדות של המילה הקיימת עם המידע החדש

            // שמירת השינויים
            await _managerRepository.SaveChangesAsync();

            // המרת הישות המעודכנת ל-WordDto והחזרת התוצאה
            return _mapper.Map<WordDto>(updateWord);
        }


        public async Task<bool> DeleteWordAsync(int id)
        {
            var word = await _wordRepository.GetWordByIdAsync(id);
            if (word == null) return false;

            return await _wordRepository.DeleteWordAsync(id);
        }
    }
}
