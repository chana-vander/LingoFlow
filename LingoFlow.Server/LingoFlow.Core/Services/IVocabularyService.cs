using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Services
{
    public interface IVocabularyService
    {
        Task<IEnumerable<Vocabulary>> GetAllWordsAsync();
        Task<Vocabulary?> GetWordByIdAsync(int id);
        Task<List<VocabularyDto?>> GetWordsByTopicIdAsync(int TopicId);
        Task<Vocabulary> AddWordAsync(VocabularyDto word);
        Task<VocabularyDto> UpdateWordAsync(int id, VocabularyDto wordDto);
        Task<bool> DeleteWordAsync(int id);

        //List<Word> GetList();
        //Word? GetById(int id);
        //Task<Word> AddAsync(Word word);
        //Word Update(Word word);
        //void Delete(int id);
    }
}
