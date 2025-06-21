using LingoFlow.Core.Dto;
//using LingoFlow.Core.DTOs;
using LingoFlow.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core
{
    public static class Mapping
    {
        public static UserLoginDto MapToUserLoginDto(User user)
        {
            return new UserLoginDto { Email = user.Email, Password = user.Password };
        }
        public static recordingDto MapTorecordingDto(Recording recording)
        {
            return new recordingDto
            {
                Id = recording.Id,
                UserId = recording.UserId,
                TopicId = recording.TopicId,
                //FeedbackId = recording.FeedbackId,
                Url = recording.Url,
                Name = recording.Name,
                Date = recording.Date,
                Length = recording.Length
            };
        }

        public static FeedbackDto MapFeedbackDto(Feedback feedback)
        {
            return new FeedbackDto
            {
                Id = feedback.Id,
                recordingId = feedback.recordingId,

                UsedWordsCount = feedback.UsedWordsCount,
                TotalWordsRequired = feedback.TotalWordsRequired,

                GrammarScore = feedback.GrammarScore,
                GrammarComment = feedback.GrammarComment,

                FluencyScore = feedback.FluencyScore,
                FluencyComment = feedback.FluencyComment,

                VocabularyScore = feedback.VocabularyScore,
                VocabularyComment = feedback.VocabularyComment,

                GeneralFeedback = feedback.GeneralFeedback,
                Score = feedback.Score
            };
        }

        public static TopicDto MapToTopicDto(Topic Topic)
        {
            return new TopicDto { Id = Topic.Id, Name = Topic.Name };
        }
        public static VocabularyDto MapToWordDto(Vocabulary word)
        {
            return new VocabularyDto { Word = word.Word, WordTranslation = word.WordTranslation };
        }
    }
}
