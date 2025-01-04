using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using backend.DTOs;
using backend.Repositories;

namespace backend.Services;

public class UserService
{
    private readonly UserRepository _userRepository;
    public UserService(UserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    public async Task<Dictionary<string, string>> ValidateRegisterUser(RegisterUserDTO registerUser)
    {
        var errors = new Dictionary<string, string>();

        if (!Regex.IsMatch(registerUser.Name, @"^[A-Za-z]{2,}$"))
        {
            errors.Add("Name", "Name must contain only alphabetic characters and be at least 2 characters long.");
        }

        if (!Regex.IsMatch(registerUser.Surname, @"^[A-Za-z]{2,}$"))
        {
            errors.Add("Surname", "Surname must contain only alphabetic characters and be at least 2 characters long.");
        }

        if (!Regex.IsMatch(registerUser.Nickname, @"^[A-Za-z0-9_-]{3,15}$"))
        {
            errors.Add("Nickname", "Nickname must be 3-15 characters long and can only include letters, numbers, underscores, or dashes.");
        }

        if (await _userRepository.CheckIfNicknameExists(registerUser.Nickname))
        {
            errors.Add("Nickname", "Nickname is already exists in database, select new one :<.");
        }

        if (registerUser.BirthDate > DateTime.UtcNow.AddYears(-13))
        {
            errors.Add("BirthDate", "You must be at least 13 years old to register.");
        }

        if (!Regex.IsMatch(registerUser.Email, @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"))
        {
            errors.Add("Email", "Email format is invalid.");
        }

        var passwordRegex = new Regex(@"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$");
        if (!passwordRegex.IsMatch(registerUser.Password))
        {
            errors.Add("Password", "Password must contain at least one uppercase letter, one number, and one special character.");
        }
        
        return errors;
    }
}