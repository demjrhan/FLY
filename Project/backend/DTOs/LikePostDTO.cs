namespace backend.DTOs;

public class LikePostDTO
{
    public int userId { get; set; }
    public int postId { get; set; }
    public string reactionType { get; set; }
}