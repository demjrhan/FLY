namespace backend.Exceptions;

public class LoginDetailsWrongException : System.Exception
{
    public LoginDetailsWrongException() : base("Either nickname or password is wrong.")
    {
        
    }
}