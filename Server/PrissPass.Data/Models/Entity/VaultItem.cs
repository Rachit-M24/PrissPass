using System.ComponentModel.DataAnnotations;

namespace PrissPass.Data.Models.Entity
{
    public class VaultItem
    {
        [Key]
        public Guid VaultId { get; set; } = Guid.NewGuid();

        public string SiteName { get; set; }

        public string? EncryptedUrl { get; set; }

        public string EncryptedPassword { get; set; }

        public string? EncryptedNotes { get; set; }

        // Foreign Key
        public Guid UserId { get; set; }

        public User User { get; set; }
    }
}
