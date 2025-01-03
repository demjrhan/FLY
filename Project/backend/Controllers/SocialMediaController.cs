﻿using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using backend.Context;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/")]
public class SocialMediaController : ControllerBase
{
    private readonly MasterContext _context;
    private readonly UserService _userService;

    public SocialMediaController(MasterContext context, UserService userService)
    {
        _userService = userService;
        _context = context;
    }

    
    [HttpGet("/api/getAllPostsAdmin")]
    public async Task<IActionResult> GetAllPostsAdminAsync()
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
                    Password = post.User.Password
                },
                ImageUrl = post.ImageUrl,
                Description = post.Description,
                Likes = post.Likes.Count
            })
            .ToListAsync();

        return Ok(posts);
    }
    [HttpGet("/api/GetAllPostsGuest")]
    public async Task<IActionResult> GetAllPostsGuestAsync()
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
                    Password = ""
                    
                },
                ImageUrl = post.ImageUrl,
                Description = post.Description,
                Likes = post.Likes.Count
            })
            .ToListAsync();

        return Ok(posts);
    }
    [HttpGet("/api/getAllUsersAdmin")]
    public async Task<IActionResult> GetAllUsersAdmin()
    {
        var users = await _context.Users.Select(user => new UserDTO
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Surname = user.Surname,
            Nickname = user.Nickname,
            Password = user.Password
        }).ToListAsync();

        return Ok(users);
    }

    [HttpGet("/api/getPostByPostIdAdmin/{postId}")]
    public async Task<IActionResult> GetPostByPostIdAdmin(int postId)
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

    [HttpDelete("/api/DeletePostById/{postId}")]
    public async Task<IActionResult> DeletePostByIdAsync(int postId)
    {
        var post = await _context.Posts.FindAsync(postId);

        if (post == null)
        {
            return NotFound(new { message = "Post not found" });
        }

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Post deleted successfully" });
    }

    [HttpPut("/api/EditPost/{postId}")]
    public async Task<IActionResult> EditPostAsync(int postId, [FromBody] EditPostDTO editPostDto)
    {
        if (string.IsNullOrWhiteSpace(editPostDto.Description) || string.IsNullOrWhiteSpace(editPostDto.ImageUrl))
        {
            return BadRequest(new { message = "Description or ImageUrl cannot be empty." });
        }

        var post = await _context.Posts.FindAsync(postId);

        if (post == null)
        {
            return NotFound(new { message = "Post not found" });
        }

        post.Description = editPostDto.Description;
        post.ImageUrl = editPostDto.ImageUrl;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Post updated successfully", post });
    }

    [HttpPut("/api/WarnUser/{userId}")]
    public async Task<IActionResult> WarnUserAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        user.WarnCount += 1;
        await _context.SaveChangesAsync();
        if (user.WarnCount >= 3)
        {
            return await BanUser(user.Id, "Because user have 3 or more warns, user banned from system.");
        } 
        return Ok(new { message = "User warned successfully", user });
    }

    [HttpGet("/api/GetLikeDetails/{postId}")]
    public async Task<IActionResult> GetLikeDetails(int postId)
    {
        var post = await _context.Posts.FindAsync(postId);

        if (post == null)
        {
            return NotFound(new { message = "Post not found" });
        }

        var likeDataList = await _context.Likes
            .Include(like => like.User)
            .Where(like => like.PostId == postId)
            .Select(like => new LikeDataDTO
            {
                Nickname = like.User.Nickname,
                ReactionType = like.ReactionType,
            })
            .ToListAsync();

        return Ok(likeDataList);
    }


    [HttpPost("/api/RegisterUser")]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterUserDTO registerUser)
    {
        var validationErrors = _userService.ValidateRegisterUser(registerUser);

        if (validationErrors.Count > 0)
        {
            return BadRequest(new { Message = "Validation failed", Errors = validationErrors });
        }

        var user = new User
        {
            Name = registerUser.Name,
            Surname = registerUser.Surname,
            Nickname = registerUser.Nickname,
            BirthDate = registerUser.BirthDate,
            Email = registerUser.Email,
            Password = registerUser.Password,
            CreatedAt = DateTime.UtcNow,
            WarnCount = 0,
            isBanned = false,
            isAdmin = false,
            Posts = new List<Post>(),
            Likes = new List<Like>()
        };

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "User registered successfully", User = registerUser });
    }

    [HttpPost("/api/LoginUser")]
    public async Task<IActionResult> LoginUser([FromBody] LoginUserDTO loginUserDto)
    {
        var user = await _context.Users.Where(user => user.Nickname == loginUserDto.Nickname && user.Password == loginUserDto.Password)
            .FirstOrDefaultAsync();
        
        
        if (user == null)
        {
            return BadRequest(new { Message = "Either nickname or password is wrong." });
        }
        
        return Ok(new UserDTO{
            Id = user.Id,
            Nickname = user.Nickname,
            Name = user.Name,
            Surname = user.Surname,
            Email = user.Email,
            Password = user.Password
        });
        
    }
    
    [HttpDelete("/api/BanUser/{userId}")]
    public async Task<IActionResult> BanUser(int userId, string? message)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return BadRequest(new { message = "User is not found in the system." });
        }
        var posts = await _context.Posts
            .Where(p => p.UserId == userId)
            .Include(p => p.Likes)
            .ToListAsync();

        // Delete all posts and their likes
        foreach (var post in posts)
        {
            _context.Likes.RemoveRange(post.Likes); // Remove likes of the post
            _context.Posts.Remove(post);           // Remove the post itself
        }
        

        // Remove the user
        _context.Users.Remove(user);

        // Save all changes in one transaction
        await _context.SaveChangesAsync();

        // Return success message
        return Ok(new
        {
            message = message ?? "User banned and all related data deleted successfully."
        });
    }

    [HttpDelete("/api/DeleteUsersAllPosts/{userId}")]
    public async Task<IActionResult> DeleteUsersAllPosts(int userId)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return NotFound(new { message = "User not found." });
        }

        var posts = _context.Posts.Where(post => post.User.Id == userId);
        if (!posts.Any())
        {
            return NotFound(new { message = "No posts found for the user." });
        }

        _context.Posts.RemoveRange(posts); 
        await _context.SaveChangesAsync();

        return Ok(new { message = "User posts deleted successfully." });
    }



    [HttpGet("/api/GetUserPostsAdmin/{userId}")]
    public async Task<IActionResult> GetUserPostsAdmin(int userId)
    {
        var posts = await _context.Posts
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
                    Password = post.User.Password
                },
                ImageUrl = post.ImageUrl,
                Description = post.Description,
                Likes = post.Likes.Count
            }).ToListAsync();

        return Ok(posts);
    }
    
    [HttpGet("/api/GetUserPostsGuest/{userId}")]
    public async Task<IActionResult> GetUserPostsGuest(int userId)
    {
        var posts = await _context.Posts
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
                    Password = ""
                },
                ImageUrl = post.ImageUrl,
                Description = post.Description,
                Likes = post.Likes.Count
            }).ToListAsync();

        return Ok(posts);
    }

    [HttpGet("/api/GetPostsLikedByUser/{userId}")]
    public async Task<IActionResult> GetPostsLikedByUser(int userId)
    {
        var posts = await _context.Likes
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
                    Password = like.Post.User.Password
                },
                ImageUrl = like.Post.ImageUrl,
                Description = like.Post.Description,
                Likes = like.Post.Likes.Count
            }).ToListAsync();

        return Ok(posts);
    }

    [HttpPost("/api/AddPost")]
    public async Task<IActionResult> AddPost([FromBody] AddPostDTO addPostDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == addPostDto.UserId);
        if (user == null)
        {
            return BadRequest("User not found.");
        }

        var lastPost = await _context.Posts
            .OrderByDescending(post => post.Id)
            .FirstOrDefaultAsync();

        var lastId = lastPost?.Id ?? 0;
        lastId += 1;
        var post = new Post
        {
            Id = lastId,
            CreatedAt = DateTime.UtcNow,
            Description = addPostDto.Description,
            UserId = addPostDto.UserId,
            ImageUrl = addPostDto.ImageUrl,
            Likes = new List<Like>(),
            User = user
        };
        await _context.Posts.AddAsync(post);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Post created successfully." });
    }
}