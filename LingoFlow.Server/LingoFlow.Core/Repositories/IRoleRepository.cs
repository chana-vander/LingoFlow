using LingoFlow.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Repositories
{
    public interface IRoleRepository
    {
        Task<IEnumerable<Role>> GetAllAsync();
        Task<Role> GetRoleByIdAsync(int id);
        Task<int> GetIdByRoleAsync(string role);
        Task<Role> AddAsync(Role role);
        Task<bool> UpdateAsync(int id, Role role);
        Task DeleteAsync(int id);
    }
}
