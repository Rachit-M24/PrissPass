
using System.ComponentModel.DataAnnotations;

namespace PrissPass.Data.Models.Dto
{
    public class VaultItemRequest
    {
        [Required(ErrorMessage = "Please enter the name of the site.")]
        public string SiteName { get; set; }
        public string? Url { get; set; }

        [Required(ErrorMessage = "Please enter the password.")]
        [StringLength(100)]
        public string Password { get; set; }

        public string? Notes { get; set; }
    }
}
