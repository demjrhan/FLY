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