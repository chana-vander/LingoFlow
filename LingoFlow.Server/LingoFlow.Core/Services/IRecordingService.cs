using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Services
{
    public interface IrecordingService
    {
        Task<IEnumerable<Recording>> GetAllrecordingsAsync();  // ����� ������
        Task<Recording?> GetrecordingByIdAsync(int id); // ������ �� ������� ������ ����� ����
        Task<Recording> AddrecordingAsync(recordingDto recording); // ����� ����
        //Task<bool> StartRecordingAsync(int userId, int TopicId);
        //Task<recording?> StartRecordingAsync(int userId, int TopicId);
        Task<recordingDto> UpdaterecordingAsync(int id, recordingDto recordingDto);
        Task<bool> DeleterecordingAsync(int id);
        Task<string> UploadToS3Async(Stream fileStream, string topicName, int userId);
        Task<List<Recording>> GetRecordingsByUserIdAsync(int userId);


    }
}
