
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
    public class VocabularyRepository : IVocabularyRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public VocabularyRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Vocabulary>> GetAllVocabularyAsync()
        {
            return await _context.Words.ToListAsync();
        }

        public async Task<Vocabulary?> GetVocabularyByIdAsync(int id)
        {
            return await _context.Words.FirstOrDefaultAsync(c => c.Id == id);  // ���� �� ����� ��� ����
        }
        public async Task<List<VocabularyDto>> GetVocabularyByTopicIdAsync(int TopicId)
        {
            var words = await _context.Words.Where(w => w.TopicId == TopicId).ToListAsync();
            return _mapper.Map<List<VocabularyDto>>(words);
        }
        public async Task<Vocabulary?> GetVocabularyByTextAsync(string wordText)
        {
            // ���� �� ���: ����� ������ ������ �� ��� ����� ������� �-ToLower()
            return await _context.Words.FirstOrDefaultAsync(w => w.Word == wordText.ToLower());
        }


        public async Task<VocabularyDto> AddVocabularyAsync(Vocabulary word)
        {
            await _context.Words.AddAsync(word);
            await _context.SaveChangesAsync();
            return _mapper.Map<VocabularyDto>(word); // ���� ������ �-DTO ���� ������
        }

        public async Task<VocabularyDto> UpdateVocabularyAsync(int id, VocabularyDto wordDto)
        {
            var existingWord = await _context.Words.FindAsync(id);
            if (existingWord == null)
            {
                return null; // ���� ������ null ��� ���� ������ �� �����
            }

            _mapper.Map(wordDto, existingWord); // ����� ������ ������ ������
            await _context.SaveChangesAsync();
            return _mapper.Map<VocabularyDto>(existingWord);
        }

        public async Task<bool> DeleteVocabularyAsync(int id)
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
