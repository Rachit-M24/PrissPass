using System.ComponentModel.DataAnnotations;

namespace PrissPass.Data.Models.Entity
{
    /// <summary>
    /// Represents an application user in the system.
    /// </summary>
    public class User
    {
        /// <summary>
        /// Gets or sets the unique identifier for the user.
        /// </summary>
        [Key]
        public Guid UserId { get; set; } = Guid.NewGuid();

        /// <summary>
        /// Gets or sets the username of the user.
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// Gets or sets the email of the user.
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the master password of the user.
        /// </summary>
        public string MasterPassword { get; set; }

        /// <summary>
        /// Gets or sets the password salt used for hashing the master password.
        /// </summary>
        public string PasswordSalt { get; set; }

        /// <summary>
        /// Navigation property for the collection of vault items associated with the user.
        /// </summary>
        public virtual ICollection<VaultItem> VaultItems { get; set; }
    }
}
