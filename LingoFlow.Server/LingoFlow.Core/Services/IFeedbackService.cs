using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Services
{
    public interface IFeedbackService
    {
        Task<IEnumerable<Feedback>> GetAllFeedbacksAsync();
        Task<Feedback?> GetFeedbackByIdAsync(int id);
        Task<Feedback> AddFeedbackAsync(FeedbackDto feedback);
        Task<FeedbackDto> UpdateFeedbackAsync(int id, FeedbackDto feedbackDto);
        Task<bool> DeleteFeedbackAsync(int id);
    }

}
