using System.ComponentModel.DataAnnotations;

public class LogInDto
{
    [Required(ErrorMessage = "Please enter email address.")]
    [StringLength(100, ErrorMessage = "Email address cannot be longer than 100 characters.")]
    [EmailAddress]
    public string Email { get; set; }

    [Required(ErrorMessage = "Please enter valid master password.")]
    [StringLength(100, MinimumLength = 8)]
    public string MasterPassword { get; set; }
}