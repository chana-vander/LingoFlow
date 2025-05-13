using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LingoFlow.Data.Migrations
{
    /// <inheritdoc />
    public partial class addsentence2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Sentence",
                table: "Words",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SentenceTranslate",
                table: "Words",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Sentence",
                table: "Words");

            migrationBuilder.DropColumn(
                name: "SentenceTranslate",
                table: "Words");
        }
    }
}
