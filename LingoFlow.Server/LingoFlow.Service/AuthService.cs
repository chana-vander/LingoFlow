using LingoFlow.Core.Models;
using LingoFlow.Core.Services;
using LingoFlow.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly DataContext _context;

    public AuthService(IConfiguration configuration, DataContext context)
    {
        _configuration = configuration;
        _context = context;
    }
    public string GenerateJwtToken(string username, string role)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, username),
        new Claim(ClaimTypes.Role, role) // הוספת תפקיד אחד בלבד
    };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    
}