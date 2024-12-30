namespace backend.DTOs;

public class RegisterUserDTO
{
    public string Name { get; set; }
    public string Surname { get; set; }
    
    public string Nickname { get; set; }
    public DateTime BirthDate { get; set; }

    public string Email { get; set; }

    public string Password { get; set; }
   
}