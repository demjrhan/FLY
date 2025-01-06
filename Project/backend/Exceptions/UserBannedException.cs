namespace backend.Exceptions;

public class UserBannedException : System.Exception
{
    public UserBannedException() : base("User is banned, can not post.")
    {
        
    }
}