using System.ComponentModel.DataAnnotations;

public class VaultItem
{
    [Key]
    public Guid VaultId { get; set; } = Guid.NewGuid();

    public string SiteName { get; set; }

    public string? Url { get; set; }

    public string EncryptedPassword { get; set; }

    public string? Notes { get; set; }

    // Foreign Key
    public Guid UserId { get; set; }

    public User User { get; set; }
}
