using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using backend.DTOs;
using backend.Exceptions;
using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Http.HttpResults;

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

        if (await _userRepository.CheckIfNicknameExistsAsync(registerUser.Nickname))
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
        
        if (await _userRepository.CheckIfEmailExistsAsync(registerUser.Email))
        {
            errors.Add("Email", "Email is already exists in database, please use different one.");
        }

        var passwordRegex = new Regex(@"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$");
        if (!passwordRegex.IsMatch(registerUser.Password))
        {
            errors.Add("Password", "Password must contain at least one uppercase letter, one number, and one special character.");
        }
        
        return errors;
    }

    public async Task<User> GetUserByIdAsync(int userId)
    {
        var user = await _userRepository.GetUserByIdAsync(userId);
        if (user == null)
        {
            throw new UserNotFoundException(userId);
        }
        return user;
        
    }
    

    public async Task<List<UserDTO>> GetAllUsersAdminAsync()
    {
        var users = await _userRepository.GetAllUsersAdminAsync();
        if (users == null || users.Count == 0)
        {
            throw new NoExistingUserException();
        }

        return users;
    }
    
    public async Task WarnUserAsync(int userId)
    {
        var user = await GetUserByIdAsync(userId);
        await _userRepository.WarnUserAsync(user);
        if (user.WarnCount >= 3)
        {
            await BanUserAsync(user.Id, "Because user have 3 or more warns, user banned from system.");
        } 
    }
    
    public async Task BanUserAsync(int userId, string message)
    {
        var user = await GetUserByIdAsync(userId);
        await _userRepository.DeleteAllUserPostsAndLikesAsync(userId);
        await _userRepository.BanUserAsync(user, message);
    }
    public async Task<bool> IsAdminAsync(int userId)
    {
        var user = await GetUserByIdAsync(userId);
        return _userRepository.IsAdmin(user);

    }
    public async Task<Dictionary<string,string>> RegisterUserAsync(RegisterUserDTO registerUser)
    {
        var validationErrors = await ValidateRegisterUser(registerUser);

        if (validationErrors.Count > 0)
        {
            return validationErrors;
        }

        await _userRepository.RegisterUserAsync(registerUser);
        return new Dictionary<string, string>();
    }
    
    public async Task<UserDTO> LoginUser(LoginUserDTO loginUserDto)
    {

        var user = await _userRepository.CheckUserExists(loginUserDto);
        
        if (user == null)
        {
            throw new LoginDetailsWrongException();
        }

        return  _userRepository.LogInUserDetails(user);
       
        
    }
    public async Task<UserDTO?> GetUserAsync(int userId)
    {
        var user = await _userRepository.GetUserAsync(userId);
        if (user == null)
        {
            throw new UserNotFoundException(userId);
        }

        return user;
    }

}