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
    public class TopicRepository : ITopicRepository
    {

        private readonly DataContext _context;

        public TopicRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Topic>> GetAllTopicsAsync()
        {
            //Console.WriteLine("repository");
            return await _context.Topics.ToListAsync();
        }
        public async Task<Topic?> GetTopicByIdAsync(int id)
        {
            return await _context.Topics.FirstOrDefaultAsync(c => c.Id == id);  // מחפש את המשתמש לפי מזהה
        }

        public async Task<List<Topic>> GetTopicsByLevelAsync(int level)
        {
            return await _context.Topics.Where(s => s.Level == level).ToListAsync();
        }

        public async Task<Topic> AddAsync(Topic Topic)
        {
            var result = await _context.Topics.AddAsync(Topic);
            await _context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<Topic> UpdateAsync(Topic Topic)
        {
            _context.Topics.Update(Topic);
            await _context.SaveChangesAsync();
            return Topic;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var Topic = await _context.Topics.FindAsync(id);
            if (Topic == null) return false;

            _context.Topics.Remove(Topic);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
