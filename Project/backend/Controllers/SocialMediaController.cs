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

    

    [HttpGet("/api/getPostsAdmin")]
    public async Task<IActionResult> GetPostsAdminAsync()
    {
        var posts = await _context.Posts
            .Include(p => p.User) 
            .Select(post => new PostDTO
            {
                Id = post.Id,
                Owner = new UserDTO
                {
                    Id = post.User.Id,
                    Name = post.User.Name,
                    Surname = post.User.Surname,
                    Nickname = post.User.Nickname, 
                    Email = post.User.Email,
                    Password = post.User.Password
                },
                ImageUrl = post.ImageUrl,
                Description = post.Description,
                Likes = post.Likes.Count 
            })
            .ToListAsync();

        return Ok(posts);
    }


    [HttpGet("/api/getPostByPostIdAdmin/{postId}")]
    public async Task<IActionResult> GetPostByPostIdIdAdmin(int postId)
    {
        var posts = await _context.Posts
            .Include(p => p.User) 
            .Select(post => new PostDTO
            {
                Id = post.Id,
                Owner = new UserDTO
                {
                    Id = post.User.Id,
                    Name = post.User.Name,
                    Surname = post.User.Surname,
                    Nickname = post.User.Nickname, 
                    Email = post.User.Email,
                    Password = post.User.Password
                },
                ImageUrl = post.ImageUrl,
                Description = post.Description,
                Likes = post.Likes.Count 
            })
            .ToListAsync();

        var post = posts.FirstOrDefault(p => p.Id == postId);

        if (post == null)
        {
            return NotFound(new { message = "Post not found" });
        }

        return Ok(post);
    }

}