using backend.Context;
using backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class PostRepository
{
    private readonly MasterContext _context;
    
    public async Task<List<GetPostDTO>> GetAllPostsAsync()
    {
        return await _context.Posts
            .Include(p => p.User)
            .Select(post => new GetPostDTO
            {
                Id = post.Id,
                Owner = new UserDTO
                {
                    Id = post.User.Id,
                    Name = post.User.Name,
                    Surname = post.User.Surname,
                    Nickname = post.User.Nickname,
                    Email = "",
                    Password = "",
                    isBanned = post.User.isBanned
                    
                },
                ImageUrl = post.ImageUrl,
                Description = post.Description,
                Likes = post.Likes.Count
            })
            .ToListAsync();
    }

    public async Task<List<GetPostDTO>> GetAllPostsAdminAsync()
    {
        return await _context.Posts
            .Include(p => p.User)
            .Select(post => new GetPostDTO
            {
                Id = post.Id,
                Owner = new UserDTO
                {
                    Id = post.User.Id,
                    Name = post.User.Name,
                    Surname = post.User.Surname,
                    Nickname = post.User.Nickname,
                    Email = post.User.Email,
                    Password = post.User.Password,
                    isBanned = post.User.isBanned
                },
                ImageUrl = post.ImageUrl,
                Description = post.Description,
                Likes = post.Likes.Count
            })
            .ToListAsync();
    }
}