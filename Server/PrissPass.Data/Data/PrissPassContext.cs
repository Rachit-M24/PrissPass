using Microsoft.EntityFrameworkCore;
using PrissPass.Data.Models.Entity;

public class PrissPassContext : DbContext
{
    public PrissPassContext(DbContextOptions<PrissPassContext> options) : base(options) { }

    public DbSet<Users> Users { get; set; }
    public DbSet<Vaults> Vaults { get; set; }
    public DbSet<Items> Items { get; set; }
    public DbSet<VaultItem> VaultItem { get; set; }
}