using AutoMapper;
using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
//using LingoFlow.Api.Models;

namespace LingoFlow.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile() // קונסטרקטור
        {
            CreateMap<User, UserRegisterDto>().ReverseMap();
            //CreateMap<User, UserRegisterPostModel>().ReverseMap();

            CreateMap<User, UserLoginDto>().ReverseMap();
            //CreateMap<UserRegisterPostModel, UserRegisterDto>();
            CreateMap<Conversation, ConversationDto>().ReverseMap();
            CreateMap<Feedback, FeedbackDto>().ReverseMap();
            CreateMap<Topic, TopicDto>().ReverseMap();
            CreateMap<Word, WordDto>().ReverseMap();
        }
    }
}
