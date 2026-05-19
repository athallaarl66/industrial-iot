using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IndustrialIot.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEdgeCredentials : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EdgeCredentials",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AssetCode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Token = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EdgeCredentials", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EdgeCredentials_AssetCode",
                table: "EdgeCredentials",
                column: "AssetCode");

            migrationBuilder.CreateIndex(
                name: "IX_EdgeCredentials_Token",
                table: "EdgeCredentials",
                column: "Token",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EdgeCredentials");
        }
    }
}
