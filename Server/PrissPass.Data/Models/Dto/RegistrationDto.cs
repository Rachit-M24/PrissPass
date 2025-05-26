using System.ComponentModel.DataAnnotations;

public class RegistrationDto
{
    [Required(ErrorMessage = "Please enter the username.")]
    public string Username { get; set; }

    [Required(ErrorMessage = "Please enter an email address.")]
    [EmailAddress]
    public string Email { get; set; }

    [Required(ErrorMessage =" Please enter the master password.")]
    [StringLength(100, MinimumLength = 8)]
    public string MasterPassword { get; set; }
}