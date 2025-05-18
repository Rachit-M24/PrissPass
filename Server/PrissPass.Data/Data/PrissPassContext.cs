using Microsoft.EntityFrameworkCore;

public class PrissPassContext : DbContext
{
    public PrissPassContext(DbContextOptions<PrissPassContext> options) : base(options) {}

    public DbSet<User> Users { get; set; }
    public DbSet<VaultItem> VaultItems { get; set; }
}