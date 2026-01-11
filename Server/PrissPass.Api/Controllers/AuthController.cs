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
        private readonly IRepository<Users> _userRepository;
        private readonly JwtService _jwtService;
        private readonly IMemoryCache _cache;
        private readonly EncryptionService _encryptionService;

        public AuthController(
            IRepository<Users> userRepository,
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
                throw new ArgumentException("Please use a different email");

            var user = new Users
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

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LogInDto request)
        {
            var user = await _userRepository.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !_encryptionService.VerifyPassword(
                request.MasterPassword,
                user.MasterPassword,
                user.PasswordSalt))
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            var token = _jwtService.GenerateToken(user);
            var userKey = _encryptionService.DeriveUserKey(request.MasterPassword, user.PasswordSalt);

            var sessionId = Guid.NewGuid().ToString();

            // Store encryption key in cache with 30-minute expiration
            _cache.Set(sessionId, userKey, TimeSpan.FromMinutes(30));

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddMinutes(30),
                Path = "/"
            };

            Response.Cookies.Append("token", token, cookieOptions);
            Response.Cookies.Append("sessionId", sessionId, cookieOptions);

            return Ok(new
            {
                message = "Login successful",
                userId = user.UserId,
                sessionExpiry = DateTimeOffset.UtcNow.AddMinutes(30).ToUnixTimeSeconds()
            });
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            try
            {
                var sessionId = Request.Cookies["sessionId"];

                if (!string.IsNullOrEmpty(sessionId))
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
                return Ok(new
                {
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