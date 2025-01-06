using backend.DTOs;
using backend.Exceptions;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class LikeService
{
    private readonly LikeRepository _likeRepository;
    public LikeService(LikeRepository likeRepository)
    {
        _likeRepository = likeRepository;
    }
    
    public async Task<bool> IsUserLikedPostAlready(Post post, int userId)
    {
        var like = await _likeRepository.IsUserLikedPostAlready(post, userId);
        return like != null;
        
    }

    public async Task LikePostAsync(Post post, LikePostDTO likePostDto, User user)
    {
        await _likeRepository.LikePostAsync(post, likePostDto, user);
    }
    
    public async Task<List<LikeDataDTO>> GetAllLikesAdminAsync()
    {
        var likes = await _likeRepository.GetAllLikesAdminAsync();
        if (likes.Count == 0)
        {
            throw new NoExistingLikesException();
        }

        return likes;
    }
}