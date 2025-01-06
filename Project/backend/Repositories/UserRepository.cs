using backend.Context;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class UserRepository
{
    private readonly MasterContext _context;

    public UserRepository(MasterContext masterContext)
    {
        _context = masterContext;
    }

    public async Task<List<string>> GetAllNicknames()
    {
        return await _context.Users
            .Select(user => user.Nickname)
            .ToListAsync();
    }

    public async Task<bool> CheckIfNicknameExistsAsync(string nickname)
    {
        return await _context.Users.AnyAsync(user => user.Nickname == nickname);
    }

    public async Task<bool> CheckIfEmailExistsAsync(string email)
    {
        return await _context.Users.AnyAsync(user => user.Email == email);
    }

    public async Task<User?> GetUserByIdAsync(int userId)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
    }

    public async Task<UserDTO?> GetUserAsync(int userId)
    {
        return await _context.Users
            .Where(u => u.Id == userId)
            .Select(u => new UserDTO
            {
                Id = u.Id,
                Email = u.Email,
                Name = u.Name,
                Surname = u.Surname,
                Nickname = u.Nickname,
                Password = u.Password,
                isBanned = u.isBanned
            })
            .FirstOrDefaultAsync();

    }

    public async Task WarnUserAsync(User user)
    {
        user.WarnCount += 1;
        await _context.SaveChangesAsync();
    }

    public async Task BanUserAsync(User user, string message)
    {
        
        var banPost = new Post
        {
            CreatedAt = DateTime.Now,
            Description = message,
            ImageUrl = "/images/photos/banned.jpg",
            UserId = user.Id,
            Likes = new List<Like>(),
            User = user
        };
        await _context.Posts.AddAsync(banPost);
        user.isBanned = true;
        await _context.SaveChangesAsync();
        
    }

    public async Task DeleteAllUserPostsAndLikesAsync(int userId)
    {
        var posts = await _context.Posts
            .Where(p => p.UserId == userId)
            .Include(p => p.Likes)
            .ToListAsync();

        var likesToDelete = posts.SelectMany(p => p.Likes).ToList();
        _context.Likes.RemoveRange(likesToDelete);
        _context.Posts.RemoveRange(posts);
        await _context.SaveChangesAsync();
    }
    public async Task<List<UserDTO>> GetAllUsersAdminAsync()
    {
        return await _context.Users.Select(user => new UserDTO
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Surname = user.Surname,
            Nickname = user.Nickname,
            Password = user.Password,
            isBanned = user.isBanned
        }).ToListAsync();
    }
    public bool IsAdmin(User user)
    {
        return user.isAdmin;
    }
    public async Task RegisterUserAsync(RegisterUserDTO registerUser)
    {
        var user = new User
        {
            Name = registerUser.Name,
            Surname = registerUser.Surname,
            Nickname = registerUser.Nickname,
            BirthDate = registerUser.BirthDate,
            Email = registerUser.Email,
            Password = registerUser.Password,
            CreatedAt = DateTime.UtcNow,
            WarnCount = 0,
            isBanned = false,
            isAdmin = false,
            Posts = new List<Post>(),
            Likes = new List<Like>()
        };

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }
    
    public UserDTO LogInUserDetails(User user)
    {
        return new UserDTO{
            Id = user.Id,
            Nickname = user.Nickname,
            Name = user.Name,
            Surname = user.Surname,
            Email = user.Email,
            Password = user.Password,
            isBanned =  user.isBanned
        };
        
    }

    public async Task<User?> CheckUserExists(LoginUserDTO loginUserDto)
    {
        return await _context.Users.Where(user => user.Nickname == loginUserDto.Nickname && user.Password == loginUserDto.Password)
            .FirstOrDefaultAsync();
    }
    
}