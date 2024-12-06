using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data;

public class LikeConfiguration : IEntityTypeConfiguration<Like>
{
    public void Configure(EntityTypeBuilder<Like> l)
    {
        l.HasKey(e => e.Id); 
        
     
        l.HasOne(e => e.User)
            .WithMany(u => u.Likes)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade); 

      
        l.HasOne(e => e.Post)
            .WithMany(p => p.Likes)
            .HasForeignKey(e => e.PostId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
