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
        public int UserId { get; set; }// מזהה המשתמש שיצר את השיחה
        public int TopicId { get; set; }// מזהה הנושא של השיחה
        public string Name { get; set; } // שם ההקלטה
        public TimeSpan Length { get; set; } // משך זמן השיחה      
        public string Url { get; set; }// כתובת קובץ ההקלטה
        public DateTime Date { get; set; }// תאריך השיחה
        public string? Transcription { get; set; } // שדה לתמלול

    }
}
