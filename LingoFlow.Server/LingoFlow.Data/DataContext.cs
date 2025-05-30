using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LingoFlow.Core.Models;
using System.Diagnostics;
using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.Configuration;
namespace LingoFlow.Data
{
    public class DataContext : DbContext
    {
        private readonly IConfiguration _configuration;
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<recording> recordings { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<Vocabulary> Words { get; set; }
        public DataContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //var connectionString = _configuration.GetConnectionString("DefaultConnection");
            var dbName = Environment.GetEnvironmentVariable("Connection__String");
            optionsBuilder.UseSqlServer($"Server=(localdb)\\mssqllocaldb;Database={dbName};Trusted_Connection=True;");
            Console.WriteLine(dbName);
            //var connectionString = $"Server=(localdb)\\mssqllocaldb;Database={dbName};Trusted_Connection=True;";
            optionsBuilder.LogTo(message => Debug.WriteLine(message));

        }

    }
}
