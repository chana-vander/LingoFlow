using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Models
{
    public class Role
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; } // ���� "Admin", "User"

        public List<User> Users { get; set; } = new();// ��� ���� �-User (���� ������� ������ ����� ������� ������ ���)
    }
}
