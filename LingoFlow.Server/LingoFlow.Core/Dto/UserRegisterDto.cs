using LingoFlow.Core.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Dto
{
    public class UserRegisterDto
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }
        public string Password { get; set; }

        //public DateTime CreatedAt { get; set; }
    }
}
