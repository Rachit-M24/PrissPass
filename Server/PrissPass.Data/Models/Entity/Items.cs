using System.ComponentModel.DataAnnotations;

namespace PrissPass.Data.Models.Entity
{
    /// <summary>
    /// Represents a single stored item in the password vault, containing encrypted credential information.
    /// </summary>
    public class Items
    {
        /// <summary>
        /// Gets or sets the unique identifier for the item.
        /// </summary>
        [Key]
        public Guid ItemId { get; set; } = Guid.NewGuid();
        /// <summary>
        /// Gets or sets the name of the site or service associated with the item.
        /// </summary>
        public string SiteName { get; set; }

        /// <summary>
        /// Gets or sets the encrypted URL for the site or service.
        /// </summary>
        public string? EncryptedUrl { get; set; }

        /// <summary>
        /// Gets or sets the encrypted password.
        /// </summary>
        public string EncryptedPassword { get; set; }

        /// <summary>
        /// Gets or sets any encrypted notes associated with the item.
        /// </summary>
        public string? EncryptedNotes { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the item was created.
        /// </summary>
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Gets or sets the date and time when the item was last updated.
        /// </summary>
        public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Navigation property for the join table relationship with Vaults.
        /// </summary>
        public virtual ICollection<VaultItem> VaultItems { get; set; }
    }
}
