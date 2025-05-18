using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace PrissPass.Data
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<PrissPassContext>
    {
        public PrissPassContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<PrissPassContext>();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("default"));

            return new PrissPassContext(optionsBuilder.Options);
        }
    }
}
