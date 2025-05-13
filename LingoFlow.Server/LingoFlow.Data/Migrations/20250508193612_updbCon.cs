using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LingoFlow.Data.Migrations
{
    /// <inheritdoc />
    public partial class updbCon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Feedbacks_ConversationId",
                table: "Feedbacks");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Conversations",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "Conversations",
                newName: "RecordedAt");

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "Conversations",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<TimeSpan>(
                name: "Length",
                table: "Conversations",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.CreateIndex(
                name: "IX_Feedbacks_ConversationId",
                table: "Feedbacks",
                column: "ConversationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Feedbacks_ConversationId",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "Conversations");

            migrationBuilder.DropColumn(
                name: "Length",
                table: "Conversations");

            migrationBuilder.RenameColumn(
                name: "RecordedAt",
                table: "Conversations",
                newName: "StartTime");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Conversations",
                newName: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Feedbacks_ConversationId",
                table: "Feedbacks",
                column: "ConversationId",
                unique: true);
        }
    }
}
