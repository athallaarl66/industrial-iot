using IndustrialIot.Domain.Entities;
using IndustrialIot.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace IndustrialIot.Infrastructure.Persistence;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // Pastikan tabel Users ada sebelum seeding
        await context.Database.MigrateAsync();

        // Cek apakah user admin sudah ada
        if (!await context.Users.AnyAsync(u => u.Username == "admin"))
        {
            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                Username = "admin",
                // Hash password "admin123" menggunakan BCrypt
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = UserRole.Admin,
                CreatedAt = DateTime.UtcNow
            };

            await context.Users.AddAsync(adminUser);
            await context.SaveChangesAsync();
        }
    }
}
