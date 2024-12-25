namespace backend.DTOs;

public class PostDTO
{
    public int Id { get; set; }
    public UserDTO Owner { get; set; } 
    public string ImageUrl { get; set; }
    public string Description { get; set; }
    public int Likes { get; set; }
}
