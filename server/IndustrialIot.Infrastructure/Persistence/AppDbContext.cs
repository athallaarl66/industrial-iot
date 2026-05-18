using IndustrialIot.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IndustrialIot.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Asset> Assets => Set<Asset>();
    public DbSet<Telemetry> Telemetries => Set<Telemetry>();
    public DbSet<Alert> Alerts => Set<Alert>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity => {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.Username).IsUnique();
        });

        // Konfigurasi Tabel Asset
        modelBuilder.Entity<Asset>(entity => {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.AssetCode).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.AssetCode).IsUnique();
        });

        // Konfigurasi Tabel Telemetry (Penting untuk IoT!)
        modelBuilder.Entity<Telemetry>(entity => {
            entity.HasKey(e => e.Id);
            
            // Indexing Timestamps karena akan sangat sering di-query untuk grafik dan audit
            entity.HasIndex(e => e.EdgeTimestamp);
            entity.HasIndex(e => e.IngestionTimestamp);
            entity.HasIndex(e => e.AssetId);

            // Presisi desimal untuk sensor industri
            entity.Property(e => e.Temperature).HasPrecision(18, 2);
            entity.Property(e => e.Pressure).HasPrecision(18, 2);
            entity.Property(e => e.Vibration).HasPrecision(18, 2);
        });

        // Alert configuration
        modelBuilder.Entity<Alert>(entity => {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Severity).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Message).IsRequired().HasMaxLength(500);
            
            entity.HasIndex(e => e.AssetId);
            entity.HasIndex(e => e.EdgeTimestamp);
            entity.HasIndex(e => new { e.AssetId, e.Type }); // Quick lookup last alert per type
            
            // FK
            entity.HasOne(e => e.Asset)
                  .WithMany()
                  .HasForeignKey(e => e.AssetId)
                  .OnDelete(DeleteBehavior.Cascade); // Delete alerts if asset deleted
        });
    }
}
