
using AutoMapper;
using LingoFlow.Core.Dto;
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
    public class WordRepository : IWordRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public WordRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Word>> GetAllWordsAsync()
        {
            return await _context.Words.ToListAsync();
        }

        public async Task<Word?> GetWordByIdAsync(int id)
        {
            return await _context.Words.FirstOrDefaultAsync(c => c.Id == id);  // מחפש את המילה לפי מזהה
        }
        public async Task<List<WordDto>> GetWordsByTopicIdAsync(int TopicId)
        {
            var words = await _context.Words.Where(w => w.TopicId == TopicId).ToListAsync();
            return _mapper.Map<List<WordDto>>(words);
        }
        public async Task<Word?> GetWordByTextAsync(string wordText)
        {
            // שימו לב כאן: עושים השוואת מיתרים על ידי שינוי המיתרים ל-ToLower()
            return await _context.Words.FirstOrDefaultAsync(w => w.Name.ToLower() == wordText.ToLower());
        }


        public async Task<WordDto> AddWordAsync(Word word)
        {
            await _context.Words.AddAsync(word);
            await _context.SaveChangesAsync();
            return _mapper.Map<WordDto>(word); // המרת היישות ל-DTO לפני ההחזרה
        }

        public async Task<WordDto> UpdateWordAsync(int id, WordDto wordDto)
        {
            var existingWord = await _context.Words.FindAsync(id);
            if (existingWord == null)
            {
                return null; // אפשר להחזיר null כדי לסמן שהמילה לא נמצאה
            }

            _mapper.Map(wordDto, existingWord); // עדכון הערכים ביישות הקיימת
            await _context.SaveChangesAsync();
            return _mapper.Map<WordDto>(existingWord);
        }

        public async Task<bool> DeleteWordAsync(int id)
        {
            var word = await _context.Words.FindAsync(id);
            if (word == null)
            {
                return false;
            }

            _context.Words.Remove(word);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
