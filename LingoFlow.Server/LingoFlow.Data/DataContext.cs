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
namespace LingoFlow.Data
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<Word> Words { get; set; }
        //public DbSet<FeedbackHistory> FeedbackHistories { get; set; }
        //public class FeedbackHistory
        //{
        //    [Key]
        //    public int Id { get; set; }

        //    [Required]
        //    public int UserId { get; set; }

        //    [Required]
        //    public int TopicId { get; set; }

        //    [Required]
        //    public string Transcription { get; set; }

        //    [Range(0, 100)]
        //    public int OverallScore { get; set; }

        //    [Range(0, 100)]
        //    public int VocabularyScore { get; set; }

        //    [Range(0, 100)]
        //    public int FluencyScore { get; set; }

        //    [Range(0, 100)]
        //    public int GrammarScore { get; set; }

        //    public string FeedbackJson { get; set; }

        //    public DateTime CreatedAt { get; set; }
        //}

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=lingoFlow_bsdDB;Trusted_Connection=True;");
            optionsBuilder.LogTo(message => Debug.WriteLine(message));
        }

    }
}

