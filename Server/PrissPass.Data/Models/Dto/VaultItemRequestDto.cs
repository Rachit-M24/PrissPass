
using System.ComponentModel.DataAnnotations;

public class VaultItemRequest
{
    [Required(ErrorMessage = "Please enter the name of the site.")]
    public string SiteName { get; set; }
    public string? Url { get; set; }

    [Required(ErrorMessage = "Please enter the password.")]
    [StringLength(100, MinimumLength = 8)]
    public string EncryptedPassword { get; set; }

    public string? Notes { get; set; }
}
