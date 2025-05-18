using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
// [Authorize]
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
        Guid.Parse(_httpContextAccessor.HttpContext?.User?.FindFirstValue("nameid")
            ?? throw new UnauthorizedAccessException("User ID not found in claims."));

    [HttpPost]
    public async Task<IActionResult> AddItem([FromBody] VaultItemRequest request)
    {
        var user = await _userRepository.GetByIdAsync(UserId);
        if (user == null) return Unauthorized();

        var userKey = _encryptionService.DeriveUserKey(request.Password, user.PasswordSalt);

        var item = new VaultItem
        {
            SiteName = request.SiteName,
            Url = request.Url,
            EncryptedPassword = _encryptionService.EncryptWithUserKey(request.Password, userKey),
            Notes = request.Notes,
            UserId = UserId
        };

        await _vaultRepository.AddAsync(item);
        await _vaultRepository.SaveChangesAsync();

        return Ok(new
        {
            item.VaultId,
            item.SiteName,
            item.Url,
            item.Notes
        });
    }

    [HttpGet]
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
            Url = i.Url,
            Password = _encryptionService.DecryptWithUserKey(i.EncryptedPassword, userKey),
            Notes = i.Notes
        }).ToList();

        return Ok(decryptedItems);
    }
}
