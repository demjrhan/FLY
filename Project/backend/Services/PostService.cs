using backend.DTOs;
using backend.Exceptions;
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
        var post = await _postRepository.GetPostByIdAdmin(postId);
        if (post == null)
        {
            throw new PostNotFoundException(postId);
        }
        return post;
    }
}