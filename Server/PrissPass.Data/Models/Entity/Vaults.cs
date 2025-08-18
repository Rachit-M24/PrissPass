using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Gets or sets the identifier or name of the entity that created the vault.
    /// </summary>
    public string? CreatedBy { get; set; }

    /// <summary>
    /// Gets or sets the identifier of the user who owns this vault.
    /// </summary>
    public Guid UserId { get; set; }
    
    /// <summary>
    /// Navigation property for the collection of items stored in this vault.
    /// </summary>
    public virtual ICollection<VaultItem>? VaultItems { get; set; }

    /// <summary>
    /// Navigation property for the user who owns this vault.
    /// </summary>
    [ForeignKey("UserId")]
    public virtual Users? User { get; set; }
}
