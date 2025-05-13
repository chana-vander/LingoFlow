

using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
using LingoFlow.Core.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }
        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);  // מחפש את המשתמש לפי מזהה
        }
        public async Task<User> AddUserAsync(User user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();  // שמירה למסד נתונים

            return user;
        }
        public async Task<User> UpdateUserAsync(int id, User user)
        {
            var existingUser = await GetUserByIdAsync(id);
            if (existingUser == null)
                return null;
            existingUser.Id = id;
            existingUser.Name = user.Name;
            existingUser.Email = user.Email;
            existingUser.Password = user.Password;

            existingUser.CreatedAt = user.CreatedAt;

            return user;
        }
        public async Task<bool> DeleteUserAsync(int id)//   Task<bool> DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id); // הוספת await
            if (user == null)
                return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        //here2
        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
