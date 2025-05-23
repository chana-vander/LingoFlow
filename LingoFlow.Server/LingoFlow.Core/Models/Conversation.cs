﻿using System;

namespace LingoFlow.Core.Models
{
    public class Conversation
    {
        public int Id { get; set; }

        // מזהה המשתמש שהקליט את השיחה
        public int UserId { get; set; }
        public User User { get; set; }

        // מזהה הנושא של השיחה
        public int TopicId { get; set; }
        public Topic Topic { get; set; }

        //// מזהה המשוב (אופציונלי)
        //public int? FeedbackId { get; set; }
        //public Feedback Feedback { get; set; }

        // כתובת הקלטת השיחה
        public string Url { get; set; }

        // שם ההקלטה
        public string Name { get; set; }

        // תאריך העלאת השיחה
        public DateTime Date { get; set; }

        // משך זמן השיחה
        public TimeSpan Length { get; set; }
    }
}
