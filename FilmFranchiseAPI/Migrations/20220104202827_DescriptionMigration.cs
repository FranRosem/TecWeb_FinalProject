using Microsoft.EntityFrameworkCore.Migrations;

namespace FilmFranchiseAPI.Migrations
{
    public partial class DescriptionMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Movies",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Franchises",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Franchises");
        }
    }
}
