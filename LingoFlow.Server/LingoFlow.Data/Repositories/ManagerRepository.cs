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
        public IConversationRepository ConversationM { get; }
        public IFeedbackRepository FeedbackM { get; }
        public ITopicRepository TopicM { get; }
        public IWordRepository WordM { get; }

        public ManagerRepository(DataContext dataContext, IUserRepository userM, IConversationRepository conversationM, IFeedbackRepository feedbackM, ITopicRepository TopicM, IWordRepository wordM)
        {
            _dataContext = dataContext;
            UserM = userM;
            ConversationM = conversationM;
            FeedbackM = feedbackM;
            TopicM = TopicM;
            WordM = wordM;
        }

        public async Task SaveChangesAsync()
        {
            await _dataContext.SaveChangesAsync();
        }

    }
}
