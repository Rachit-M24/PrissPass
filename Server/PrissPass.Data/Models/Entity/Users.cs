using System.ComponentModel.DataAnnotations;

namespace PrissPass.Data.Models.Entity
{
    /// <summary>
    /// Represents an application user in the system.
    /// </summary>
    public class Users
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
        /// Gets or sets the email address of the user.
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the master password of the user (stored in encrypted form).
        /// </summary>
        public string MasterPassword { get; set; }

        /// <summary>
        /// Gets or sets the password salt used for hashing the master password.
        /// </summary>
        public string PasswordSalt { get; set; }

        /// <summary>
        /// Gets or sets the identifier or name of the entity that created the user record.
        /// </summary>
        public string? CreatedBy { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the user record was created.
        /// </summary>
        public DateTime? CreatedDate { get; set; }

        /// <summary>
        /// Navigation property for the vault associated with this user.
        /// </summary>
        public virtual Vaults? Vaults { get; set; }
    }
}
