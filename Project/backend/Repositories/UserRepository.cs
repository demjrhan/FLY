using backend.Context;
using Microsoft.AspNetCore.Mvc;
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
        var usernames = await _context.Users
            .Select(user => user.Nickname)
            .ToListAsync();
        return usernames;
    }

    public async Task<bool> CheckIfNicknameExists(string nickname)
    {
        var result = await _context.Users.AnyAsync(user => user.Nickname == nickname);
        return result;
    }

}