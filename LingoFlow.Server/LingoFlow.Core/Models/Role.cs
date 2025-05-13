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
        public string RoleName { get; set; } // למשל "Admin", "User"

        public List<User> Users { get; set; } = new();// קשר הפוך ל-User (הרבה משתמשים יכולים להיות משויכים לתפקיד אחד)
    }
}
