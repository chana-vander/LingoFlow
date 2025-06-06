using System.ComponentModel.DataAnnotations;

namespace LingoFlow.Api.Models
{
    public class UserRegisterPostModel
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; }

    }
}
