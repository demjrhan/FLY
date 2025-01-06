namespace backend.Exceptions;

public class NoExistingPostException : System.Exception
{
    public NoExistingPostException() : base("There is no post existing in database.")
    {
        
    }
}