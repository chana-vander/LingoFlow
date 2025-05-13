//using LingoFlow.Api.Models; // ודא שאתה מייבא את המודל של ה-DTO
using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Repositories
{
    public interface IWordRepository
    {
        Task<IEnumerable<Word>> GetAllWordsAsync(); // מקבל רק את המודל Word
        Task<Word?> GetWordByIdAsync(int id);
        Task<List<WordDto>> GetWordsByTopicIdAsync(int TopicId);
        Task<Word?> GetWordByTextAsync(string wordText);
        Task<WordDto> AddWordAsync(Word word); // הוספת פונקציה להוספה של מילה חדשה
        Task<WordDto> UpdateWordAsync(int id, WordDto word); // עדכון מילה
        Task<bool> DeleteWordAsync(int id); // מחיקת מילה


        //Task<Word> AddAsync(Word word);
        //Task<Word> GetByIdAsync(int id);
        //Task<Word> UpdateAsync(Word word);
        //Task<bool> DeleteAsync(int id);

    }
}
