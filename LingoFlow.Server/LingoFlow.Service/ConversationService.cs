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

namespace LingoFlow.Service
{
    public class ConversationService : IConversationService
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IUserRepository _userRepository;
        private readonly ITopicRepository _topicRepository;
        private readonly IMapper _mapper;
        private readonly IManagerRepository _managerRepository;

        private readonly IAmazonS3 _s3Client;
        private readonly IConfiguration _configuration;

        public ConversationService(IConversationRepository conversationRepository, IUserRepository userRepository, ITopicRepository topicRepository, IMapper mapper, IManagerRepository managerRepository,IAmazonS3 s3Client, IConfiguration configuration)
        {
            _conversationRepository = conversationRepository;
            _userRepository = userRepository;
            _topicRepository = topicRepository;
            _mapper = mapper;
            _managerRepository = managerRepository;
            _configuration = configuration;
            _s3Client = s3Client;
        }

        public async Task<IEnumerable<Conversation>> GetAllConversationsAsync()
        {
            return await _conversationRepository.GetAllConversationsAsync();
        }

        public async Task<Conversation?> GetConversationByIdAsync(int id)
        {
            return await _conversationRepository.GetConversationByIdAsync(id);
        }

        public async Task<Conversation> AddConversationAsync(ConversationDto conversation)
        {
            if (conversation == null)
            {
                throw new ArgumentNullException(nameof(conversation)); // בדיקה אם לא null
            }

            if (conversation.UserId == null || conversation.TopicId == null)
            {
                throw new ArgumentException("UserId and TopicId must not be null.");
            }
            Console.WriteLine(conversation);
            var con = _mapper.Map<Conversation>(conversation);
            var addedConversation = await _conversationRepository.AddConversationAsync(con);
            await _managerRepository.SaveChangesAsync();

            return addedConversation;
        }

        //public async Task<Conversation?> StartRecordingAsync(int userId, int TopicId)
        //{
        //    var user = await _userRepository.GetUserByIdAsync(userId);
        //    if (user == null)
        //        return null;

        //    var Topic = await _topicRepository.GetTopicByIdAsync(TopicId);
        //    if (Topic == null) return null;

        //    // יצירת שיחה חדשה
        //    var conversation = new Conversation
        //    {
        //        UserId = userId,
        //        TopicId = topicId,
        //        Url = recordingUrl // אם יש לך URL להקלטה – שימי אותו כאן
        //                           // אין שדות StartTime או Status במחלקה שלך
        //    };


        //    // שמירה במסד הנתונים דרך הרפוזיטורי
        //    return await _conversationRepository.AddConversationAsync(conversation);
        //}

        //public async Task<ConversationDto> UpdateConversationAsync(int id, ConversationDto conversationDto)
        //{
        //    var conversation = await _conversationRepository.GetConversationByIdAsync(id);
        //    if (conversation == null) return null;

        //    _mapper.Map(conversationDto, conversation);
        //    var updatedConversation = await _conversationRepository.UpdateAsync(conversation);

        //    return updatedConversation != null ? _mapper.Map<ConversationDto>(updatedConversation) : null;
        //}
        //public async Task<ConversationDto> UpdateConversationAsync(int id, ConversationDto conversationDto)
        //{
        //    if (id < 0 || conversationDto == null)
        //        return null;
        //    var updateconversation = _mapper.Map<Conversation>(conversationDto);
        //    var result = await _managerRepository.ConversationM.UpdateAsync(updateconversation);
        //    Console.WriteLine("נקודת עצירה");
        //    await _managerRepository.SaveChangesAsync();
        //    return _mapper.Map<ConversationDto>(result);
        //}
        public async Task<ConversationDto> UpdateConversationAsync(int id, ConversationDto conversationDto)
        {
            // בדיקת פרמטרים
            if (id <= 0 || conversationDto == null)
            {
                throw new ArgumentException("הבקשה לא תקפה. אנא ודא שכל השדות הוזנו כראוי.");
            }

            // חיפוש שיחה קיימת
            var existingConversation = await _conversationRepository.GetConversationByIdAsync(id);
            if (existingConversation == null)
            {
                throw new InvalidOperationException("לא נמצאה שיחה עם מזהה זה. ייתכן והשיחה נמחקה.");
            }

            // עדכון השדות של השיחה הקיימת עם המידע החדש
            _mapper.Map(conversationDto, existingConversation);

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
            return _mapper.Map<ConversationDto>(existingConversation);
        }



        public async Task<bool> DeleteConversationAsync(int id)
        {
            var conversation = await _conversationRepository.GetConversationByIdAsync(id);
            if (conversation == null) return false;

            return await _conversationRepository.DeleteAsync(id);
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
