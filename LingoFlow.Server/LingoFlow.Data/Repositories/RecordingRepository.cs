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

        public async Task<IEnumerable<Recording>> GetAllrecordingsAsync()
        {
            return await _context.Recordings.ToListAsync();
        }
        public async Task<Recording?> GetrecordingByIdAsync(int id)
        {
            return await _context.Recordings.FirstOrDefaultAsync(c => c.Id == id);  // מחפש את המשתמש לפי מזהה
        }
        public async Task<Recording> AddrecordingAsync(Recording recording)
        {
            if (recording == null)
            {
                throw new ArgumentNullException(nameof(recording));
            }

            _context.Recordings.Add(recording); // מוסיף את ההקלטה   למסד הנתונים
            await _context.SaveChangesAsync(); // שומר את השינויים

            return recording;
        }
        public async Task<Recording> UpdateAsync(Recording recording)
        {
            _context.Recordings.Update(recording);
            await _context.SaveChangesAsync();
            return recording;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var recording = await _context.Recordings.FindAsync(id);
            if (recording == null)
                return false;

            _context.Recordings.Remove(recording);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<List<Recording>> GetByUserIdAsync(int userId)
        {
            return await _context.Recordings
                .Where(r => r.UserId == userId)
                .ToListAsync();
        }

    }
}
