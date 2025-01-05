using backend.Context;

namespace backend.Repositories;

public class LikeRepository
{
    private readonly MasterContext _context;

    public LikeRepository(MasterContext masterContext)
    {
        _context = masterContext;
    }

}