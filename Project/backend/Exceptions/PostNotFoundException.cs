namespace backend.Exceptions;

public class PostNotFoundException : System.Exception
{
    public PostNotFoundException(int postId) : base($"There is no post with id {postId} exists.")
    {
         
    }
}