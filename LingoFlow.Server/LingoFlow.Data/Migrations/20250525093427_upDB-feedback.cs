using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LingoFlow.Data.Migrations
{
    /// <inheritdoc />
    public partial class upDBfeedback : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Feedbacks_Conversations_ConversationId",
                table: "Feedbacks");

            migrationBuilder.DropIndex(
                name: "IX_Feedbacks_ConversationId",
                table: "Feedbacks");

            migrationBuilder.RenameColumn(
                name: "Comments",
                table: "Feedbacks",
                newName: "VocabularyComment");

            migrationBuilder.AddColumn<string>(
                name: "FluencyComment",
                table: "Feedbacks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "FluencyScore",
                table: "Feedbacks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "GeneralFeedback",
                table: "Feedbacks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GrammarComment",
                table: "Feedbacks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "GrammarScore",
                table: "Feedbacks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TotalWordsRequired",
                table: "Feedbacks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UsedWordsCount",
                table: "Feedbacks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "VocabularyScore",
                table: "Feedbacks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "FeedbackHistories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TopicId = table.Column<int>(type: "int", nullable: false),
                    Transcription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OverallScore = table.Column<int>(type: "int", nullable: false),
                    VocabularyScore = table.Column<int>(type: "int", nullable: false),
                    FluencyScore = table.Column<int>(type: "int", nullable: false),
                    GrammarScore = table.Column<int>(type: "int", nullable: false),
                    FeedbackJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeedbackHistories", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FeedbackHistories");

            migrationBuilder.DropColumn(
                name: "FluencyComment",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "FluencyScore",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "GeneralFeedback",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "GrammarComment",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "GrammarScore",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "TotalWordsRequired",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "UsedWordsCount",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "VocabularyScore",
                table: "Feedbacks");

            migrationBuilder.RenameColumn(
                name: "VocabularyComment",
                table: "Feedbacks",
                newName: "Comments");

            migrationBuilder.CreateIndex(
                name: "IX_Feedbacks_ConversationId",
                table: "Feedbacks",
                column: "ConversationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Feedbacks_Conversations_ConversationId",
                table: "Feedbacks",
                column: "ConversationId",
                principalTable: "Conversations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
