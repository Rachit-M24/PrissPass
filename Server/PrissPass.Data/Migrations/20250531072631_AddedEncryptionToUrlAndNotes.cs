using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PrissPass.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddedEncryptionToUrlAndNotes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Url",
                table: "VaultItems",
                newName: "EncryptedUrl");

            migrationBuilder.RenameColumn(
                name: "Notes",
                table: "VaultItems",
                newName: "EncryptedNotes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EncryptedUrl",
                table: "VaultItems",
                newName: "Url");

            migrationBuilder.RenameColumn(
                name: "EncryptedNotes",
                table: "VaultItems",
                newName: "Notes");
        }
    }
}
