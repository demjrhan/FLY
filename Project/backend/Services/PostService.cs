using backend.DTOs;
using backend.Exceptions;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class PostService
{
    private readonly PostRepository _postRepository;
    public PostService(PostRepository postRepository)
    {
        _postRepository = postRepository;
    }
    
    public async Task<List<GetPostDTO>> GetAllPostsAsync()
    {
        var posts = await _postRepository.GetAllPostsAsync();
        if (posts == null || posts.Count == 0)
        {
            throw new NoExistingPostException();
        }

        return posts;
    }

    public async Task<List<GetPostDTO>> GetAllPostsAdminAsync()
    {
        var posts = await _postRepository.GetAllPostsAdminAsync();
        if (posts == null || posts.Count == 0)
        {
            throw new NoExistingPostException();
        }

        return posts;
    }
    
    public async Task<GetPostDTO> GetPostByIdAdminAsync(int postId)
    {
        var post = await _postRepository.GetPostByIdAdminAsync(postId);
        if (post == null)
        {
            throw new PostNotFoundException(postId);
        }
        return post;
    }
    public async Task<GetPostDTO> GetPostByIdAsync(int postId)
    {
        var post = await _postRepository.GetPostByIdAsync(postId);
        if (post == null)
        {
            throw new PostNotFoundException(postId);
        }
        return post;
    }
    public async Task DeletePostByIdAsync(int postId)
    {
        var post = await _postRepository.FindPostAsync(postId);
        if (post == null)
        {
            throw new PostNotFoundException(postId);
        }

        await _postRepository.DeletePostAsync(post);
    }

    public bool CheckEditedPost(string description, string imageUrl)
    {
        if (string.IsNullOrWhiteSpace(description) || string.IsNullOrWhiteSpace(imageUrl))
        {
            return true;
        }

        return false;
    }
    
    public async Task EditPostAsync(int postId, EditPostDTO editPostDto)
    {
        var post = await _postRepository.FindPostAsync(postId);
        if (post == null)
        {
            throw new PostNotFoundException(postId);
        }

        await _postRepository.EditPostAsync(post, editPostDto);
    }
    
    public async Task<List<GetPostDTO>> GetUserPostsAdminAsync(int userId)
    {
        var posts = await _postRepository.GetUserPostsAdminAsync(userId);
        if (posts == null || posts.Count == 0)
        {
            throw new UserDoesntHaveAnyPostException(userId);
        }
        return posts;
    }
    public async Task<List<GetPostDTO>> GetUserPostsGuestAsync(int userId)
    {
        var posts = await _postRepository.GetUserPostsGuestAsync(userId);
        if (posts == null || posts.Count == 0)
        {
            throw new UserDoesntHaveAnyPostException(userId);
        }
        return posts;
    }
    public async Task<List<GetPostDTO>> GetUserPostsAsync(int userId)
    {
        var posts = await _postRepository.GetUserPostsAsync(userId);
        if (posts == null || posts.Count == 0)
        {
            throw new UserDoesntHaveAnyPostException(userId);
        }
        return posts;
    }
    
    public async Task<List<GetPostDTO>> GetPostsLikedByUserAsync(int userId)
    {
        var posts = await _postRepository.GetPostsLikedByUserAsync(userId);
        if (posts == null || posts.Count == 0)
        {
            throw new UserDidNotLikeAnyPostException(userId);
        }
        return posts;
    }

    public async Task AddPost(AddPostDTO addPostDto, User user)
    {
        if (user.isBanned)
        {
            throw new UserBannedException();
        }
        await _postRepository.AddPost(addPostDto, user);
        
    }
    public async Task<Post?> GetPostWithLikesAsync(int postId)
    {
        var post = await _postRepository.GetPostWithLikesAsync(postId);
        if (post == null)
        {
            throw new PostNotFoundException(postId);
        }
        return post;
    }

    public async Task<List<LikeDataDTO>> GetLikeDetailsAsync(int postId)
    {
        var post = await _postRepository.FindPostAsync(postId);
        if (post == null)
        {
            throw new PostNotFoundException(postId);
        }
        return await _postRepository.GetLikeDetailsAsync(postId);
        
    }

    public async Task DeleteUsersAllPosts(int userId)
    {
        await _postRepository.DeleteUsersAllPostsAsync(userId);
    }
    public async Task<bool> CheckIfUserHasPostsAsync(int userId)
    {
        var result = await _postRepository.CheckIfUserHasPostsAsync(userId);
        if (!result) throw new UserDoesntHaveAnyPostException(userId);
        return result;
    }
    
}