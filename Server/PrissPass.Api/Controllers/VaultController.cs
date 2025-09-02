using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using AutoMapper;
using PrissPass.Data.Models.Dto;
using PrissPass.Data.Models.Entity;
using Microsoft.EntityFrameworkCore; // Required for DbUpdateException

namespace PrissPass.Api.Controllers
{
    [ApiController]
    [Authorize]
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
        private readonly ILogger<VaultController> _logger;

        public VaultController(
            IGenericService<VaultItem> vaultItemService,
            IGenericService<Users> userService,
            IGenericService<Items> itemsService,
            IGenericService<Vaults> vaultsService,
            EncryptionService encryptionService,
            IHttpContextAccessor httpContextAccessor,
            IMemoryCache cache,
            IMapper mapper,
            ILogger<VaultController> logger)
        {
            _vaultItemService = vaultItemService;
            _userService = userService;
            _itemsService = itemsService;
            _vaultsService = vaultsService;
            _encryptionService = encryptionService;
            _httpContextAccessor = httpContextAccessor;
            _cache = cache;
            _mapper = mapper;
            _logger = logger;
        }

        private Guid UserId
        {
            get
            {
                var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                {
                    throw new UnauthorizedAccessException("User ID claim is missing, invalid, or user is not authenticated.");
                }
                return userId;
            }
        }

