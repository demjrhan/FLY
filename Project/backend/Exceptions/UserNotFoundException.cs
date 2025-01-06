namespace backend.Exceptions;

public class UserNotFoundException : System.Exception
{
    public UserNotFoundException(int userId) : base($"User with id {userId} does not exists.")
    {
        
    }
}