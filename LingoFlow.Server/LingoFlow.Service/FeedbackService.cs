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
        private readonly IrecordingRepository _recordingRepository;
        private readonly IMapper _mapper;
        private readonly IManagerRepository _managerRepository;
        public FeedbackService(IFeedbackRepository feedbackRepository, IMapper mapper, IManagerRepository managerRepository,IrecordingRepository recordingRepository)
        {
            _feedbackRepository = feedbackRepository;
            _mapper = mapper;
            _managerRepository = managerRepository;
            _recordingRepository = recordingRepository;
        }

        public async Task<IEnumerable<Feedback>> GetAllFeedbacksAsync()
        {
            return await _feedbackRepository.GetAllFeedbacksAsync();
        }

        public async Task<Feedback?> GetFeedbackByIdAsync(int id)
        {
            return await _feedbackRepository.GetFeedbackByIdAsync(id);
        }
        //public async Task<Feedback> AddFeedbackAsync(FeedbackDto feedback)
        //{
        //    if (feedback == null)
        //    {
        //        throw new ArgumentNullException(nameof(feedback)); // בדיקה אם לא null
        //    }

        //    // בדיקות אם השדות החשובים קיימים (כמו UserId, recordingId, וכו')
        //    if (feedback.recordingId == null)//feedback.UserId == null || 
        //    {
        //        throw new ArgumentException("UserId and recordingId must not be null.");
        //    }

        //    // מיפוי ה-DTO לישות Feedback
        //    var mappedFeedback = _mapper.Map<Feedback>(feedback);
        //    //Console.WriteLine("Adding feedback for recordingId: " , feedback.recordingId);
        //    //Console.WriteLine("Mapped feedback: " , mappedFeedback.Id);
        //    //Console.WriteLine("feed add to db: ",mappedFeedback);
        //    var addedFeedback = await _feedbackRepository.AddAsync(mappedFeedback);

        //   await _managerRepository.SaveChangesAsync();
        //    Console.WriteLine("added feed: "+addedFeedback);
        //    return addedFeedback;
        //}
        public async Task<Feedback> AddFeedbackAsync(FeedbackDto feedbackDto)
        {
            if (feedbackDto == null)
            {
                throw new ArgumentNullException(nameof(feedbackDto)); // בדיקה אם לא null
            }
            var recording = await _recordingRepository.GetrecordingByIdAsync(feedbackDto.recordingId);
            if (recording == null)
            {
                throw new Exception($"Recording with ID {feedbackDto.recordingId} does not exist in DB.");
            }

            if (feedbackDto.Id == null)
            {
                throw new ArgumentException("UserId and TopicId must not be null.");
            }

            Console.WriteLine(feedbackDto);
            var feed = _mapper.Map<Feedback>(feedbackDto);
            var addedFeedback = await _feedbackRepository.AddAsync(feed);
            Console.WriteLine(addedFeedback.Id);
            Console.WriteLine(addedFeedback.GeneralFeedback);
            Console.WriteLine(addedFeedback.GrammarComment);
            Console.WriteLine(addedFeedback.GrammarScore);
            Console.WriteLine(addedFeedback.FluencyComment);
            Console.WriteLine(addedFeedback.FluencyScore);
            Console.WriteLine(addedFeedback.recordingId);
            Console.WriteLine(addedFeedback.VocabularyComment);
            Console.WriteLine(addedFeedback.VocabularyScore);
            Console.WriteLine(addedFeedback.Score);
            Console.WriteLine(addedFeedback.GivenAt);
            Console.WriteLine(addedFeedback.TotalWordsRequired);
            Console.WriteLine(addedFeedback.UsedWordsCount);
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
            if (feedback == null)
                return false;
            var deleted = await _feedbackRepository.DeleteAsync(id);

            if (deleted)
            {
                await _managerRepository.SaveChangesAsync(); // שמירה בפועל לבסיס הנתונים
            }

            return deleted;
        }
        public async Task<List<Feedback>> GetFeedbackByRecordIdAsync(int recordId)
        {
            return await _feedbackRepository.GetByRecordIdAsync(recordId);
        }
    }
}
