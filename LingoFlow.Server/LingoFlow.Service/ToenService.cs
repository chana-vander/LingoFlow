using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LingoFlow.Core.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

public class TokenService : ITokenService
{
    private readonly string _jwtSecret;
    private readonly string _jwtIssuer;
    private readonly string _jwtAudience;
    private readonly int _jwtExpiryHours;

    public TokenService(IConfiguration configuration)
    {
        // ����� ������ �����������
        _jwtSecret = configuration["Jwt:Secret"] ?? throw new Exception("JWT Secret is not configured.");
        _jwtIssuer = configuration["Jwt:Issuer"] ?? throw new Exception("JWT Issuer is not configured.");
        _jwtAudience = configuration["Jwt:Audience"] ?? throw new Exception("JWT Audience is not configured.");
        _jwtExpiryHours = int.TryParse(configuration["Jwt:ExpiryHours"], out var expiryHours) ? expiryHours : 2; // ����� ���� �� 2 ����
    }

    // ����� JWT Token
    public string GenerateJwtToken(string email, string role)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_jwtSecret);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, email),
            new Claim(ClaimTypes.Role, role) // ����� ����� ����
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = _jwtIssuer,
            Audience = _jwtAudience,
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(_jwtExpiryHours), // ��� �����
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    // ����� JWT Token
    public bool ValidateJwtToken(string token, out string email, out string role)
    {
        email = string.Empty;
        role = string.Empty;

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_jwtSecret);

        try
        {
            var parameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true, // ����� ������
                ValidIssuer = _jwtIssuer, // ������
                ValidateAudience = true, // ����� ����
                ValidAudience = _jwtAudience, // ����
                ClockSkew = TimeSpan.Zero // �� ����� �� �����
            };

            var principal = tokenHandler.ValidateToken(token, parameters, out _);
            var emailClaim = principal.FindFirst(ClaimTypes.Name);
            var roleClaim = principal.FindFirst(ClaimTypes.Role);

            if (emailClaim == null || roleClaim == null) return false;

            email = emailClaim.Value;
            role = roleClaim.Value;
            return true;
        }
        catch (SecurityTokenException)
        {
            // ����� ������� �� Token Validation
            return false;
        }
        catch (Exception)
        {
            // ����� ������� ������
            return false;
        }
    }
}
