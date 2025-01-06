namespace backend.Exceptions;

public class NoExistingUserException : System.Exception
{
    public NoExistingUserException() : base("There is no user existing in database.")
    {
        
    }
}