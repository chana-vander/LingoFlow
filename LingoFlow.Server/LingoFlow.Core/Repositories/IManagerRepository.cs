using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Repositories
{
    public interface IManagerRepository
    {

        IUserRepository UserM { get; }
        IrecordingRepository recordingM { get; }
        IFeedbackRepository FeedbackM { get; }
        ITopicRepository TopicM { get; }
        IVocabularyRepository WordM { get; }

        //Task SaveChangesAsync();
        Task SaveChangesAsync();


    }
}
