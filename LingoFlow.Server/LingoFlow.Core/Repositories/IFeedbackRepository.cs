using LingoFlow.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Repositories
{
    public interface IFeedbackRepository
    {

        Task<IEnumerable<Feedback>> GetAllFeedbacksAsync();
        Task<Feedback?> GetFeedbackByIdAsync(int id);
        Task<bool> DeleteAsync(int id);
        Task<Feedback> AddAsync(Feedback feedback);
        Task<Feedback> UpdateAsync(Feedback feedback);

    }
}
