namespace backend.DTOs;

public class AddPostDTO
{
    
    public int UserId { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}