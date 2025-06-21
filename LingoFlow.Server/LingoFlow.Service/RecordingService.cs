using Amazon.S3;
using Amazon.S3.Transfer;
using AutoMapper;
using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
using LingoFlow.Core.Repositories;
using LingoFlow.Core.Services;
using LingoFlow.Data.Repositories;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static LingoFlow.Service.recordingService;

namespace LingoFlow.Service
{
    public class recordingService : IrecordingService
    {
        private readonly IrecordingRepository _recordingRepository;
        private readonly IUserRepository _userRepository;
        private readonly ITopicRepository _topicRepository;
        private readonly IMapper _mapper;
        private readonly IManagerRepository _managerRepository;

        private readonly IAmazonS3 _s3Client;
        private readonly IConfiguration _configuration;

        public recordingService(IrecordingRepository recordingRepository, IUserRepository userRepository, ITopicRepository topicRepository, IMapper mapper, IManagerRepository managerRepository, IAmazonS3 s3Client, IConfiguration configuration)
        {
            _recordingRepository = recordingRepository;
            _userRepository = userRepository;
            _topicRepository = topicRepository;
            _mapper = mapper;
            _managerRepository = managerRepository;
            _configuration = configuration;
            _s3Client = s3Client;
        }

        public async Task<IEnumerable<Recording>> GetAllrecordingsAsync()
        {
            return await _recordingRepository.GetAllrecordingsAsync();
        }

        public async Task<Recording?> GetrecordingByIdAsync(int id)
        {
            return await _recordingRepository.GetrecordingByIdAsync(id);
        }

        public async Task<Recording> AddrecordingAsync(recordingDto recording)
        {
            if (recording == null)
            {
                throw new ArgumentNullException(nameof(recording)); // בדיקה אם לא null
            }

            if (recording.UserId == null || recording.TopicId == null)
            {
                throw new ArgumentException("UserId and TopicId must not be null.");
            }
            Console.WriteLine(recording);
            var con = _mapper.Map<Recording>(recording);
            var addedrecording = await _recordingRepository.AddrecordingAsync(con);
            await _managerRepository.SaveChangesAsync();

            return addedrecording;
        }

        public async Task<List<Recording>> GetRecordingsByUserIdAsync(int userId)
        {
            return await _recordingRepository.GetByUserIdAsync(userId);
        }

        //public async Task<recording?> StartRecordingAsync(int userId, int TopicId)
        //{
        //    var user = await _userRepository.GetUserByIdAsync(userId);
        //    if (user == null)
        //        return null;

        //    var Topic = await _topicRepository.GetTopicByIdAsync(TopicId);
        //    if (Topic == null) return null;

        //    // יצירת שיחה חדשה
        //    var recording = new recording
        //    {
        //        UserId = userId,
        //        TopicId = topicId,
        //        Url = recordingUrl // אם יש לך URL להקלטה – שימי אותו כאן
        //                           // אין שדות StartTime או Status במחלקה שלך
        //    };


        //    // שמירה במסד הנתונים דרך הרפוזיטורי
        //    return await _recordingRepository.AddrecordingAsync(recording);
        //}

        //public async Task<recordingDto> UpdaterecordingAsync(int id, recordingDto recordingDto)
        //{
        //    var recording = await _recordingRepository.GetrecordingByIdAsync(id);
        //    if (recording == null) return null;

        //    _mapper.Map(recordingDto, recording);
        //    var updatedrecording = await _recordingRepository.UpdateAsync(recording);

        //    return updatedrecording != null ? _mapper.Map<recordingDto>(updatedrecording) : null;
        //}
        //public async Task<recordingDto> UpdaterecordingAsync(int id, recordingDto recordingDto)
        //{
        //    if (id < 0 || recordingDto == null)
        //        return null;
        //    var updaterecording = _mapper.Map<recording>(recordingDto);
        //    var result = await _managerRepository.recordingM.UpdateAsync(updaterecording);
        //    Console.WriteLine("נקודת עצירה");
        //    await _managerRepository.SaveChangesAsync();
        //    return _mapper.Map<recordingDto>(result);
        //}
        public async Task<recordingDto> UpdaterecordingAsync(int id, recordingDto recordingDto)
        {
            // בדיקת פרמטרים
            if (id <= 0 || recordingDto == null)
            {
                throw new ArgumentException("הבקשה לא תקפה. אנא ודא שכל השדות הוזנו כראוי.");
            }

            // חיפוש שיחה קיימת
            var existingrecording = await _recordingRepository.GetrecordingByIdAsync(id);
            if (existingrecording == null)
            {
                throw new InvalidOperationException("לא נמצאה שיחה עם מזהה זה. ייתכן והשיחה נמחקה.");
            }

            // עדכון השדות של השיחה הקיימת עם המידע החדש
            _mapper.Map(recordingDto, existingrecording);

            try
            {
                // שמירת השינויים בנתונים
                await _managerRepository.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                // במקרה של בעיה בשמירה (כמו קונפליקט בנתונים)
                throw new InvalidOperationException("לא ניתן לעדכן את השיחה. יש לבדוק את הנתונים שהוזנו.");
            }
            catch (Exception)
            {
                // במקרה של שגיאה בלתי צפויה
                throw new InvalidOperationException("אירעה שגיאה בלתי צפויה. אנא נסה שוב מאוחר יותר.");
            }

            // החזרת השיחה המעודכנת
            return _mapper.Map<recordingDto>(existingrecording);
        }



        public async Task<bool> DeleterecordingAsync(int id)
        {
            var recording = await _recordingRepository.GetrecordingByIdAsync(id);
            if (recording == null) return false;

            return await _recordingRepository.DeleteAsync(id);
        }
        public async Task<string> UploadToS3Async(Stream fileStream, string topicName, int userId)
        {

            var fileName = $"{topicName}_{userId}_{DateTime.UtcNow:yyyyMMddHHmmss}.mp3";
            var bucketName = _configuration["AWS:BucketName"];

            if (string.IsNullOrEmpty(bucketName))
                throw new InvalidOperationException("Missing AWS bucket name in configuration.");

            var uploadRequest = new TransferUtilityUploadRequest
            {
                InputStream = fileStream,
                Key = fileName,
                BucketName = bucketName,
                ContentType = "audio/mpeg"
            };

            var fileTransferUtility = new TransferUtility(_s3Client);
            await fileTransferUtility.UploadAsync(uploadRequest);

            return $"https://{bucketName}.s3.amazonaws.com/{fileName}";
        }



    }
}
