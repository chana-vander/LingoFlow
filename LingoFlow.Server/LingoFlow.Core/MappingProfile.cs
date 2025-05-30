using AutoMapper;
using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
//using LingoFlow.Api.Models;

namespace LingoFlow.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile() // ����������
        {
            CreateMap<User, UserRegisterDto>().ReverseMap();
            //CreateMap<User, UserRegisterPostModel>().ReverseMap();

            CreateMap<User, UserLoginDto>().ReverseMap();
            //CreateMap<UserRegisterPostModel, UserRegisterDto>();
            CreateMap<recording, recordingDto>().ReverseMap();
            CreateMap<Feedback, FeedbackDto>().ReverseMap();
            CreateMap<Topic, TopicDto>().ReverseMap();
            CreateMap<Vocabulary, VocabularyDto>().ReverseMap();
        }
    }
}
