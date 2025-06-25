using LingoFlow.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Dto
{
    public class recordingDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }// ���� ������ ���� �� �����
        public int TopicId { get; set; }// ���� ����� �� �����
        public string Name { get; set; } // �� ������
        public TimeSpan Length { get; set; } // ��� ��� �����      
        public string Url { get; set; }// ����� ���� ������
        public DateTime Date { get; set; }// ����� �����
        public string? Transcription { get; set; } // ��� ������

    }
}
