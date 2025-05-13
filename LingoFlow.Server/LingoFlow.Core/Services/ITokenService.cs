using LingoFlow.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Services
{
    public interface ITokenService
    {
        string GenerateJwtToken(string email, string role);
        bool ValidateJwtToken(string token, out string email, out string role);
    }
}
