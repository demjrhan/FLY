using backend.Context;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class LikeRepository
{
    private readonly MasterContext _context;

    public LikeRepository(MasterContext masterContext)
    {
        _context = masterContext;
    }

    public async Task<Like?> IsUserLikedPostAlready(Post post, int userId)
    {
        return post.Likes.FirstOrDefault(l => l.UserId == userId);
    }
    public async Task LikePostAsync(Post post, LikePostDTO likePostDto, User user)
    {
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
    }
    
    public async Task<List<LikeDataDTO>> GetAllLikesAdminAsync()
    {
        return await _context.Likes
            .Include(like => like.User)
            .Select(like => new LikeDataDTO()
            {
                Id = like.Id,
                Nickname = like.User.Nickname,
                ReactionType = like.ReactionType
            }).ToListAsync();

    }

}