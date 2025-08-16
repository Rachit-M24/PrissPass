using System.ComponentModel.DataAnnotations;
using PrissPass.Data.Models.Entity;


/// <summary>
/// Represents a vault that belongs to a user and contains multiple items.
/// </summary>
public class Vaults
{
    /// <summary>
    /// Gets or sets the unique identifier for the vault.
    /// </summary>
    [Key]
    public Guid VaultId { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Gets or sets the date and time when the vault was created.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Gets or sets the date and time representing who created the vault.
    /// (Currently stored as DateTime, may later be linked to a user.)
    /// </summary>
    public DateTime CreatedBy { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Gets or sets the identifier of the user who owns the vault.
    /// </summary>
    public Guid UserId { get; set; }
    
    /// <summary>
    /// Navigation property for the collection of vault items within the vault.
    /// </summary>
    public virtual ICollection<VaultItem> VaultItems { get; set; }

    /// <summary>
    /// Navigation property for the user who owns the vault.
    /// </summary>
    public virtual User User { get; set; }
}
