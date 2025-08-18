using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PrissPass.Data.Models.Entity
{
    /// <summary>
    /// Represents the relationship between a vault and an item stored inside it.
    /// </summary>
    public class VaultItem
    {
        /// <summary>
        /// Gets or sets the unique identifier for this vault-item relationship.
        /// </summary>
        [Key]
        public Guid VaultItemId { get; set; } = Guid.NewGuid();
        /// <summary>
        /// Gets or sets the unique identifier of the vault this item belongs to.
        /// </summary>
        public Guid VaultId { get; set; } = Guid.NewGuid();

        /// <summary>
        /// Gets or sets the unique identifier of the stored item.
        /// </summary>
        public Guid ItemId { get; set; }

        /// <summary>
        /// Navigation property for the related item entity.
        /// </summary>
        [ForeignKey("ItemId")]
        public Items Items { get; set; }

        /// <summary>
        /// Navigation property for the related vault entity.
        /// </summary>
        [ForeignKey("VaultId")]
        public Vaults Vaults { get; set; }
    }
}
