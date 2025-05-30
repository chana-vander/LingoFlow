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
    public interface IVocabularyRepository
    {
        Task<IEnumerable<Vocabulary>> GetAllVocabularyAsync(); // מקבל רק את המודל Word
        Task<Vocabulary?> GetVocabularyByIdAsync(int id);
        Task<List<VocabularyDto>> GetVocabularyByTopicIdAsync(int topicId);
        Task<Vocabulary?> GetVocabularyByTextAsync(string wordText);
        Task<VocabularyDto> AddVocabularyAsync(Vocabulary word); // הוספת פונקציה להוספה
        Task<VocabularyDto> UpdateVocabularyAsync(int id, VocabularyDto word); // עדכון 
        Task<bool> DeleteVocabularyAsync(int id); // מחיקת 


        //Task<Word> AddAsync(Word word);
        //Task<Word> GetByIdAsync(int id);
        //Task<Word> UpdateAsync(Word word);
        //Task<bool> DeleteAsync(int id);

    }
}
