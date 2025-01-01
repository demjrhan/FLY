using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> u)
    {
        u.HasKey(e => e.Id); 
        
        u.Property(e => e.Name)
            .HasMaxLength(50)
            .IsRequired(); 
        
        u.Property(e => e.Surname)
            .HasMaxLength(50)
            .IsRequired(); 
        
        u.Property(e => e.BirthDate)
            .IsRequired();

        u.Property(e => e.Email)
            .HasMaxLength(50)
            .IsRequired();

        u.Property(e => e.Nickname)
            .HasMaxLength(50)
            .IsRequired();
        
        u.Property(e => e.Password)
            .HasMaxLength(50)
            .IsRequired();

        u.Property(e => e.isAdmin)
            .IsRequired();
        
        u.Property(e => e.CreatedAt)
            .HasDefaultValueSql("GETDATE()"); 

        u.HasMany(e => e.Posts).WithOne(e => e.User).HasForeignKey(e => e.UserId);
        u.HasMany(e => e.Likes).WithOne(e => e.User).HasForeignKey(e => e.UserId);
    }
}
