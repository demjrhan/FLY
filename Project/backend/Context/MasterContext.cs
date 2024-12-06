using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Context;

public class MasterContext : DbContext
{
    public MasterContext(DbContextOptions<MasterContext> options) : base(options) { }
    public DbSet<User> Users { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<Like> Likes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Post>()
            .HasOne(p => p.User)  // Each Post has one User
            .WithMany(u => u.Posts)  // A User can have many Posts
            .HasForeignKey(p => p.UserId);  // The foreign key in Post is UserId

        modelBuilder.Entity<Like>()
            .HasOne(l => l.User)  // Each Like has one User
            .WithMany(u => u.Likes)  // A User can like many Posts
            .HasForeignKey(l => l.UserId);  // The foreign key in Like is UserId

        modelBuilder.Entity<Like>()
            .HasOne(l => l.Post)  // Each Like is related to one Post
            .WithMany(p => p.Likes)  // A Post can have many Likes
            .HasForeignKey(l => l.PostId);  // The foreign key in Like is PostId
    }
}