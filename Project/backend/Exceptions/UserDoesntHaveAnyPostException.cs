namespace backend.Exceptions;

public class UserDoesntHaveAnyPostException : System.Exception
{
    public UserDoesntHaveAnyPostException(int userId) : base($"User with id {userId} does not have any post.")
    {
        
    }
}