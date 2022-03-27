using FilmFranchiseAPI.Data.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FilmFranchiseAPI.Data
{
    public class FilmFranchiseDbContext : IdentityDbContext
    {
        public DbSet<FilmFranchiseEntity> FilmFranchises { get; set; }
        public DbSet<MovieEntity> Movies { get; set; }
        public FilmFranchiseDbContext(DbContextOptions<FilmFranchiseDbContext> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<FilmFranchiseEntity>().ToTable("Franchises");
            modelBuilder.Entity<FilmFranchiseEntity>().Property(f => f.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<FilmFranchiseEntity>().HasMany(f => f.Movies).WithOne(m => m.FilmFranchise);


            modelBuilder.Entity<MovieEntity>().ToTable("Movies");
            modelBuilder.Entity<MovieEntity>().Property(m => m.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<MovieEntity>().HasOne(m => m.FilmFranchise).WithMany(m => m.Movies);

            //https://docs.microsoft.com/en-us/ef/core/managing-schemas/migrations/?tabs=dotnet-core-cli
            //dotnet tool install --global dotnet-ef
            //dotnet tool update --global dotnet-ef
            //dotnet ef --help
            //dotnet ef migrations add {InitialCreate}
            //dotnet ef database update
        }
    }
}
