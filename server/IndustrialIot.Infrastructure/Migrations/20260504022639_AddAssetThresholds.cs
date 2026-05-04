using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IndustrialIot.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAssetThresholds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "CriticalPressure",
                table: "Assets",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CriticalTemperature",
                table: "Assets",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CriticalVibration",
                table: "Assets",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "WarningPressure",
                table: "Assets",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "WarningTemperature",
                table: "Assets",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "WarningVibration",
                table: "Assets",
                type: "numeric",
                nullable: true);

            migrationBuilder.Sql(@"ALTER TABLE ""Alerts"" ALTER COLUMN ""Type"" TYPE integer USING CASE ""Type"" WHEN 'Temperature' THEN 0 WHEN 'Pressure' THEN 1 WHEN 'Vibration' THEN 2 WHEN 'Connectivity' THEN 3 ELSE 0 END;");

            migrationBuilder.AlterColumn<int>(
                name: "Type",
                table: "Alerts",
                type: "integer",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CriticalPressure",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "CriticalTemperature",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "CriticalVibration",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "WarningPressure",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "WarningTemperature",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "WarningVibration",
                table: "Assets");

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "Alerts",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldMaxLength: 50);
        }
    }
}
