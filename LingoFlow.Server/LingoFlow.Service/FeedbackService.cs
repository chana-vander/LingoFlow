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
    public class FeedbackService : IFeedbackService
    {
        private readonly IFeedbackRepository _feedbackRepository;
        private readonly IMapper _mapper;
        private readonly IManagerRepository _managerRepository;
        public FeedbackService(IFeedbackRepository feedbackRepository, IMapper mapper, IManagerRepository managerRepository)
        {
            _feedbackRepository = feedbackRepository;
            _mapper = mapper;
            _managerRepository = managerRepository;
        }

        public async Task<IEnumerable<Feedback>> GetAllFeedbacksAsync()
        {
            return await _feedbackRepository.GetAllFeedbacksAsync();
        }

        public async Task<Feedback?> GetFeedbackByIdAsync(int id)
        {
            return await _feedbackRepository.GetFeedbackByIdAsync(id);
        }
        public async Task<Feedback> AddFeedbackAsync(FeedbackDto feedback)
        {
            if (feedback == null)
            {
                throw new ArgumentNullException(nameof(feedback)); // בדיקה אם לא null
            }

            // בדיקות אם השדות החשובים קיימים (כמו UserId, ConversationId, וכו')
            if (feedback.ConversationId == null)//feedback.UserId == null || 
            {
                throw new ArgumentException("UserId and ConversationId must not be null.");
            }

            // מיפוי ה-DTO לישות Feedback
            var mappedFeedback = _mapper.Map<Feedback>(feedback);
            Console.WriteLine("Adding feedback for ConversationId: " + feedback.ConversationId);
            Console.WriteLine("Mapped feedback: " + mappedFeedback.Id);

            var addedFeedback = await _feedbackRepository.AddAsync(mappedFeedback);

            await _managerRepository.SaveChangesAsync();

            return addedFeedback;
        }
        public async Task<FeedbackDto> UpdateFeedbackAsync(int id, FeedbackDto feedback)
        {
            // בדיקת פרמטרים
            if (id < 0 || feedback == null)
                return null;

            var existingFeedback = await _feedbackRepository.GetFeedbackByIdAsync(id);
            if (existingFeedback == null)
            {
                return null;
            }

            _mapper.Map(feedback, existingFeedback); // עדכון השדות של הפידבק הקיים עם המידע החדש
            await _managerRepository.SaveChangesAsync();
            return _mapper.Map<FeedbackDto>(existingFeedback);
        }



        public async Task<bool> DeleteFeedbackAsync(int id)
        {
            var feedback = await _feedbackRepository.GetFeedbackByIdAsync(id);
            if (feedback == null) return false;

            return await _feedbackRepository.DeleteAsync(id);
        }
    }
}
