using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
using System.Threading.Tasks;

namespace LingoFlow.Core.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(int id);
        Task<User> AddUserAsync(User user);
        Task<User> UpdateUserAsync(int id, User user);
        Task<bool> DeleteUserAsync(int id);

        // עדכון השם כך שיהיה תואם ל-UserRepository
        Task<User> GetUserByEmailAsync(string email);

    }
}
