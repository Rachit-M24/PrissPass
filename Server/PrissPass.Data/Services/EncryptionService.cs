// Services/EncryptionService.cs
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;

public class EncryptionService
{
    private readonly IConfiguration _configuration;
    private readonly byte[] _pepper;

    public EncryptionService(IConfiguration configuration)
    {
        _configuration = configuration;
        _pepper = Encoding.UTF8.GetBytes(configuration["Encryption:Pepper"]);
    }
    
    public byte[] DeriveUserKey(string masterPassword, string userSalt)
    {
        using var deriveBytes = new Rfc2898DeriveBytes(
            masterPassword,
            Encoding.UTF8.GetBytes(userSalt + _configuration["Encryption:Pepper"]),
            100000,
            HashAlgorithmName.SHA512);

        return deriveBytes.GetBytes(32); // 256-bit key
    }

    public string EncryptWithUserKey(string plainText, byte[] userKey)
    {
        using var aes = Aes.Create();
        aes.Key = userKey;
        aes.GenerateIV();

        using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
        using var ms = new MemoryStream();
        using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
        using (var sw = new StreamWriter(cs))
        {
            sw.Write(plainText);
        }

        var iv = aes.IV;
        var encrypted = ms.ToArray();
        var result = new byte[iv.Length + encrypted.Length];
        Buffer.BlockCopy(iv, 0, result, 0, iv.Length);
        Buffer.BlockCopy(encrypted, 0, result, iv.Length, encrypted.Length);

        return Convert.ToBase64String(result);
    }

    public string DecryptWithUserKey(string cipherText, byte[] userKey)
    {
        var fullCipher = Convert.FromBase64String(cipherText);
        var iv = new byte[16];
        var cipher = new byte[fullCipher.Length - iv.Length];

        Buffer.BlockCopy(fullCipher, 0, iv, 0, iv.Length);
        Buffer.BlockCopy(fullCipher, iv.Length, cipher, 0, cipher.Length);

        using var aes = Aes.Create();
        aes.Key = userKey;
        aes.IV = iv;

        using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
        using var ms = new MemoryStream(cipher);
        using var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
        using var sr = new StreamReader(cs);
        
        return sr.ReadToEnd();
    }

    // Secure password hashing for master password storage
    public string HashPassword(string password, out string salt)
    {
        salt = Convert.ToBase64String(RandomNumberGenerator.GetBytes(16));
        
        using var pbkdf2 = new Rfc2898DeriveBytes(
            password,
            Encoding.UTF8.GetBytes(salt + Convert.ToBase64String(_pepper)),
            100000,
            HashAlgorithmName.SHA512);
            
        var hash = pbkdf2.GetBytes(64); // 512-bit hash
        return Convert.ToBase64String(hash);
    }

    public bool VerifyPassword(string password, string hashedPassword, string salt)
    {
        using var pbkdf2 = new Rfc2898DeriveBytes(
            password,
            Encoding.UTF8.GetBytes(salt + Convert.ToBase64String(_pepper)),
            100000,
            HashAlgorithmName.SHA512);
            
        var hashToVerify = pbkdf2.GetBytes(64);
        return CryptographicOperations.FixedTimeEquals(
            hashToVerify,
            Convert.FromBase64String(hashedPassword));
    }
}