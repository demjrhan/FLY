using backend.Models;

namespace backend.Context;

public class SampleData
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using (var scope = serviceProvider.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<MasterContext>();

            if (!context.Users.Any())
            {
                var userData = new List<User>
                {
                    new User { Name = "John", Surname = "Doe", BirthDate = DateTime.Parse("1985-07-15"), Password = "Password123!", CreatedAt = DateTime.Now },
                    new User { Name = "Jane", Surname = "Smith", BirthDate = DateTime.Parse("1990-03-22"), Password = "SecurePass1@", CreatedAt = DateTime.Now },
                    new User { Name = "Alice", Surname = "Johnson", BirthDate = DateTime.Parse("1978-11-05"), Password = "MyP@ssword2", CreatedAt = DateTime.Now },
                    new User { Name = "Bob", Surname = "Ros", BirthDate = DateTime.Parse("2000-12-25"), Password = "Pass2024#", CreatedAt = DateTime.Now },
                    new User { Name = "Charlie", Surname = "Davis", BirthDate = DateTime.Parse("1995-05-16"), Password = "Hello123!", CreatedAt = DateTime.Now },
                    new User { Name = "Emily", Surname = "Wilson", BirthDate = DateTime.Parse("1983-09-09"), Password = "Qwerty1$", CreatedAt = DateTime.Now },
                    new User { Name = "David", Surname = "Garcia", BirthDate = DateTime.Parse("1988-04-18"), Password = "Wqea1@2024", CreatedAt = DateTime.Now },
                    new User { Name = "Sophia", Surname = "Martinez", BirthDate = DateTime.Parse("1999-08-13"), Password = "Password2#", CreatedAt = DateTime.Now },
                    new User { Name = "Daniel", Surname = "Clark", BirthDate = DateTime.Parse("1992-06-30"), Password = "123Secure@", CreatedAt = DateTime.Now },
                    new User { Name = "Emma", Surname = "Harris", BirthDate = DateTime.Parse("1975-10-10"), Password = "Pass987#", CreatedAt = DateTime.Now }
                };
                context.Users.AddRange(userData);
                context.SaveChanges();
            }

            if (!context.Posts.Any())
            {
                var postData = new List<Post>
                {
                    new Post { UserId = 1, Description = "Exploring the beauty of nature.", CreatedAt = DateTime.Parse("2024-01-01") },
                    new Post { UserId = 2, Description = "Excited to share my new project!", CreatedAt = DateTime.Parse("2024-01-02") },
                    new Post { UserId = 3, Description = "Life is all about the little moments.", CreatedAt = DateTime.Parse("2024-01-03") },
                    new Post { UserId = 4, Description = "Just finished reading an amazing book.", CreatedAt = DateTime.Parse("2024-01-04") },
                    new Post { UserId = 5, Description = "Anyone up for a weekend hike?", CreatedAt = DateTime.Parse("2024-01-05") },
                    new Post { UserId = 1, Description = "Throwback to my last vacation!", CreatedAt = DateTime.Parse("2024-01-06") },
                    new Post { UserId = 3, Description = "Learning new skills is so rewarding.", CreatedAt = DateTime.Parse("2024-01-07") },
                    new Post { UserId = 4, Description = "Cooking my favorite dish today.", CreatedAt = DateTime.Parse("2024-01-08") },
                    new Post { UserId = 2, Description = "Here's a photo from my latest adventure.", CreatedAt = DateTime.Parse("2024-01-09") },
                    new Post { UserId = 5, Description = "Grateful for another wonderful day.", CreatedAt = DateTime.Parse("2024-01-10") }
                };
                context.Posts.AddRange(postData);
                context.SaveChanges();
            }

            if (!context.Likes.Any())
            {
                var likeData = new List<Like>
                {
                    new Like { UserId = 1, PostId = 2, LikedAt = DateTime.Parse("2024-01-02"), ReactionType = "Like" },
                    new Like { UserId = 1, PostId = 3, LikedAt = DateTime.Parse("2024-01-03"), ReactionType = "Love" },
                    new Like { UserId = 1, PostId = 4, LikedAt = DateTime.Parse("2024-01-04"), ReactionType = "Wow" },
                    new Like { UserId = 1, PostId = 5, LikedAt = DateTime.Parse("2024-01-05"), ReactionType = "Haha" },
                    new Like { UserId = 2, PostId = 1, LikedAt = DateTime.Parse("2024-01-03"), ReactionType = "Love" },
                    new Like { UserId = 2, PostId = 2, LikedAt = DateTime.Parse("2024-01-04"), ReactionType = "Angry" },
                    new Like { UserId = 2, PostId = 4, LikedAt = DateTime.Parse("2024-01-05"), ReactionType = "Like" },
                    new Like { UserId = 2, PostId = 5, LikedAt = DateTime.Parse("2024-01-06"), ReactionType = "Sad" },
                    new Like { UserId = 3, PostId = 1, LikedAt = DateTime.Parse("2024-01-07"), ReactionType = "Wow" },
                    new Like { UserId = 3, PostId = 2, LikedAt = DateTime.Parse("2024-01-08"), ReactionType = "Love" },
                    new Like { UserId = 3, PostId = 3, LikedAt = DateTime.Parse("2024-01-09"), ReactionType = "Haha" },
                    new Like { UserId = 3, PostId = 4, LikedAt = DateTime.Parse("2024-01-10"), ReactionType = "Like" },
                    new Like { UserId = 4, PostId = 1, LikedAt = DateTime.Parse("2024-01-03"), ReactionType = "Love" },
                    new Like { UserId = 4, PostId = 3, LikedAt = DateTime.Parse("2024-01-04"), ReactionType = "Wow" },
                    new Like { UserId = 4, PostId = 5, LikedAt = DateTime.Parse("2024-01-06"), ReactionType = "Haha" },
                    new Like { UserId = 5, PostId = 2, LikedAt = DateTime.Parse("2024-01-07"), ReactionType = "Sad" },
                    new Like { UserId = 5, PostId = 4, LikedAt = DateTime.Parse("2024-01-08"), ReactionType = "Angry" },
                    new Like { UserId = 5, PostId = 5, LikedAt = DateTime.Parse("2024-01-09"), ReactionType = "Like" },
                    new Like { UserId = 5, PostId = 3, LikedAt = DateTime.Parse("2024-01-10"), ReactionType = "Love" },
                    new Like { UserId = 1, PostId = 1, LikedAt = DateTime.Parse("2024-01-11"), ReactionType = "Haha" }
                };
                context.Likes.AddRange(likeData);
                context.SaveChanges();
            }
        }
    }
}