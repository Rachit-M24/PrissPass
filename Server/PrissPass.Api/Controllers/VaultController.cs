using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class VaultController : ControllerBase
{
    private readonly IGenericService<VaultItem> _vaultService;
    private readonly IGenericService<User> _userService;
    private readonly EncryptionService _encryptionService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public VaultController(
        IGenericService<VaultItem> vaultService,
        IGenericService<User> userService,
        EncryptionService encryptionService,
        IHttpContextAccessor httpContextAccessor)
    {
        _vaultService = vaultService;
        _userService = userService;
        _encryptionService = encryptionService;
        _httpContextAccessor = httpContextAccessor;
    }

    private Guid UserId =>
        Guid.Parse(_httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("User ID not found in claims."));

    [Authorize]
    [HttpPost("AddVaultItem")]
    public async Task<IActionResult> AddItem([FromBody] VaultItemRequest request, [FromQuery] string masterPassword)
    {
        var user = await _userService.GetByIdAsync(UserId);
        if (user == null) return Unauthorized();

        var userKey = _encryptionService.DeriveUserKey(masterPassword, user.PasswordSalt);

        var item = new VaultItem
        {
            SiteName = _encryptionService.EncryptWithUserKey(request.SiteName, userKey),
            EncryptedUrl = _encryptionService.EncryptWithUserKey(request.Url, userKey),
            EncryptedPassword = _encryptionService.EncryptWithUserKey(request.Password, userKey),
            EncryptedNotes = _encryptionService.EncryptWithUserKey(request.Notes, userKey),
            UserId = UserId
        };

        await _vaultService.AddAsync(item);
        await _vaultService.SaveChangesAsync();

        return Ok(new { message = "We've securely stored your data, now you can forget your password 🙃." });
    }

    [Authorize]
    [HttpPut("UpdateVaultItem/{vaultId}")]
    public async Task<IActionResult> UpdateItem(Guid vaultId, [FromBody] VaultItemRequest request, [FromQuery] string masterPassword)
    {
        var user = await _userService.GetByIdAsync(UserId);
        if (user == null) return Unauthorized();

        var existingItem = await _vaultService.GetByIdAsync(vaultId);
        if (existingItem == null || existingItem.UserId != UserId)
            return NotFound("Vault item not found.");

        var userKey = _encryptionService.DeriveUserKey(masterPassword, user.PasswordSalt);

        existingItem.SiteName = _encryptionService.EncryptWithUserKey(request.SiteName, userKey);
        existingItem.EncryptedUrl = _encryptionService.EncryptWithUserKey(request.Url, userKey);
        existingItem.EncryptedPassword = _encryptionService.EncryptWithUserKey(request.Password, userKey);
        existingItem.EncryptedNotes = _encryptionService.EncryptWithUserKey(request.Notes, userKey);

        await _vaultService.UpdateAsync(existingItem);
        await _vaultService.SaveChangesAsync();

        return Ok(new { message = "Vault item updated successfully." });
    }

    [Authorize]
    [HttpDelete("DeleteVaultItem/{vaultId}")]
    public async Task<IActionResult> DeleteItem(Guid vaultId)
    {
        var item = await _vaultService.GetByIdAsync(vaultId);
        if (item == null || item.UserId != UserId)
            return NotFound("Vault item not found or not authorized.");

        await _vaultService.RemoveAsync(item);
        await _vaultService.SaveChangesAsync();

        return Ok(new { message = "Vault item deleted successfully." });
    }

    [Authorize]
    [HttpGet("GetVaultItems")]
    public async Task<IActionResult> GetItems([FromQuery] string masterPassword)
    {
        var user = await _userService.GetByIdAsync(UserId);
        if (user == null) return Unauthorized();

        if (!_encryptionService.VerifyPassword(masterPassword, user.MasterPassword, user.PasswordSalt))
            return Unauthorized("Invalid master password");

        var userKey = _encryptionService.DeriveUserKey(masterPassword, user.PasswordSalt);

        var items = await _vaultService.FindAsync(v => v.UserId == UserId);

        var decryptedItems = items.Select(i => new VaultItemResponse
        {
            VaultId = i.VaultId,
            SiteName = _encryptionService.DecryptWithUserKey(i.SiteName, userKey),
            Url = _encryptionService.DecryptWithUserKey(i.EncryptedUrl, userKey),
            Password = _encryptionService.DecryptWithUserKey(i.EncryptedPassword, userKey),
            Notes = _encryptionService.DecryptWithUserKey(i.EncryptedNotes, userKey)
        }).ToList();

        return Ok(decryptedItems);
    }
}
