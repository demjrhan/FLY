namespace backend.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public DateTime BirthDate { get; set; }
    public string Password { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public ICollection<Post> Posts { get; set; } 
    public ICollection<Like> Likes { get; set; }
}