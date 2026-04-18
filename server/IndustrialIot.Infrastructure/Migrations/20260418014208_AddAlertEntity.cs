using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IndustrialIot.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAlertEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Timestamp",
                table: "Telemetries",
                newName: "IngestionTimestamp");

            migrationBuilder.RenameIndex(
                name: "IX_Telemetries_Timestamp",
                table: "Telemetries",
                newName: "IX_Telemetries_IngestionTimestamp");

            migrationBuilder.AddColumn<DateTime>(
                name: "EdgeTimestamp",
                table: "Telemetries",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "Vibration",
                table: "Telemetries",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "Alerts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AssetId = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Severity = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Message = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    CurrentValue = table.Column<decimal>(type: "numeric", nullable: false),
                    Threshold = table.Column<decimal>(type: "numeric", nullable: false),
                    EdgeTimestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Acknowledged = table.Column<bool>(type: "boolean", nullable: false),
                    AcknowledgedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Resolved = table.Column<bool>(type: "boolean", nullable: false),
                    ResolvedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastSentAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Alerts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Alerts_Assets_AssetId",
                        column: x => x.AssetId,
                        principalTable: "Assets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Telemetries_EdgeTimestamp",
                table: "Telemetries",
                column: "EdgeTimestamp");

            migrationBuilder.CreateIndex(
                name: "IX_Alerts_AssetId",
                table: "Alerts",
                column: "AssetId");

            migrationBuilder.CreateIndex(
                name: "IX_Alerts_AssetId_Type",
                table: "Alerts",
                columns: new[] { "AssetId", "Type" });

            migrationBuilder.CreateIndex(
                name: "IX_Alerts_EdgeTimestamp",
                table: "Alerts",
                column: "EdgeTimestamp");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Alerts");

            migrationBuilder.DropIndex(
                name: "IX_Telemetries_EdgeTimestamp",
                table: "Telemetries");

            migrationBuilder.DropColumn(
                name: "EdgeTimestamp",
                table: "Telemetries");

            migrationBuilder.DropColumn(
                name: "Vibration",
                table: "Telemetries");

            migrationBuilder.RenameColumn(
                name: "IngestionTimestamp",
                table: "Telemetries",
                newName: "Timestamp");

            migrationBuilder.RenameIndex(
                name: "IX_Telemetries_IngestionTimestamp",
                table: "Telemetries",
                newName: "IX_Telemetries_Timestamp");
        }
    }
}
