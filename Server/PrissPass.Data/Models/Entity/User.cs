using System.ComponentModel.DataAnnotations;

public class User
{
    [Key]
    public Guid UserId { get; set; } = Guid.NewGuid();

    [Required]
    public string Username { get; set; }

    [Required]
    public string Email { get; set; }

    [Required]
    public string MasterPassword { get; set; }
   
    public string PasswordSalt { get; set; }

    // Navigation property
    public virtual ICollection<VaultItem> VaultItems { get; set; }
}
