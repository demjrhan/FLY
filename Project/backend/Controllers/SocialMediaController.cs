using backend.Context;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/")]
public class SocialMediaController : ControllerBase
{
    private readonly MasterContext _context;

    public SocialMediaController(MasterContext context)
    {
        _context = context;
    }

    
    [HttpGet("/api/getPostsUser")]
    public IActionResult GetPostsUser()
    {
        var posts = new[]
        {
            new { id = 1, owner = "Demirhan Yalcin", nickname = "demirhanylcn", imageUrl = "/images/photos/sample_3.jpg", description = "Having fun with my friends!", likes = 450 },
            new { id = 2, owner = "Demirhan Yalcin", nickname = "demirhanylcn", imageUrl = "/images/photos/sample_4.jpg", description = "What a beautiful city!", likes = 300 }
        };

        return Ok(posts);
    }
    
    [HttpGet("/api/getPostsAdmin")]
    public IActionResult GetPostsAdmin()
    {
        var posts = new[]
        {
            new { id = 1, ownerId = 1, owner = "Demirhan Yalcin", nickname = "demirhanylcn", email = "demirhanylcn@icloud.com", password = "securePass123", imageUrl = "/images/photos/sample_3.jpg", description = "Having fun with my friends!", likes = 450 },
            new { id = 2, ownerId = 1, owner = "Demirhan Yalcin", nickname = "demirhanylcn", email = "demirhanylcn@icloud.com", password = "securePass123", imageUrl = "/images/photos/sample_4.jpg", description = "What a beautiful city!", likes = 300 }

        };

        return Ok(posts);
    }

    [HttpGet("/api/getPostAdmin/{postId}")]
    public IActionResult GetPostByIdAdmin(int postId)
    {
        var posts = new[]
        {
         new { id = 1, ownerId = 1, owner = "Demirhan Yalcin", nickname = "demirhanylcn", email = "demirhanylcn@icloud.com", password = "securePass123", imageUrl = "/images/photos/sample_3.jpg", description = "Having fun with my friends!", likes = 450 },
         new { id = 2, ownerId = 1, owner = "Demirhan Yalcin", nickname = "demirhanylcn", email = "demirhanylcn@icloud.com", password = "securePass123", imageUrl = "/images/photos/sample_4.jpg", description = "What a beautiful city!", likes = 300 }

        };

        var post = posts.FirstOrDefault(p => p.id == postId);

        if (post == null)
        {
            return NotFound(new { message = "Post not found" });
        }

        return Ok(post);
    }

    
    [HttpGet("users")]
    public async Task<List<UserWithPostAndLikesDto>> GetUsersWithPostsAndLikesAsync()
    {
       
        var usersWithPostsAndLikes = await _context.Users
            .Include(u => u.Posts)
            .ThenInclude(p => p.Likes) 
            .ToListAsync();
        
        var userDtos = usersWithPostsAndLikes.Select(user => new UserWithPostAndLikesDto
        {
            Id = user.Id,
            Name = user.Name,
            Surname = user.Surname,
            BirthDate = user.BirthDate,
            Password = user.Password, 
            PostWithLikes = user.Posts.Select(post => new PostWithLikesDto
            {
                Id = post.Id,
                Description = post.Description,
                CreatedAt = post.CreatedAt,
                LikeWithoutUnnecessaryInfo = post.Likes.Select(like => new LikeWithoutUnnecessaryInfoDto
                {
                    ReactionType = like.ReactionType,
                    UserId = like.UserId
                }).ToList()
            }).ToList()
        }).ToList();


        return userDtos;
    }

}