using System.ComponentModel.DataAnnotations;

public class User
{
    [Key]
    public Guid UserId { get; set; } = Guid.NewGuid();

    public string Username { get; set; }

    public string Email { get; set; }

    public string MasterPassword { get; set; }

    public string PasswordSalt { get; set; }

    // Navigation property
    public virtual ICollection<VaultItem> VaultItems { get; set; }
}
