using System.ComponentModel.DataAnnotations;

public class LogInDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 8)]
    public string MasterPassword { get; set; }
}