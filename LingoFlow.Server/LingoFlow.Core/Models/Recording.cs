using System;

namespace LingoFlow.Core.Models
{
    public class Recording
    {
        public int Id { get; set; }

        // ���� ������ ������ �� �����
        public int UserId { get; set; }
        public User User { get; set; }

        // ���� ����� �� �����
        public int TopicId { get; set; }
        public Topic Topic { get; set; }


        // ����� ����� �����
        public string Url { get; set; }

        // �� ������
        public string Name { get; set; }

        // ����� ����� �����
        public DateTime Date { get; set; }

        // ��� ��� �����
        public TimeSpan Length { get; set; }
        // ������ �� �����
        public string? Transcription { get; set; } // ? ��� ��� ������
        //one to one:
        public Feedback Feedback { get; set; }
    }
}
