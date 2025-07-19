using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IRepository<User> _userRepository;
    private readonly JwtService _jwtService;
    private readonly IMemoryCache _cache;
    private readonly EncryptionService _encryptionService;

    public AuthController(
        IRepository<User> userRepository,
        JwtService jwtService,
        EncryptionService encryptionService,
        IMemoryCache cache)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _encryptionService = encryptionService;
        _cache = cache;
    }

    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] RegistrationDto request)
    {
        if (await _userRepository.AnyAsync(u => u.Email == request.Email))
            return BadRequest("Please use a different email");

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            MasterPassword = _encryptionService.HashPassword(request.MasterPassword, out string salt),
            PasswordSalt = salt
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        return Ok(new { Message = "You have registered succefully please use your master password to login." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LogInDto request)
    {
        var user = await _userRepository.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null || !_encryptionService.VerifyPassword(
            request.MasterPassword,
            user.MasterPassword,
            user.PasswordSalt))
        {
            return Unauthorized("Invalid email or password");
        }

        var token = _jwtService.GenerateToken(user);
        Console.WriteLine($"Generated token: {token.Substring(0, Math.Min(50, token.Length))}...");
        var userKey = _encryptionService.DeriveUserKey(request.MasterPassword, user.PasswordSalt);

        var sessionId = Guid.NewGuid().ToString();
        _cache.Set(sessionId, userKey, new MemoryCacheEntryOptions
        {
            SlidingExpiration = TimeSpan.FromMinutes(30),
            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12)
        });

        Response.Cookies.Append("token", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(7)
        });

        Response.Cookies.Append("sessionId", sessionId, new CookieOptions
        {
            HttpOnly = true,
            Secure = false, 
            SameSite = SameSiteMode.Lax, 
            Expires = DateTime.UtcNow.AddMinutes(30)
        });

        Console.WriteLine($"Login successful for user: {user.Email}");
        Console.WriteLine($"Token generated: {token.Substring(0, Math.Min(30, token.Length))}...");
        Console.WriteLine($"Session ID: {sessionId}");
        
        return Ok(new { 
            message = "Login successful",
            token = token,
            sessionId = sessionId,
            user = new { 
                userId = user.UserId,
                username = user.Username,
                email = user.Email
            }
        });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        if (Request.Cookies.TryGetValue("sessionId", out var sessionId))
        {
            _cache.Remove(sessionId);
        }

        Response.Cookies.Delete("token");
        Response.Cookies.Delete("sessionId");
        return Ok(new { Message = "Logged out successfully" });
    }

    [Authorize]
    [HttpGet("test-auth")]
    public IActionResult TestAuth()
    {
        var user = HttpContext.User;
        return Ok(new { 
            Message = "Authentication successful",
            UserId = user.FindFirstValue(ClaimTypes.NameIdentifier),
            Email = user.FindFirstValue(ClaimTypes.Email),
            Username = user.FindFirstValue(ClaimTypes.Name)
        });
    }
}