using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

[ApiController]
[Route("api/[controller]")]
public class VaultController : ControllerBase
{
    private readonly IGenericService<VaultItem> _vaultService;
    private readonly IGenericService<User> _userService;
    private readonly EncryptionService _encryptionService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IMemoryCache _cache;

    public VaultController(
        IGenericService<VaultItem> vaultService,
        IGenericService<User> userService,
        EncryptionService encryptionService,
        IHttpContextAccessor httpContextAccessor,
        IMemoryCache cache)
    {
        _vaultService = vaultService;
        _userService = userService;
        _encryptionService = encryptionService;
        _httpContextAccessor = httpContextAccessor;
        _cache = cache;
    }

    private Guid UserId
    {
        get
        {
            var user = _httpContextAccessor.HttpContext?.User;
            var userIdClaim = user?.FindFirstValue(ClaimTypes.NameIdentifier);
            
            Console.WriteLine($"User: {user?.Identity?.Name}");
            Console.WriteLine($"User ID Claim: {userIdClaim}");
            Console.WriteLine($"Is Authenticated: {user?.Identity?.IsAuthenticated}");
            
            if (string.IsNullOrEmpty(userIdClaim))
            {
                throw new UnauthorizedAccessException("User ID not found in claims.");
            }
            
            return Guid.Parse(userIdClaim);
        }
    }

    [Authorize]
    [HttpPost("AddVaultItem")]
    public async Task<IActionResult> AddItem([FromBody] VaultItemRequest request)
    {
        try
        {
            var userKey = await GetUserKey();

            var item = new VaultItem
            {
                SiteName = _encryptionService.EncryptWithUserKey(request.SiteName, userKey),
                EncryptedUrl = _encryptionService.EncryptWithUserKey(request.Url ?? string.Empty, userKey),
                EncryptedPassword = _encryptionService.EncryptWithUserKey(request.Password, userKey),
                EncryptedNotes = _encryptionService.EncryptWithUserKey(request.Notes ?? string.Empty, userKey),
                UserId = UserId
            };

            await _vaultService.AddAsync(item);
            await _vaultService.SaveChangesAsync();

            return Ok(new { message = "We've securely stored your data, now you can forget your password 🙃." });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while storing the item." });
        }
    }

    [Authorize]
    [HttpPut("UpdateVaultItem/{vaultId}")]
    public async Task<IActionResult> UpdateItem(Guid vaultId, [FromBody] VaultItemRequest request)
    {
        try
        {
            var existingItem = await _vaultService.GetByIdAsync(vaultId);
            if (existingItem == null || existingItem.UserId != UserId)
                return NotFound("Vault item not found.");

            var userKey = await GetUserKey();

            existingItem.SiteName = _encryptionService.EncryptWithUserKey(request.SiteName, userKey);
            existingItem.EncryptedUrl = _encryptionService.EncryptWithUserKey(request.Url ?? string.Empty, userKey);
            existingItem.EncryptedPassword = _encryptionService.EncryptWithUserKey(request.Password, userKey);
            existingItem.EncryptedNotes = _encryptionService.EncryptWithUserKey(request.Notes ?? string.Empty, userKey);

            await _vaultService.UpdateAsync(existingItem);
            await _vaultService.SaveChangesAsync();

            return Ok(new { message = "Vault item updated successfully." });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while updating the item." });
        }
    }

    [Authorize]
    [HttpDelete("DeleteVaultItem/{vaultId}")]
    public async Task<IActionResult> DeleteItem(Guid vaultId)
    {
        try
        {
            var item = await _vaultService.GetByIdAsync(vaultId);
            if (item == null || item.UserId != UserId)
                return NotFound("Vault item not found or not authorized.");

            await _vaultService.RemoveAsync(item);
            await _vaultService.SaveChangesAsync();

            return Ok(new { message = "Vault item deleted successfully." });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while deleting the item." });
        }
    }

    [Authorize]
    [HttpGet("GetAll")]
    public async Task<IActionResult> GetItems([FromQuery] string? masterPassword = null)
    {
        try
        {
            byte[] userKey;

            if (!string.IsNullOrEmpty(masterPassword))
            {
                userKey = await GetUserKeyWithMasterPassword(masterPassword);
            }
            else
            {
                userKey = await GetUserKey();
            }

            var items = await _vaultService.FindAsync(v => v.UserId == UserId);

            var decryptedItems = items.Select(i => new VaultItemResponse
            {
                VaultId = i.VaultId,
                SiteName = _encryptionService.DecryptWithUserKey(i.SiteName, userKey),
                Url = _encryptionService.DecryptWithUserKey(i.EncryptedUrl ?? string.Empty, userKey),
                Password = _encryptionService.DecryptWithUserKey(i.EncryptedPassword, userKey),
                Notes = _encryptionService.DecryptWithUserKey(i.EncryptedNotes ?? string.Empty, userKey)
            }).ToList();

            return Ok(decryptedItems);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving vault items." });
        }
    }

    private async Task<byte[]> GetUserKey()
    {
        if (Request.Cookies.TryGetValue("sessionId", out var sessionId))
        {
            if (_cache.TryGetValue(sessionId, out byte[]? cachedKey) && cachedKey != null)
            {
                _cache.Set(sessionId, cachedKey, new MemoryCacheEntryOptions
                {
                    SlidingExpiration = TimeSpan.FromMinutes(30),
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12)
                });
                return cachedKey;
            }
        }

        // If no cached key, throw unauthorized
        throw new UnauthorizedAccessException("Session expired. Please provide master password to continue.");
    }

    private async Task<byte[]> GetUserKeyWithMasterPassword(string masterPassword)
    {
        var user = await _userService.GetByIdAsync(UserId);
        if (user == null)
            throw new UnauthorizedAccessException("User not found");

        if (!_encryptionService.VerifyPassword(masterPassword, user.MasterPassword, user.PasswordSalt))
            throw new UnauthorizedAccessException("Invalid master password");

        var userKey = _encryptionService.DeriveUserKey(masterPassword, user.PasswordSalt);

        // Store the new key in cache
        var newSessionId = Guid.NewGuid().ToString();
        _cache.Set(newSessionId, userKey, new MemoryCacheEntryOptions
        {
            SlidingExpiration = TimeSpan.FromMinutes(30),
            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12)
        });

        // Set the new session cookie
        Response.Cookies.Append("sessionId", newSessionId, new CookieOptions
        {
            HttpOnly = true,
            Secure = false, // Set to false for HTTP development
            SameSite = SameSiteMode.Lax, // More permissive for development
            Expires = DateTime.UtcNow.AddHours(12)
        });

        return userKey;
    }
}