using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Services
{
    public interface IConversationService
    {
        Task<IEnumerable<Conversation>> GetAllConversationsAsync();  // תיקון החתימה
        Task<Conversation?> GetConversationByIdAsync(int id); // הוספנו גם פונקציה לחיפוש משתמש בודד
        Task<Conversation> AddConversationAsync(ConversationDto conversation); // הוספת שיחה
        //Task<bool> StartRecordingAsync(int userId, int TopicId);
        //Task<Conversation?> StartRecordingAsync(int userId, int TopicId);
        Task<ConversationDto> UpdateConversationAsync(int id, ConversationDto conversationDto);
        Task<bool> DeleteConversationAsync(int id);
        Task<string> UploadToS3Async(Stream fileStream, string topicName, int userId);
        Task<List<Conversation>> GetRecordingsByUserIdAsync(int userId);


    }
}
