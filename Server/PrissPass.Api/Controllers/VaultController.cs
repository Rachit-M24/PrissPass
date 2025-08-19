using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using AutoMapper;
using PrissPass.Data.Models.Dto;
using PrissPass.Data.Models.Entity;

namespace PrissPass.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VaultController : ControllerBase
    {
        private readonly IGenericService<VaultItem> _vaultItemService;
        private readonly IGenericService<Users> _userService;
        private readonly IGenericService<Items> _itemsService;
        private readonly IGenericService<Vaults> _vaultsService;
        private readonly EncryptionService _encryptionService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemoryCache _cache;
        private readonly IMapper _mapper;

        public VaultController(
            IGenericService<VaultItem> vaultItemService,
            IGenericService<Users> userService,
            IGenericService<Items> itemsService,
            IGenericService<Vaults> vaultsService,
            EncryptionService encryptionService,
            IHttpContextAccessor httpContextAccessor,
            IMemoryCache cache,
            IMapper mapper)
        {
            _vaultItemService = vaultItemService;
            _userService = userService;
            _itemsService = itemsService;
            _vaultsService = vaultsService;
            _encryptionService = encryptionService;
            _httpContextAccessor = httpContextAccessor;
            _cache = cache;
            _mapper = mapper;
        }

        private Guid UserId
        {
            get
            {
                var user = _httpContextAccessor.HttpContext?.User;
                var userIdClaim = user?.FindFirstValue(ClaimTypes.NameIdentifier);

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

                // Create a new Items entity with encrypted data
                var items = new Items
                {
                    EncryptedSiteName = _encryptionService.EncryptWithUserKey(request.SiteName, userKey),
                    EncryptedUrl = _encryptionService.EncryptWithUserKey(request.Url ?? string.Empty, userKey),
                    EncryptedPassword = _encryptionService.EncryptWithUserKey(request.Password, userKey),
                    EncryptedNotes = _encryptionService.EncryptWithUserKey(request.Notes ?? string.Empty, userKey),
                    CreatedBy = UserId.ToString(),
                };

                // Save the Items entity
                await _itemsService.AddAsync(items);

                // Create or retrieve the user's vault
                var vault = await _vaultsService.FindAsync(v => v.UserId == UserId);
                var userVault = vault.FirstOrDefault() ?? new Vaults { UserId = UserId };
                if (vault.FirstOrDefault() == null)
                {
                    await _vaultsService.AddAsync(userVault);
                }

                // Create VaultItem to link Vault and Items
                var vaultItem = new VaultItem
                {
                    VaultId = userVault.VaultId,
                    ItemId = items.ItemId
                };

                await _vaultItemService.AddAsync(vaultItem);
                await _vaultItemService.SaveChangesAsync();

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
                var vaultItem = await _vaultsService.GetByIdWithIncludesAsync(v => v.VaultId == vaultId, v => v.VaultItems);
                if (vaultItem == null || vaultItem.UserId != UserId)
                    return NotFound(new { message = "Vault item not found or not authorized." });

                var userKey = await GetUserKey();

                // Retrieve the associated Items entity
                var existingItem = await _itemsService.GetByIdAsync(vaultItem.VaultItems.FirstOrDefault()?.ItemId ?? Guid.Empty);
                if (existingItem == null)
                    return NotFound(new { message = "Associated item not found." });

                // Update with encrypted data
                existingItem.EncryptedSiteName = _encryptionService.EncryptWithUserKey(request.SiteName, userKey);
                existingItem.EncryptedUrl = _encryptionService.EncryptWithUserKey(request.Url ?? string.Empty, userKey);
                existingItem.EncryptedPassword = _encryptionService.EncryptWithUserKey(request.Password, userKey);
                existingItem.EncryptedNotes = _encryptionService.EncryptWithUserKey(request.Notes ?? string.Empty, userKey);
                existingItem.ModifiedDate = DateTime.UtcNow;

                await _itemsService.UpdateAsync(existingItem);
                await _itemsService.SaveChangesAsync();

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
                var vaultItem = await _vaultItemService.GetByIdWithIncludesAsync(v => v.VaultId == vaultId, v => v.Vaults, i => i.Items);
                if (vaultItem == null || vaultItem.Vaults.UserId != UserId)
                    return NotFound(new { message = "Vault item not found or not authorized." });

                await _vaultItemService.RemoveAsync(vaultItem);

                // Optionally delete the associated Items entity
                var item = await _itemsService.GetByIdAsync(vaultItem.ItemId);
                if (item != null)
                {
                    await _itemsService.RemoveAsync(item);
                }

                await _vaultItemService.SaveChangesAsync();

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
        [HttpGet("GetVaultItemById/{vaultId}")]
        public async Task<IActionResult> GetVaultItemById(Guid vaultId, [FromQuery] string? masterPassword = null)
        {
            try
            {
                var vaultItem = await _vaultItemService.GetByIdWithIncludesAsync(v => v.VaultId == vaultId, v => v.Vaults);
                if (vaultItem == null || vaultItem.Vaults.UserId != UserId)
                    return NotFound(new { message = "Vault item not found or not authorized." });

                byte[] userKey;
                if (!string.IsNullOrEmpty(masterPassword))
                {
                    userKey = await GetUserKeyWithMasterPassword(masterPassword);
                }
                else
                {
                    userKey = await GetUserKey();
                }

                // Retrieve the associated Items entity
                var item = await _itemsService.GetByIdAsync(vaultItem.ItemId);
                if (item == null)
                    return NotFound(new { message = "Associated item not found." });

                // Decrypt the data
                var decryptedItem = new VaultItemResponse
                {
                    VaultId = vaultItem.VaultId,
                    SiteName = _encryptionService.DecryptWithUserKey(item.EncryptedSiteName, userKey),
                    Url = _encryptionService.DecryptWithUserKey(item.EncryptedUrl ?? string.Empty, userKey),
                    Password = _encryptionService.DecryptWithUserKey(item.EncryptedPassword, userKey),
                    Notes = _encryptionService.DecryptWithUserKey(item.EncryptedNotes ?? string.Empty, userKey)
                };

                return Ok(decryptedItem);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the vault item." });
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

                var vaultItems = await _vaultItemService.FindAsync(v => v.Vaults.UserId == UserId);

                var decryptedItems = new List<VaultItemResponse>();
                foreach (var vaultItem in vaultItems)
                {
                    var item = await _itemsService.GetByIdAsync(vaultItem.ItemId);
                    if (item != null)
                    {
                        decryptedItems.Add(new VaultItemResponse
                        {
                            VaultId = vaultItem.VaultId,
                            SiteName = _encryptionService.DecryptWithUserKey(item.EncryptedSiteName, userKey),
                            Url = _encryptionService.DecryptWithUserKey(item.EncryptedUrl ?? string.Empty, userKey),
                            Password = _encryptionService.DecryptWithUserKey(item.EncryptedPassword, userKey),
                            Notes = _encryptionService.DecryptWithUserKey(item.EncryptedNotes ?? string.Empty, userKey)
                        });
                    }
                }

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

        private Task<byte[]> GetUserKey()
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
                    return Task.FromResult(cachedKey);
                }
            }

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
                Secure = false,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddHours(12)
            });

            return userKey;
        }
    }
}