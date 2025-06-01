using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class VaultController : ControllerBase
{
    private readonly IRepository<VaultItem> _vaultRepository;
    private readonly IRepository<User> _userRepository;
    private readonly EncryptionService _encryptionService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public VaultController(
        IRepository<VaultItem> vaultRepository,
        IRepository<User> userRepository,
        EncryptionService encryptionService,
        IHttpContextAccessor httpContextAccessor)
    {
        _vaultRepository = vaultRepository;
        _userRepository = userRepository;
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
        var user = await _userRepository.GetByIdAsync(UserId);
        if (user == null) return Unauthorized();

        var userKey = _encryptionService.DeriveUserKey(masterPassword, user.PasswordSalt);

        var item = new VaultItem
        {
            SiteName = request.SiteName,
            EncryptedUrl = _encryptionService.EncryptWithUserKey(request.Url, userKey),
            EncryptedPassword = _encryptionService.EncryptWithUserKey(request.EncryptedPassword, userKey),
            EncryptedNotes = _encryptionService.EncryptWithUserKey(request.Notes, userKey),
            UserId = UserId
        };

        await _vaultRepository.AddAsync(item);
        await _vaultRepository.SaveChangesAsync();

        return Ok(new { messge = "We've securely stored your data, Now you can forget your password 🙃." });
    }

    [Authorize]
    [HttpGet("GetVaultItems")]
    public async Task<IActionResult> GetItems([FromQuery] string masterPassword)
    {
        var user = await _userRepository.GetByIdAsync(UserId);
        if (user == null) return Unauthorized();

        if (!_encryptionService.VerifyPassword(masterPassword, user.MasterPassword, user.PasswordSalt))
            return Unauthorized("Invalid master password");

        var userKey = _encryptionService.DeriveUserKey(masterPassword, user.PasswordSalt);

        var items = await _vaultRepository.FindAsync(v => v.UserId == UserId);

        var decryptedItems = items.Select(i => new VaultItemResponse
        {
            VaultId = i.VaultId,
            SiteName = i.SiteName,
            Url = _encryptionService.DecryptWithUserKey(i.EncryptedUrl, userKey),
            Password = _encryptionService.DecryptWithUserKey(i.EncryptedPassword, userKey),
            Notes = _encryptionService.DecryptWithUserKey(i.EncryptedNotes, userKey)
        }).ToList();

        return Ok(decryptedItems);
    }
}
