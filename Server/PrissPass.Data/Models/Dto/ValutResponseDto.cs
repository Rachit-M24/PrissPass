public class VaultItemResponse
{
    public Guid VaultId { get; set; }
    public string SiteName { get; set; }
    public string? Url { get; set; }
    public string Password { get; set; }
    public string? Notes { get; set; }
}