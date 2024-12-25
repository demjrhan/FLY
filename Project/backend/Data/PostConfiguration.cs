using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data;

public class PostConfiguration : IEntityTypeConfiguration<Post>
{
    public void Configure(EntityTypeBuilder<Post> p)
    {
        p.HasKey(e => e.Id); 
        
        p.Property(e => e.Description)
            .HasMaxLength(100) 
            .IsRequired();

        p.Property(e => e.ImageUrl)
            .HasMaxLength(50)
            .IsRequired();
        
        p.Property(e => e.CreatedAt)
            .HasDefaultValueSql("GETDATE()");
        
        p.HasOne(e => e.User)
            .WithMany(u => u.Posts)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade); 
        
        p.HasMany(e => e.Likes)
            .WithOne(l => l.Post)
            .HasForeignKey(l => l.PostId)
            .OnDelete(DeleteBehavior.Cascade); 
    }
}
