namespace backend.DTOs;

public class UserWithPostAndLikesDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public DateTime BirthDate { get; set; }
    public string Password { get; set; }
    public ICollection<PostWithLikesDto> PostWithLikes { get; set; }  
}