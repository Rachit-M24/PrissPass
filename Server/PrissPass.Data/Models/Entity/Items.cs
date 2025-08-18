using System.ComponentModel.DataAnnotations;

namespace PrissPass.Data.Models.Entity
{
    /// <summary>
    /// Represents a single stored item in the vault, containing encrypted credential information.
    /// </summary>
    public class Items
    {
        /// <summary>
        /// Gets or sets the unique identifier for the item.
        /// </summary>
        [Key]
        public Guid ItemId { get; set; } = Guid.NewGuid();
        /// <summary>
        /// Gets or sets the encrypted name of the site or service associated with the item.
        /// </summary>
        public string EncryptedSiteName { get; set; }

        /// <summary>
        /// Gets or sets the encrypted URL for the site or service.
        /// </summary>
        public string? EncryptedUrl { get; set; }

        /// <summary>
        /// Gets or sets the encrypted password for the site or service.
        /// </summary>
        public string EncryptedPassword { get; set; }

        /// <summary>
        /// Gets or sets any encrypted notes associated with the item.
        /// </summary>
        public string? EncryptedNotes { get; set; }

        /// <summary>
        /// Gets or sets the identifier or name of the entity that created this item.
        /// </summary>
        public string CreatedBy { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the item was created.
        /// </summary>
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Gets or sets the date and time when the item was last modified.
        /// </summary>
        public DateTime? ModifiedDate { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Navigation property for the collection of vault-item relationships that link this item to vaults.
        /// </summary>
        public virtual ICollection<VaultItem>? VaultItems { get; set; }
    }
}
