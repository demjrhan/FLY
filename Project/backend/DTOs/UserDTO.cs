namespace backend.DTOs;

public class UserDTO
{
    public int Id { get; set; }
    public string Name { get; set; } 
    public string Surname { get; set; } 
    public string Nickname { get; set; }
    public string Email { get; set; }
    
    public string Password { get; set; }
}
