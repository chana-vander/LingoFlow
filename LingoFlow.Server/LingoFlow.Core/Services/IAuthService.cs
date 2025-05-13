using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Services
{
    public interface IAuthService
    {
        //string GenerateJwtToken(string username, string[] roles);

        //Task<User?> RegisterUserAsync(UserRegisterDto userDto);
        //Task<string?> LoginUserAsync(UserLoginDto loginModel);
        //Task<string?> AuthenticateAsync(string email, string password);
        string GenerateJwtToken(string username, string role);
    }

}
