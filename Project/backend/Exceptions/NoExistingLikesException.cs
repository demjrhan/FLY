namespace backend.Exceptions;

public class NoExistingLikesException : System.Exception
{
    public NoExistingLikesException() : base("There is no likes existing in database.")
    {
        
    }
}