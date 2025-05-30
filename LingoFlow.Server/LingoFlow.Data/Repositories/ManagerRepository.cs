using LingoFlow.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Data.Repositories
{
    public class ManagerRepository : IManagerRepository
    {

        DataContext _dataContext;

        public IUserRepository UserM { get; }
        public IrecordingRepository recordingM { get; }
        public IFeedbackRepository FeedbackM { get; }
        public ITopicRepository TopicM { get; }
        public IVocabularyRepository WordM { get; }

        public ManagerRepository(DataContext dataContext, IUserRepository userM, IrecordingRepository recordingM, IFeedbackRepository feedbackM, ITopicRepository TopicM, IVocabularyRepository wordM)
        {
            _dataContext = dataContext;
            UserM = userM;
            recordingM = recordingM;
            FeedbackM = feedbackM;
            TopicM = TopicM;
            WordM = wordM;
        }

        public async Task SaveChangesAsync()
        {
            Console.WriteLine("ok!!");
            await _dataContext.SaveChangesAsync();
            Console.WriteLine("ok");
        }

    }
}
