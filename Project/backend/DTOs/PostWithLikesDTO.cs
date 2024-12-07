using backend.Models;

namespace backend.DTOs;

public class PostWithLikesDto
{
    public int Id { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<LikeWithoutUnnecessaryInfoDto> LikeWithoutUnnecessaryInfo { get; set; }  
}