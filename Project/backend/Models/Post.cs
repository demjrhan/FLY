namespace backend.Models;

public class Post
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }

    
    public User User { get; set; }
    public ICollection<Like> Likes { get; set; }  
}