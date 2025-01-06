using backend.Context;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class PostRepository
{
    private readonly MasterContext _context;

    public PostRepository(MasterContext masterContext)
    {
        _context = masterContext;
    }
    
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
    
    public async Task<GetPostDTO?> GetPostByIdAdminAsync(int postId)
    {
        var posts = await _context.Posts
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
                    isBanned =  post.User.isBanned
                },
                ImageUrl = post.ImageUrl,
                Description = post.Description,
                Likes = post.Likes.Count
            })
            .ToListAsync();
    
        var post = posts.FirstOrDefault(p => p.Id == postId);
        return post;
    }
    public async Task<GetPostDTO?> GetPostByIdAsync(int postId)
    {
        var posts = await _context.Posts
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
                    isBanned =  post.User.isBanned
                },
                ImageUrl = post.ImageUrl,
                Description = post.Description,
                Likes = post.Likes.Count
            })
            .ToListAsync();
    
        var post = posts.FirstOrDefault(p => p.Id == postId);
        return post;
    }
    
    public async Task DeletePostAsync(Post post)
    {
        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();
    }

    public async Task<Post?> FindPostAsync(int postId)
    {
        return await _context.Posts.FindAsync(postId);
    }
    public async Task EditPostAsync(Post post ,EditPostDTO editPostDto)
    {
        post.Description = editPostDto.Description;
        post.ImageUrl = editPostDto.ImageUrl;
        await _context.SaveChangesAsync();
        
    }
    [HttpGet("/api/GetLikeDetails/{postId}")]
    public async Task<List<LikeDataDTO>> GetLikeDetailsAsync(int postId)
    {
        
        return await _context.Likes
            .Include(like => like.User)
            .Where(like => like.PostId == postId)
            .Select(like => new LikeDataDTO
            {
                Id = like.User.Id,
                Nickname = like.User.Nickname,
                ReactionType = like.ReactionType,
            })
            .ToListAsync();
        

    }
    public async Task<List<GetPostDTO>> GetUserPostsAdminAsync(int userId)
    {
        return await _context.Posts
            .Include(post => post.User)
            .ThenInclude(user => user.Likes)
            .Where(post => post.User.Id == userId)
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
            }).ToListAsync();
    }
    public async Task<List<GetPostDTO>> GetUserPostsGuestAsync(int userId)
    {
        return await _context.Posts
            .Include(post => post.User)
            .ThenInclude(user => user.Likes)
            .Where(post => post.User.Id == userId)
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
            }).ToListAsync();
    }
    public async Task<List<GetPostDTO>> GetUserPostsAsync(int userId)
    {
        return await _context.Posts
            .Include(post => post.User)
            .ThenInclude(user => user.Likes)
            .Where(post => post.User.Id == userId)
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
            }).ToListAsync();
    }

    public async Task<List<GetPostDTO>> GetPostsLikedByUserAsync(int userId)
    {
        return await _context.Likes
            .Include(like => like.Post)
            .ThenInclude(post => post.User)
            .Where(like => like.User.Id == userId)
            .Select(like => new GetPostDTO
            {
                Id = like.Post.Id,
                Owner = new UserDTO
                {
                    Id = like.Post.User.Id,
                    Name = like.Post.User.Name,
                    Surname = like.Post.User.Surname,
                    Nickname = like.Post.User.Nickname,
                    Email = like.Post.User.Email,
                    Password = like.Post.User.Password,
                    isBanned = like.Post.User.isBanned
                },
                ImageUrl = like.Post.ImageUrl,
                Description = like.Post.Description,
                Likes = like.Post.Likes.Count
            }).ToListAsync();
    }

    public async Task AddPost(AddPostDTO addPostDto, User user)
    {
        var post = new Post
        {
            CreatedAt = DateTime.UtcNow,
            Description = addPostDto.Description,
            UserId = addPostDto.UserId,
            ImageUrl = addPostDto.ImageUrl,
            Likes = new List<Like>(),
            User = user
        };
        await _context.Posts.AddAsync(post);
        await _context.SaveChangesAsync();
    }

    public async Task<Post?> GetPostWithLikesAsync(int postId)
    {
        return await _context.Posts.Include(p => p.Likes).FirstOrDefaultAsync(p => p.Id == postId);
    }
    
}