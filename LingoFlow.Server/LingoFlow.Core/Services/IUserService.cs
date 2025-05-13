using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using LingoFlow.Api.Models;
namespace LingoFlow.Core.Services
{
    public interface IUserService
    {
        Task<IEnumerable<UserLoginDto>> GetAllUsersAsync();
        Task<UserLoginDto> GetUserByIdAsync(int id);
        //Task<UserLoginDto> AddUserAsync(UserRegisterDto user);
        Task<UserRegisterDto> AddUserAsync(UserRegisterDto user);
        Task<UserRegisterDto> UpdateUserAsync(int id, UserRegisterDto user);
        Task<bool> DeleteUserAsync(int id);
        Task<UserLoginDto> GetUserByEmailAsync(string email);
        Task<string?> AuthenticateAsync(string email, string password);
        Task<bool> RegisterAsync(string email, string password, string role);
    }

}
