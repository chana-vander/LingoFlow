using System.ComponentModel.DataAnnotations;

namespace LingoFlow.Api.Models
{
    public class UserLoginPostModel
    {
        //[Required]
        //[EmailAddress]
        //public string Email { get; set; } = string.Empty;
        public string Email { get; set; }

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
