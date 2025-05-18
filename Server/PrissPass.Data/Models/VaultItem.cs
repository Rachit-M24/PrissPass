using System.ComponentModel.DataAnnotations;

public class VaultItem
{   
    [Key]
    public Guid VaultId { get; set; } = Guid.NewGuid();

    [Required]
    public string SiteName { get; set; }

    public string? Url { get; set; }

    [Required]
    public string EncryptedPassword { get; set; }

    public string? Notes { get; set; }

    // Foreign Key
    public Guid UserId { get; set; }

    // Navigation property
    public User User { get; set; }
}
