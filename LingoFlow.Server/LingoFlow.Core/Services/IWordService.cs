using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Services
{
    public interface IWordService
    {
        Task<IEnumerable<Word>> GetAllWordsAsync();
        Task<Word?> GetWordByIdAsync(int id);
        Task<List<WordDto?>> GetWordsByTopicIdAsync(int TopicId);
        Task<Word> AddWordAsync(WordDto word);
        Task<WordDto> UpdateWordAsync(int id, WordDto wordDto);
        Task<bool> DeleteWordAsync(int id);

        //List<Word> GetList();
        //Word? GetById(int id);
        //Task<Word> AddAsync(Word word);
        //Word Update(Word word);
        //void Delete(int id);
    }
}
