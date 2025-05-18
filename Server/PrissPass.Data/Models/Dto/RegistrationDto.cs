using System.ComponentModel.DataAnnotations;

public class    RegistrationDto
{
    [Required]
    public string Username { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 8)]
    public string MasterPassword { get; set; }
}