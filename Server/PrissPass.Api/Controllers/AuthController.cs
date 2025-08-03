using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using PrissPass.Data.Models.Dto;
using PrissPass.Data.Models.Entity;

namespace PrissPass.Api.Controllers
{
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
            try
            {
                if (await _userRepository.AnyAsync(u => u.Email == request.Email))
                    return BadRequest(new { message = "Please use a different email" });

                var user = new User
                {
                    Username = request.Username,
                    Email = request.Email,
                    MasterPassword = _encryptionService.HashPassword(request.MasterPassword, out string salt),
                    PasswordSalt = salt
                };

                await _userRepository.AddAsync(user);
                await _userRepository.SaveChangesAsync();

                return Ok(new { message = "You have registered successfully. Please use your master password to login." });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An error occurred during registration." });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LogInDto request)
        {
            try
            {
                var user = await _userRepository.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (user == null || !_encryptionService.VerifyPassword(
                    request.MasterPassword,
                    user.MasterPassword,
                    user.PasswordSalt))
                {
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                var token = _jwtService.GenerateToken(user);
                var userKey = _encryptionService.DeriveUserKey(request.MasterPassword, user.PasswordSalt);

                var sessionId = Guid.NewGuid().ToString();
                _cache.Set(sessionId, userKey, new MemoryCacheEntryOptions
                {
                    SlidingExpiration = TimeSpan.FromMinutes(30),
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12)
                });

                SetAuthCookies(token, sessionId);

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
            catch (Exception)
            {
                return StatusCode(500, new { message = "An error occurred during login." });
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            try
            {
                if (Request.Cookies.TryGetValue("sessionId", out var sessionId))
                {
                    _cache.Remove(sessionId);
                }

                Response.Cookies.Delete("token");
                Response.Cookies.Delete("sessionId");
                
                return Ok(new { message = "Logged out successfully" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An error occurred during logout." });
            }
        }

        [Authorize]
        [HttpGet("test-auth")]
        public IActionResult TestAuth()
        {
            try
            {
                var user = HttpContext.User;
                return Ok(new { 
                    message = "Authentication successful",
                    userId = user.FindFirstValue(ClaimTypes.NameIdentifier),
                    email = user.FindFirstValue(ClaimTypes.Email),
                    username = user.FindFirstValue(ClaimTypes.Name)
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An error occurred while testing authentication." });
            }
        }

        private void SetAuthCookies(string token, string sessionId)
        {
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
        }
    }
}