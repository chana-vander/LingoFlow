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
    public class FeedbackRepository : IFeedbackRepository
    {
        private readonly DataContext _context;

        public FeedbackRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<Feedback> AddAsync(Feedback feedback)
        {
            await _context.Feedbacks.AddAsync(feedback);
            await _context.SaveChangesAsync();
            return feedback;
        }

        public async Task<IEnumerable<Feedback>> GetAllFeedbacksAsync()
        {
            return await _context.Feedbacks.ToListAsync();
        }
        public async Task<Feedback?> GetFeedbackByIdAsync(int id)
        {
            return await _context.Feedbacks.FirstOrDefaultAsync(c => c.Id == id);  // מחפש את המשתמש לפי מזהה
        }
        public async Task<Feedback> UpdateAsync(Feedback feedback)
        {
            _context.Feedbacks.Update(feedback);
            await _context.SaveChangesAsync();
            return feedback;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var feedback = await _context.Feedbacks.FindAsync(id);
            if (feedback == null)
                return false;

            _context.Feedbacks.Remove(feedback);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
