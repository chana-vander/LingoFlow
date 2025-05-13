using LingoFlow.Core.Models;
using LingoFlow.Core.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Data.Repositories
{
    public class ConversationRepository : IConversationRepository
    {
        private readonly DataContext _context;

        public ConversationRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Conversation>> GetAllConversationsAsync()
        {
            return await _context.Conversations.ToListAsync();
        }
        public async Task<Conversation?> GetConversationByIdAsync(int id)
        {
            return await _context.Conversations.FirstOrDefaultAsync(c => c.Id == id);  // מחפש את המשתמש לפי מזהה
        }
        public async Task<Conversation> AddConversationAsync(Conversation conversation)
        {
            if (conversation == null)
            {
                throw new ArgumentNullException(nameof(conversation));
            }

            _context.Conversations.Add(conversation); // מוסיף את המשתמש למסד הנתונים
            await _context.SaveChangesAsync(); // שומר את השינויים

            return conversation;
        }
        public async Task<Conversation> UpdateAsync(Conversation conversation)
        {
            _context.Conversations.Update(conversation);
            await _context.SaveChangesAsync();
            return conversation;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var conversation = await _context.Conversations.FindAsync(id);
            if (conversation == null)
                return false;

            _context.Conversations.Remove(conversation);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
