using LingoFlow.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Repositories
{
    public interface IrecordingRepository
    {
        Task<IEnumerable<recording>> GetAllrecordingsAsync();
        Task<recording?> GetrecordingByIdAsync(int id);
        Task<recording> AddrecordingAsync(recording recording); // הוספת שיחה
        Task<bool> DeleteAsync(int id);
        Task<recording> UpdateAsync(recording recording);
        Task<List<recording>> GetByUserIdAsync(int userId);
        //Task<recording> StartrecordingAsync(int userId, int TopicId);//התחלת הקלטה
    }
}
