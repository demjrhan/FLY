
namespace backend.Exceptions;

public class UserDidNotLikeAnyPostException : System.Exception
{
    public UserDidNotLikeAnyPostException(int userId) : base($"User with id {userId} did not like any post yet.")
    {
        
    }
}
