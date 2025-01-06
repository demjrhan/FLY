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
    private readonly LikeService _likeService;

    public SocialMediaController(MasterContext context, UserService userService, PostService postService, LikeService likeService)
    {
        _userService = userService;
        _context = context;
        _postService = postService;
        _likeService = likeService;
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
            return Ok(new { message = ex.Message, posts = new List<GetPostDTO>() });
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
            return Ok(new { message = ex.Message, posts = new List<GetPostDTO>() });
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
            return Ok(new { message = ex.Message, posts = new List<GetPostDTO>()});
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
            return Ok(new { message = ex.Message, posts = new List<UserDTO>()});
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
        try
        {
            var post = await _postService.GetPostByIdAsync(postId);

            return Ok(post);
        }
        catch (PostNotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }


    [HttpDelete("/api/DeletePostById/{postId}")]
    public async Task<IActionResult> DeletePostByIdAsync(int postId)
    {
        try
        {
            await _postService.DeletePostByIdAsync(postId);
            return Ok(new { message = "Post deleted successfully" });
        }
        catch (PostNotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("/api/EditPost/{postId}")]
    public async Task<IActionResult> EditPostAsync(int postId, [FromBody] EditPostDTO editPostDto)
    {
        try
        {
            if (_postService.CheckEditedPost(editPostDto.Description, editPostDto.ImageUrl))
            {
                return BadRequest(new { message = "Description or ImageUrl cannot be empty." });
            }

            await _postService.EditPostAsync(postId, editPostDto);
            return Ok(new { message = "Post edited successfully." });
        }
        catch (PostNotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
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
        try
        {
            var posts = await _postService.GetUserPostsAdminAsync(userId);
            return Ok(posts);
        }
        catch (UserDoesntHaveAnyPostException ex)
        {
            return Ok(new { message = ex.Message, posts = new List<GetPostDTO>() });
        }

        
    }


    [HttpGet("/api/GetUserPostsGuest/{userId}")]
    public async Task<IActionResult> GetUserPostsGuest(int userId)
    {
        try
        {
            var posts = await _postService.GetUserPostsGuestAsync(userId);
            return Ok(posts);
        }
        catch (UserDoesntHaveAnyPostException ex)
        {
            return Ok(new { message = ex.Message, posts = new List<GetPostDTO>() });
        }
    }

    [HttpGet("/api/GetUserPosts/{userId}")]
    public async Task<IActionResult> GetUserPosts(int userId)
    {
        try
        {
            var posts = await _postService.GetUserPostsAsync(userId);
            return Ok(posts);
        }
        catch (UserDoesntHaveAnyPostException ex)
        {
            return Ok(new { message = ex.Message, posts = new List<GetPostDTO>() });
        }
        
    }

    [HttpGet("/api/GetPostsLikedByUser/{userId}")]
    public async Task<IActionResult> GetPostsLikedByUser(int userId)
    {
        try
        {
            var posts = await _postService.GetPostsLikedByUserAsync(userId);
            return Ok(posts);
        }
        catch (UserDidNotLikeAnyPostException ex)
        {
            return Ok(new { message = ex.Message, posts = new List<GetPostDTO>() });
        }
    }

    [HttpPost("/api/AddPost")]
    public async Task<IActionResult> AddPost([FromBody] AddPostDTO addPostDto)
    {
        try
        {
            var user = await _userService.GetUserByIdAsync(addPostDto.UserId);
            await _postService.AddPost(addPostDto, user);
            return Ok("Post created successfully.");
        }
        catch (UserBannedException ex)
        {
            return Ok(new { message = ex.Message });
        }
        catch (UserNotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("/api/GetLikeDetails/{postId}")]
    public async Task<IActionResult> GetLikeDetails(int postId)
    {
        try
        {
            var likeDataList = await _postService.GetLikeDetailsAsync(postId);
            return Ok(likeDataList);
        }
        catch (PostNotFoundException ex)
        {
            return Ok(new { message = ex.Message });
        }
        
        
    }

    [HttpPut("/api/LikePost/{userId}/{postId}/{reactionType}")]
    public async Task<IActionResult> LikePost([FromBody] LikePostDTO likePostDto)
    {

        try
        {
            var post = await _postService.GetPostWithLikesAsync(likePostDto.postId);
            var user = await _userService.GetUserByIdAsync(likePostDto.userId);
            var isLiked = await _likeService.IsUserLikedPostAlready(post, user.Id);
            if (isLiked)
            {
                return Ok(new { alreadyLiked = true, message = "User has already liked this post." });
            }

            await _likeService.LikePostAsync(post,likePostDto, user);
            return Ok(new { alreadyLiked = false, message = "Post liked successfully." });

        }
        catch (PostNotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UserNotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }


    
}