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
        Task<IEnumerable<Recording>> GetAllrecordingsAsync();
        Task<Recording?> GetrecordingByIdAsync(int id);
        Task<Recording> AddrecordingAsync(Recording recording); // הוספת שיחה
        Task<bool> DeleteAsync(int id);
        Task<Recording> UpdateAsync(Recording recording);
        Task<List<Recording>> GetByUserIdAsync(int userId);
        //Task<recording> StartrecordingAsync(int userId, int TopicId);//התחלת הקלטה
    }
}
