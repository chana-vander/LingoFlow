

using AutoMapper;
using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
using LingoFlow.Core.Repositories;
using LingoFlow.Core.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IManagerRepository _managerRepository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        public UserService(IManagerRepository repositoryManager, IMapper mapper, IUserRepository userRepository, IConfiguration configuration)
        {
            _managerRepository = repositoryManager;
            _mapper = mapper;
            _userRepository = userRepository;
            _configuration = configuration; 

        }

        public async Task<IEnumerable<UserLoginDto>> GetAllUsersAsync()
        {
            var user = await _managerRepository.UserM.GetAllUsersAsync();
            return _mapper.Map<IEnumerable<UserLoginDto>>(user);
        }

        public async Task<UserLoginDto> GetUserByIdAsync(int id)
        {
            var user = await _managerRepository.UserM.GetUserByIdAsync(id);
            return _mapper.Map<UserLoginDto>(user);
        }
        public async Task<UserRegisterDto> AddUserAsync(UserRegisterDto user)
        {
            // בדיקה אם קיים משתמש עם אותו מייל
            var existingUser = await _userRepository.GetUserByEmailAsync(user.Email);
            if (existingUser != null)
            {
                Console.WriteLine("User with this email already exists");
                return null;
            }

            // מיפוי והוספת המשתמש
            var addUser = _mapper.Map<User>(user);

            // קביעת RoleId לפי המייל של המנהל
            string adminEmail = _configuration["AdminEmail"] ?? string.Empty;
            Console.WriteLine("adminEmail "+ adminEmail);
            addUser.RoleId = user.Email == adminEmail ? 2 : 1; // 2 = Admin, 1 = User

            // שמירה ב-Repository
            var createdUser = await _userRepository.AddUserAsync(addUser);
            await _managerRepository.SaveChangesAsync();

            // החזרת DTO
            return _mapper.Map<UserRegisterDto>(createdUser);
        }

        public async Task<UserRegisterDto> UpdateUserAsync(int id, UserRegisterDto user)
        {
            if (id < 0 || user == null)
                return null;
            var updateUser = _mapper.Map<User>(user);
            var result = await _managerRepository.UserM.UpdateUserAsync(id, updateUser);
            Console.WriteLine("נקודת עצירה");
            await _managerRepository.SaveChangesAsync();

            return _mapper.Map<UserRegisterDto>(result);
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            await _managerRepository.SaveChangesAsync();
            return await _managerRepository.UserM.DeleteUserAsync(id);
        }
        //לסדר את ענין המשתמש
        public async Task<string?> AuthenticateAsync(string email, string password)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);
            if (user == null)
            {
                Console.WriteLine("User not found!");
                return null;
            }
            Console.WriteLine($"Verifying password for user: {user.Email}");
            //Console.WriteLine($"Stored Hash from DB: '{user.Password}'");
            Console.WriteLine("user.password: " + user.Password);
            if (!VerifyPassword(password, user.Password))
            {
                Console.WriteLine("Invalid password");
                return null;
            }
            //change here:
            return "USER";
            //return user.Role;
        }


        public async Task<bool> RegisterAsync(string email, string password, string role)
        {
            if (await _userRepository.GetUserByEmailAsync(email) != null)
            {
                return false; // המשתמש כבר קיים
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password, workFactor: 11);
            Console.WriteLine("on register: " + hashedPassword);
            var user = new User { Email = email, Password = hashedPassword };

            await _userRepository.AddUserAsync(user);
            return true;
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
        private bool VerifyPassword(string enteredPassword, string storedHash)
        {
            Console.WriteLine($"Stored Hash from DB on verifyPass fun: '{storedHash}'");
            bool isMatch = BCrypt.Net.BCrypt.Verify(enteredPassword, storedHash);
            Console.WriteLine($"BCrypt.Verify result: {isMatch}");
            return isMatch;
        }

        public async Task<UserLoginDto> GetUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);
            return _mapper.Map<UserLoginDto>(user);
        }
    }
}
