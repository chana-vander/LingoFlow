using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LingoFlow.Data.Migrations
{
    /// <inheritdoc />
    public partial class upDBCon2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "Conversations");

            migrationBuilder.DropColumn(
                name: "RecordedAt",
                table: "Conversations");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "EndTime",
                table: "Conversations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RecordedAt",
                table: "Conversations",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
