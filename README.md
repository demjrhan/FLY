# FLY
Feel Like Yourself

## Screenshots from website

<p align="center">
    <img src="https://github.com/demjrhan/FLY/blob/main/Images/Welcome.png" alt="Welcome Page" width="500"/>
</p>
<p align="center">
    <img src="https://github.com/demjrhan/FLY/blob/main/Images/AddPost.png" alt="Add Photo" width="500"/>
</p>

## Vertabelo Table
<p align="center">
    <img src="https://github.com/demjrhan/FLY/blob/main/Images/FLY.png" alt="FLY VERTABELO PNG" width="500"/>
</p>

## 🔑 Authentication Details
Admin Login: Nickname: `a`, Password: `b`  
Normal User Login: Nickname: `b`, Password: `b`
  
## 📋 Features and Queries
- **Users**: `SELECT * FROM Users;`  
- **Posts**: `SELECT * FROM Posts;`  
- **Likes**: `SELECT * FROM Likes;`  
- **Pagination**: Available in the Admin Panel. Click on the top of post likes to see details.

## 📂 Database Details
Sample Data: `backend/Context/SampleData.cs`  
Database Script: `MasterContext.cs`  
Models: `Models/User.cs`, `Models/Post.cs`, `Models/Like.cs`  
Configurations: `Data/UserConfiguration.cs`, `Data/PostConfiguration.cs`, `Data/LikeConfiguration.cs`


## 🚀 Build and Run Instructions

## Navigate to the backend directory  
- cd FLY/Project/backend
- mkdir Migrations
- dotnet restore  
- dotnet build  
- dotnet ef migrations add InitialCreate  
- dotnet ef database update  
- dotnet run  

## Navigate to the frontend directory  
- cd FLY/Project/frontend   
- npm install    
- npm start  


### Repository Description
#### Admin Functionalities:
- **Warn Users:**  
  - Admins can warn users if their post contains illegal or inappropriate content.  
  - Warning a user results in the deletion of the flagged post from the website.  
  - Users receiving 3 warnings will be permanently banned.  
  - Warned users will see a notification each time they log into the website.  

- **Ban Users:**  
  - Banned users cannot create post.  
  - All posts by banned users will be removed from the platform.  

#### Guest Functionalities:
- **View Posts:**  
  - Guests can browse posts shared on the website.  

#### User Functionalities:
- **Create Posts:**  
  - Users can upload photos as posts.  

- **Engage with Posts:**  
  - Users can view posts shared by others.  
  - Users can react to their own or others' posts.  

#### Post Details:
- **Posting Permissions:**  
  - Only admins and registered users can create posts.  

- **Post Attributes:**  
  - Each post will display the creator's nickname in the format "@example".  
  - Posts will support various reaction types, and a **like count** will indicate the total number of reactions received.  
  - Each post can include a **description** provided by the user, offering additional context or details about the content.  

- **Editing & Deleting:**  
  - Posts can be edited or deleted by their author or an admin.  
