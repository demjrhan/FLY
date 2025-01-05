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
                    new User
                    {
                        Name = "John", Surname = "Doe", BirthDate = DateTime.Parse("1985-07-15"),
                        Email = "john.doe@example.com", Password = "Password123!", CreatedAt = DateTime.Now,
                        WarnCount = 0, isBanned = false, Nickname = "JohnDoe", isAdmin = false
                    },
                    new User
                    {
                        Name = "Jane", Surname = "Smith", BirthDate = DateTime.Parse("1990-03-22"),
                        Email = "jane.smith@example.com", Password = "SecurePass1@", CreatedAt = DateTime.Now,
                        WarnCount = 0, isBanned = false, Nickname = "JaneSmith", isAdmin = false
                    },
                    new User
                    {
                        Name = "Alice", Surname = "Johnson", BirthDate = DateTime.Parse("1978-11-05"),
                        Email = "alice.johnson@example.com", Password = "MyP@ssword2", CreatedAt = DateTime.Now,
                        WarnCount = 0, isBanned = false, Nickname = "AliceJohnson", isAdmin = false
                    },
                    new User
                    {
                        Name = "Bob", Surname = "Ros", BirthDate = DateTime.Parse("2000-12-25"),
                        Email = "bob.ros@example.com", Password = "Pass2024#", CreatedAt = DateTime.Now, WarnCount = 0,
                        isBanned = false, Nickname = "BobRos", isAdmin = false
                    },
                    new User
                    {
                        Name = "Charlie", Surname = "Davis", BirthDate = DateTime.Parse("1995-05-16"),
                        Email = "charlie.davis@example.com", Password = "Hello123!", CreatedAt = DateTime.Now,
                        WarnCount = 0, isBanned = false, Nickname = "CharlieDavis", isAdmin = false
                    },
                    new User
                    {
                        Name = "Emily", Surname = "Wilson", BirthDate = DateTime.Parse("1983-09-09"),
                        Email = "emily.wilson@example.com", Password = "Qwerty1$", CreatedAt = DateTime.Now,
                        WarnCount = 0, isBanned = false, Nickname = "EmilyWilson", isAdmin = false
                    },
                    new User
                    {
                        Name = "David", Surname = "Garcia", BirthDate = DateTime.Parse("1988-04-18"),
                        Email = "david.garcia@example.com", Password = "Wqea1@2024", CreatedAt = DateTime.Now,
                        WarnCount = 0, isBanned = false, Nickname = "DavidGarcia", isAdmin = false
                    },
                    new User
                    {
                        Name = "Sophia", Surname = "Martinez", BirthDate = DateTime.Parse("1999-08-13"),
                        Email = "sophia.martinez@example.com", Password = "Password2#", CreatedAt = DateTime.Now,
                        WarnCount = 3, isBanned = true, Nickname = "SophiaMartinez", isAdmin = false
                    },
                    new User
                    {
                        Name = "Daniel", Surname = "Clark", BirthDate = DateTime.Parse("1992-06-30"),
                        Email = "daniel.clark@example.com", Password = "123Secure@", CreatedAt = DateTime.Now,
                        WarnCount = 0, isBanned = false, Nickname = "DanielClark", isAdmin = false
                    },
                    new User
                    {
                        Name = "Emma", Surname = "Harris", BirthDate = DateTime.Parse("1975-10-10"),
                        Email = "emma.harris@example.com", Password = "Pass987#", CreatedAt = DateTime.Now,
                        WarnCount = 0, isBanned = false, Nickname = "EmmaHarris", isAdmin = false
                    },
                    new User
                    {
                        Name = "Demirhan", Surname = "Yalcin", BirthDate = DateTime.Parse("2003-08-30"),
                        Email = "demirhanylcn@gmail.com", Password = "a", CreatedAt = DateTime.Now,
                        WarnCount = 0, isBanned = false, Nickname = "a", isAdmin = true
                    },
                    new User
                    {
                        Name = "Demirhan", Surname = "Yalcin", BirthDate = DateTime.Parse("2003-08-30"),
                        Email = "demirhanylcn@gmail.com", Password = "b", CreatedAt = DateTime.Now,
                        WarnCount = 0, isBanned = false, Nickname = "b", isAdmin = false
                    }
                };
                context.Users.AddRange(userData);
                context.SaveChanges();
            }

            if (!context.Posts.Any())
            {
                var postData = new List<Post>();

                for (int userId = 1; userId <= 12; userId++)
                {
                    for (int i = 0; i < 2; i++)
                    {
                        postData.Add(new Post
                        {
                            UserId = userId,
                            Description = "We are testing this app!",
                            CreatedAt = DateTime.UtcNow.AddDays(-i),
                            ImageUrl = "/images/photos/sample_photo.png"
                        });
                    }
                }

                context.Posts.AddRange(postData);
                context.SaveChanges();
            }

            
        }
    }
}