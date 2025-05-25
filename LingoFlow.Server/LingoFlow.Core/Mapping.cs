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
        public static ConversationDto MapToConversationDto(Conversation conversation)
        {
            return new ConversationDto
            {
                Id = conversation.Id,
                UserId = conversation.UserId,
                TopicId = conversation.TopicId,
                //FeedbackId = conversation.FeedbackId,
                Url = conversation.Url,
                Name = conversation.Name,
                Date = conversation.Date,
                Length = conversation.Length
            };
        }

        public static FeedbackDto MapFeedbackDto(Feedback feedback)
        {
            return new FeedbackDto
            {
                Id = feedback.Id,
                ConversationId = feedback.ConversationId,

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
        public static WordDto MapToWordDto(Word word)
        {
            return new WordDto { Name = word.Name, Translation = word.Translation };
        }
    }
}