        /// <summary>
        /// Adds a new encrypted item to the user's vault.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> AddItem([FromBody] VaultItemRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { message = "Invalid request data", code = "INVALID_REQUEST" });
                }

                if (string.IsNullOrWhiteSpace(request.SiteName))
                {
                    return BadRequest(new { message = "Site name is required", code = "MISSING_SITE_NAME" });
                }

                if (string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest(new { message = "Password is required", code = "MISSING_PASSWORD" });
                }

                if (!string.IsNullOrWhiteSpace(request.Url) && !Uri.TryCreate(request.Url, UriKind.Absolute, out _))
                {
                    return BadRequest(new { message = "Invalid URL format", code = "INVALID_URL" });
                }

                var userKey = await GetUserEncryptionKeyAsync(null);
                if (userKey == null)
                {
                    return Unauthorized(new { message = "Session expired. Please provide the master password." });
                }

                var userVault = await GetOrCreateUserVaultAsync();
                await _vaultsService.SaveChangesAsync();

                // Map the request to Items entity
                var newItem = _mapper.Map<Items>(request);
                newItem.CreatedBy = UserId.ToString();

                // Encrypt the sensitive data
                newItem.EncryptedSiteName = _encryptionService.EncryptWithUserKey(request.SiteName, userKey);
                newItem.EncryptedUrl = _encryptionService.EncryptWithUserKey(request.Url ?? string.Empty, userKey);
                newItem.EncryptedPassword = _encryptionService.EncryptWithUserKey(request.Password, userKey);
                newItem.EncryptedNotes = _encryptionService.EncryptWithUserKey(request.Notes ?? string.Empty, userKey);

                // Map and create VaultItem
                var vaultItem = _mapper.Map<VaultItem>(request);
                vaultItem.VaultId = userVault.VaultId;
                vaultItem.ItemId = newItem.ItemId;

                await _itemsService.AddAsync(newItem);
                await _vaultItemService.AddAsync(vaultItem);
                await _vaultItemService.SaveChangesAsync();

                var response = _mapper.Map<VaultItemResponse>(vaultItem);

                _cache.Remove($"vault_items_{UserId}");

                return CreatedAtAction(nameof(GetVaultItemById),
                    new { vaultItemId = vaultItem.VaultItemId },
                    response);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error occurred while adding a vault item for user {UserId}.", UserId);
                return StatusCode(500, new { message = "A database error occurred while saving the item.", code = "DB_ERROR" });
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized access attempt in AddItem for user {UserId}.", UserId);
                return Unauthorized(new { message = ex.Message, code = "UNAUTHORIZED" });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid argument in AddItem for user {UserId}.", UserId);
                return BadRequest(new { message = ex.Message, code = "INVALID_ARGUMENT" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred in AddItem for user {UserId}.", UserId);
                return StatusCode(500, new { message = "An unexpected error occurred.", code = "INTERNAL_ERROR" });
            }
        }

        /// <summary>
        /// Updates an existing item in the user's vault.
        /// </summary>
        [HttpPut("{vaultItemId}")]
        public async Task<IActionResult> UpdateItem(Guid vaultItemId, [FromBody] VaultItemRequest request)
        {
            try
            {
                if (vaultItemId == Guid.Empty)
                {
                    return BadRequest(new { message = "Invalid vault item ID", code = "INVALID_ID" });
                }

                if (request == null)
                {
                    return BadRequest(new { message = "Invalid request data", code = "INVALID_REQUEST" });
                }

                if (string.IsNullOrWhiteSpace(request.SiteName) || string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest(new { message = "Site name and password are required", code = "MISSING_REQUIRED_FIELDS" });
                }

                var vaultItem = await _vaultItemService.GetByIdWithIncludesAsync(
                    vi => vi.VaultItemId == vaultItemId && vi.Vaults.UserId == UserId,
                    v => v.Vaults,
                    i => i.Items);

                if (vaultItem == null)
                {
                    return NotFound(new { message = "Vault item not found or you do not have permission to access it." });
                }

                var userKey = await GetUserEncryptionKeyAsync(null);
                if (userKey == null)
                {
                    return Unauthorized(new { message = "Session expired. Please provide the master password." });
                }
                var existingItem = vaultItem.Items;
                existingItem.EncryptedSiteName = _encryptionService.EncryptWithUserKey(request.SiteName, userKey);
                existingItem.EncryptedUrl = _encryptionService.EncryptWithUserKey(request.Url ?? string.Empty, userKey);
                existingItem.EncryptedPassword = _encryptionService.EncryptWithUserKey(request.Password, userKey);
                existingItem.EncryptedNotes = _encryptionService.EncryptWithUserKey(request.Notes ?? string.Empty, userKey);
                existingItem.ModifiedDate = DateTime.UtcNow;

                await _itemsService.UpdateAsync(existingItem);
                await _itemsService.SaveChangesAsync();
                _cache.Remove($"vault_items_{UserId}");

                return Ok(new { message = "Vault item updated successfully." });
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error occurred while updating vault item {VaultItemId} for user {UserId}.", vaultItemId, UserId);
                return StatusCode(500, new { message = "A database error occurred while updating the item.", code = "DB_ERROR" });
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized access attempt in UpdateItem for user {UserId}.", UserId);
                return Unauthorized(new { message = ex.Message, code = "UNAUTHORIZED" });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Invalid operation in UpdateItem for user {UserId}.", UserId);
                return BadRequest(new { message = ex.Message, code = "INVALID_OPERATION" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred in UpdateItem for user {UserId}.", UserId);
                return StatusCode(500, new { message = "An unexpected error occurred.", code = "INTERNAL_ERROR" });
            }
        }

        /// <summary>
        /// Deletes an item from the user's vault while maintaining the vault.
        /// The vault will only be deleted when the user account is deleted.
        /// </summary>
        [HttpDelete("{vaultItemId}")]
        public async Task<IActionResult> DeleteItem(Guid vaultItemId)
        {
            try
            {
                if (vaultItemId == Guid.Empty)
                {
                    return BadRequest(new { message = "Invalid vault item ID", code = "INVALID_ID" });
                }
                var vaultItem = await _vaultItemService.GetByIdWithIncludesAsync(
                    vi => vi.VaultItemId == vaultItemId && vi.Vaults.UserId == UserId,
                    v => v.Vaults,
                    i => i.Items);

                if (vaultItem == null)
                {
                    return NotFound(new { message = "Vault item not found or you do not have permission to access it." });
                }
                await _itemsService.RemoveAsync(vaultItem.Items);
                await _itemsService.SaveChangesAsync();

                _cache.Remove($"vault_items_{UserId}"); // Clear cache for this user's items

                return Ok();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error occurred while deleting vault item {VaultItemId} for user {UserId}.", vaultItemId, UserId);
                return StatusCode(500, new { message = "A database error occurred while deleting the item." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred in DeleteItem for user {UserId}.", UserId);
                return StatusCode(500, new { message = "An unexpected error occurred." });
            }
        }

        /// <summary>
        /// Retrieves and decrypts a single vault item by its ID.
        /// </summary>
        [HttpGet("{vaultItemId}")]
        public async Task<IActionResult> GetVaultItemById(Guid vaultItemId, [FromQuery] string? masterPassword = null)
        {
            try
            {
                if (vaultItemId == Guid.Empty)
                {
                    return BadRequest(new { message = "Invalid vault item ID", code = "INVALID_ID" });
                }
                var vaultItem = await _vaultItemService.GetByIdWithIncludesAsync(vi => vi.VaultItemId == vaultItemId, v => v.Vaults, i => i.Items);

                if (vaultItem == null || vaultItem.Vaults.UserId != UserId)
                {
                    return NotFound(new { message = "Vault item not found or you do not have permission to access it." });
                }

                var userKey = await GetUserEncryptionKeyAsync(masterPassword);
                if (userKey == null)
                {
                    return Unauthorized(new { message = "Session expired or master password is required." });
                }

                var item = vaultItem.Items;
                var decryptedItem = new VaultItemResponse
                {
                    VaultItemId = vaultItem.VaultItemId,
                    SiteName = _encryptionService.DecryptWithUserKey(item.EncryptedSiteName, userKey),
                    Url = _encryptionService.DecryptWithUserKey(item.EncryptedUrl ?? string.Empty, userKey),
                    Password = _encryptionService.DecryptWithUserKey(item.EncryptedPassword, userKey),
                    Notes = _encryptionService.DecryptWithUserKey(item.EncryptedNotes ?? string.Empty, userKey)
                };

                return Ok(decryptedItem);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized access attempt in GetVaultItemById for user {UserId}.", UserId);
                return Unauthorized(new { message = ex.Message, code = "UNAUTHORIZED" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred in GetVaultItemById for user {UserId}.", UserId);
                return StatusCode(500, new { message = "An unexpected error occurred.", code = "INTERNAL_ERROR" });
            }
        }

        /// <summary>
        /// Retrieves and decrypts all items in the user's vault with caching support.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllItems([FromQuery] string? masterPassword = null)
        {
            try
            {
                var userKey = await GetUserEncryptionKeyAsync(masterPassword);
                if (userKey == null)
                {
                    return Unauthorized(new { message = "Session expired or master password is required." });
                }

                string cacheKey = $"vault_items_{UserId}";
                List<VaultItem>? vaultItems = null;

                // Try to get items from cache first
                if (!_cache.TryGetValue(cacheKey, out vaultItems) || vaultItems == null)
                {
                    // If not in cache or null, fetch from database with optimized query
                    vaultItems = (await _vaultItemService.FindAsync(
                        v => v.Vaults.UserId == UserId,
                        v => v.Vaults,
                        vi => vi.Items))
                        .ToList();

                    if (vaultItems.Any())
                    {
                        // Only cache if we have items
                        var cacheOptions = new MemoryCacheEntryOptions()
                            .SetSlidingExpiration(TimeSpan.FromMinutes(5));
                        _cache.Set(cacheKey, vaultItems, cacheOptions);
                    }
                }

                // Ensure we have a non-null list even if empty
                vaultItems ??= new List<VaultItem>();

                var decryptedItems = vaultItems.Select(vaultItem => new VaultItemResponse
                {
                    VaultItemId = vaultItem.VaultItemId,
                    SiteName = _encryptionService.DecryptWithUserKey(vaultItem.Items.EncryptedSiteName, userKey),
                    Url = _encryptionService.DecryptWithUserKey(vaultItem.Items.EncryptedUrl ?? string.Empty, userKey),
                    Password = _encryptionService.DecryptWithUserKey(vaultItem.Items.EncryptedPassword, userKey),
                    Notes = _encryptionService.DecryptWithUserKey(vaultItem.Items.EncryptedNotes ?? string.Empty, userKey),
                    CreatedDate = vaultItem.Items.CreatedDate,
                    ModifiedDate = vaultItem.Items.ModifiedDate
                }).ToList();

                return Ok(decryptedItems);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred in GetAllItems for user {UserId}.", UserId);
                return StatusCode(500, new { message = "An unexpected error occurred." });
            }
        }

        /// <summary>
        /// Gets the user's vault from cache or database, creating it if it doesn't exist.
        /// </summary>
        private async Task<Vaults> GetOrCreateUserVaultAsync()
        {
            string cacheKey = $"user_vault_{UserId}";

            // Try to get from cache first
            if (_cache.TryGetValue(cacheKey, out Vaults? userVault) && userVault != null)
            {
                return userVault;
            }

            // Not in cache, get from database or create new
            userVault = await _vaultsService.FirstOrDefaultAsync(v => v.UserId == UserId);
            if (userVault == null)
            {
                userVault = new Vaults
                {
                    VaultId = Guid.NewGuid(),
                    UserId = UserId,
                    CreatedBy = UserId.ToString(),
                    CreatedDate = DateTime.UtcNow
                };
                await _vaultsService.AddAsync(userVault);
                await _vaultsService.SaveChangesAsync();
            }

            // Cache the vault for 30 minutes
            var cacheOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromMinutes(30));
            _cache.Set(cacheKey, userVault, cacheOptions);

            return userVault;
        }

        /// <summary>
        /// Retrieves the user's encryption key, either from cache or by deriving it from the master password.
        /// </summary>
        /// <returns>The user key as a byte array, or null if unauthorized or session expired.</returns>
        private async Task<byte[]?> GetUserEncryptionKeyAsync(string? masterPassword)
        {
            // If master password is provided, always use it to re-derive the key and reset the session.
            if (!string.IsNullOrEmpty(masterPassword))
            {
                var user = await _userService.GetByIdAsync(UserId);
                if (user == null) throw new UnauthorizedAccessException("User not found.");

                if (!_encryptionService.VerifyPassword(masterPassword, user.MasterPassword, user.PasswordSalt))
                {
                    throw new UnauthorizedAccessException("Invalid master password.");
                }

                var userKey = _encryptionService.DeriveUserKey(masterPassword, user.PasswordSalt);

                // Create a new session
                var newSessionId = Guid.NewGuid().ToString();
                var cacheOptions = new MemoryCacheEntryOptions
                {
                    SlidingExpiration = TimeSpan.FromMinutes(30),
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12)
                };
                _cache.Set(newSessionId, userKey, cacheOptions);

                Response.Cookies.Append("sessionId", newSessionId, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false,
                    SameSite = SameSiteMode.Lax,
                    Expires = DateTime.UtcNow.AddHours(12)
                });

                return userKey;
            }

            // If no master password, try to get the key from the cached session.
            if (Request.Cookies.TryGetValue("sessionId", out var sessionId) && _cache.TryGetValue(sessionId, out byte[]? cachedKey))
            {
                // Extend the session sliding expiration on activity
                _cache.Set(sessionId, cachedKey, new MemoryCacheEntryOptions
                {
                    SlidingExpiration = TimeSpan.FromMinutes(30),
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12)
                });
                return cachedKey;
            }
            return null;
        }
    }
}