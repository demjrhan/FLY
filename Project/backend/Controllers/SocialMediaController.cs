using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using backend.Context;
using backend.DTOs;
using backend.Exceptions;
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
    private readonly PostService _postService;

    public SocialMediaController(MasterContext context, UserService userService, PostService postService)
    {
        _userService = userService;
        _context = context;
        _postService = postService;
    }


    [HttpGet("/api/GetAllPostsAdmin")]
    public async Task<IActionResult> GetAllPostsAdminAsync()
    {
        try
        {
            var posts = await _postService.GetAllPostsAdminAsync();
            return Ok(posts);
        }
        catch (NoExistingPostException ex)
        {
            return BadRequest(new { message = ex.Message, posts = new List<GetPostDTO>() });
        }
    }

    [HttpGet("/api/GetAllPostsGuest")]
    public async Task<IActionResult> GetAllPostsGuestAsync()
    {
        try
        {
            var posts = await _postService.GetAllPostsAsync();
            return Ok(posts);
        }
        catch (NoExistingPostException ex)
        {
            return BadRequest(new { message = ex.Message, posts = new List<GetPostDTO>() });
        }
    }

    [HttpGet("/api/GetAllPostsUser")]
    public async Task<IActionResult> GetAllPostsUserAsync()
    {
        try
        {
            var posts = await _postService.GetAllPostsAsync();
            return Ok(posts);
        }
        catch (NoExistingPostException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("/api/GetAllUsersAdmin")]
    public async Task<IActionResult> GetAllUsersAdmin()
    {
        try
        {
            var users = await _userService.GetAllUsersAdminAsync();
            return Ok(users);
        }
        catch (NoExistingUserException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("/api/WarnUser/{userId}")]
    public async Task<IActionResult> WarnUserAsync(int userId)
    {
        try
        {
            await _userService.WarnUserAsync(userId);
            return Ok(new { message = "User warned successfully" });
        }
        catch (UserNotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("/api/BanUser/{userId}")]
    public async Task<IActionResult> BanUser(int userId)
    {
        try
        {
            string message = "Because of various reasons this user banned from this app... ";
            await _userService.BanUserAsync(userId, message);
            return Ok(new { message });
        }
        catch (UserNotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("/api/isAdmin/{userId}")]
    public async Task<IActionResult> IsAdmin(int userId)
    {
        try
        {
            var result = await _userService.IsAdminAsync(userId);
            return Ok(result);
        }
        catch (UserNotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("/api/RegisterUser")]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterUserDTO registerUser)
    {
        var validationErrors = await _userService.RegisterUserAsync(registerUser);

        if (validationErrors.Count > 0)
        {
            return BadRequest(new { Message = "Validation failed", Errors = validationErrors });
        }


        return Ok(new { Message = "User registered successfully" });
    }

    [HttpPost("/api/LoginUser")]
    public async Task<IActionResult> LoginUser([FromBody] LoginUserDTO loginUserDto)
    {
        try
        {
            var user = await _userService.LoginUser(loginUserDto);
            return Ok(user);
        }
        catch (LoginDetailsWrongException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("/api/GetUser/{userId}")]
    public async Task<IActionResult> GetUser(int userId)
    {
        try
        {
            var user = await _userService.GetUserAsync(userId);
            return Ok(user);
        }
        catch (UserNotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("/api/GetPostByIdAdmin/{postId}")]
    public async Task<IActionResult> GetPostByIdAdmin(int postId)
    {
        try
        {
            var post = await _postService.GetPostByIdAdminAsync(postId);

            return Ok(post);
        }
        catch (PostNotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("/api/GetPostById/{postId}")]
    public async Task<IActionResult> GetPostById(int postId)
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
                    isBanned = post.User.isBanned
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
                Id = like.User.Id,
                Nickname = like.User.Nickname,
                ReactionType = like.ReactionType,
            })
            .ToListAsync();

        return Ok(likeDataList);
    }

    [HttpPut("/api/LikePost/{userId}/{postId}/{reactionType}")]
    public async Task<IActionResult> LikePost([FromBody] LikePostDTO likePostDto)
    {
        var post = await _context.Posts.Include(p => p.Likes).FirstOrDefaultAsync(p => p.Id == likePostDto.postId);

        if (post == null)
        {
            return NotFound(new { message = "Post not found" });
        }

        var user = await _context.Users.FindAsync(likePostDto.userId);

        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        var existingLike = post.Likes.FirstOrDefault(l => l.UserId == likePostDto.userId);
        if (existingLike != null)
        {
            return Ok(new { alreadyLiked = true, message = "User has already liked this post." });
        }

        var like = new Like
        {
            UserId = likePostDto.userId,
            LikedAt = DateTime.UtcNow,
            PostId = likePostDto.postId,
            ReactionType = likePostDto.reactionType,
            User = user
        };

        post.Likes.Add(like);
        await _context.SaveChangesAsync();

        return Ok(new { alreadyLiked = false, message = "Post liked successfully." });
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
                    Password = post.User.Password,
                    isBanned = post.User.isBanned
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
                    Password = "",
                    isBanned = post.User.isBanned
                },
                ImageUrl = post.ImageUrl,
                Description = post.Description,
                Likes = post.Likes.Count
            }).ToListAsync();

        return Ok(posts);
    }

    [HttpGet("/api/GetUserPosts/{userId}")]
    public async Task<IActionResult> GetUserPosts(int userId)
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
                    Password = "",
                    isBanned = post.User.isBanned
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
                    Password = like.Post.User.Password,
                    isBanned = like.Post.User.isBanned
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

        if (user.isBanned)
        {
            return BadRequest("User is banned, can not post.");
        }

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

        return Ok(new { message = "Post created successfully." });
    }
}