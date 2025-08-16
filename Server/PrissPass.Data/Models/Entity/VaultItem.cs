using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PrissPass.Data.Models.Entity
{
    /// <summary>
    /// Represents an item stored inside a vault.
    /// </summary>
    public class VaultItem
    {
        /// <summary>
        /// Gets or sets the unique identifier of the vault this item belongs to.
        /// </summary>
        public Guid VaultId { get; set; } = Guid.NewGuid();

        /// <summary>
        /// Gets or sets the unique identifier of the item.
        /// </summary>
        public Guid ItemId { get; set; }

        /// <summary>
        /// Navigation property for the related item.
        /// </summary>
        [ForeignKey("ItemId")]
        public Items Items { get; set; }

        /// <summary>
        /// Navigation property for the related vault.
        /// </summary>
        [ForeignKey("VaultId")]
        public Vaults Vaults { get; set; }
    }
}
