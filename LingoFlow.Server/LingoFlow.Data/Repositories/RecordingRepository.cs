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
    public class recordingRepository : IrecordingRepository
    {
        private readonly DataContext _context;

        public recordingRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<recording>> GetAllrecordingsAsync()
        {
            return await _context.recordings.ToListAsync();
        }
        public async Task<recording?> GetrecordingByIdAsync(int id)
        {
            return await _context.recordings.FirstOrDefaultAsync(c => c.Id == id);  // מחפש את המשתמש לפי מזהה
        }
        public async Task<recording> AddrecordingAsync(recording recording)
        {
            if (recording == null)
            {
                throw new ArgumentNullException(nameof(recording));
            }

            _context.recordings.Add(recording); // מוסיף את השיחה למסד הנתונים
            await _context.SaveChangesAsync(); // שומר את השינויים

            return recording;
        }
        public async Task<recording> UpdateAsync(recording recording)
        {
            _context.recordings.Update(recording);
            await _context.SaveChangesAsync();
            return recording;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var recording = await _context.recordings.FindAsync(id);
            if (recording == null)
                return false;

            _context.recordings.Remove(recording);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<List<recording>> GetByUserIdAsync(int userId)
        {
            return await _context.recordings
                .Where(r => r.UserId == userId)
                .ToListAsync();
        }

    }
}
