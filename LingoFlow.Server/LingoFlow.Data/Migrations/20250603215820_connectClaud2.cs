using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LingoFlow.Data.Migrations
{
    /// <inheritdoc />
    public partial class connectClaud2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Feedbacks_recordings_recordingId",
                table: "Feedbacks");

            migrationBuilder.DropForeignKey(
                name: "FK_recordings_Topics_TopicId",
                table: "recordings");

            migrationBuilder.DropForeignKey(
                name: "FK_recordings_Users_UserId",
                table: "recordings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_recordings",
                table: "recordings");

            migrationBuilder.RenameTable(
                name: "recordings",
                newName: "Recordings");

            migrationBuilder.RenameIndex(
                name: "IX_recordings_UserId",
                table: "Recordings",
                newName: "IX_Recordings_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_recordings_TopicId",
                table: "Recordings",
                newName: "IX_Recordings_TopicId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Recordings",
                table: "Recordings",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Feedbacks_Recordings_recordingId",
                table: "Feedbacks",
                column: "recordingId",
                principalTable: "Recordings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Recordings_Topics_TopicId",
                table: "Recordings",
                column: "TopicId",
                principalTable: "Topics",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Recordings_Users_UserId",
                table: "Recordings",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Feedbacks_Recordings_recordingId",
                table: "Feedbacks");

            migrationBuilder.DropForeignKey(
                name: "FK_Recordings_Topics_TopicId",
                table: "Recordings");

            migrationBuilder.DropForeignKey(
                name: "FK_Recordings_Users_UserId",
                table: "Recordings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Recordings",
                table: "Recordings");

            migrationBuilder.RenameTable(
                name: "Recordings",
                newName: "recordings");

            migrationBuilder.RenameIndex(
                name: "IX_Recordings_UserId",
                table: "recordings",
                newName: "IX_recordings_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Recordings_TopicId",
                table: "recordings",
                newName: "IX_recordings_TopicId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_recordings",
                table: "recordings",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Feedbacks_recordings_recordingId",
                table: "Feedbacks",
                column: "recordingId",
                principalTable: "recordings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_recordings_Topics_TopicId",
                table: "recordings",
                column: "TopicId",
                principalTable: "Topics",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_recordings_Users_UserId",
                table: "recordings",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
