using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IRepository<User> _userRepository;
    private readonly JwtService _jwtService;
    private readonly EncryptionService _encryptionService;

    public AuthController(
        IRepository<User> userRepository,
        JwtService jwtService,
        EncryptionService encryptionService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _encryptionService = encryptionService;
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

        var token = _jwtService.GenerateToken(user);
        return Ok(new { Token = token });
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
        return Ok(new { Token = token });
    }
}