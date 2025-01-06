# TIN_PRO
TIN Winter Semester 2024

<p align="center">
    <img src="https://github.com/demjrhan/TIN_PRO/blob/main/TIN_PROJECT.png" alt="TIN PROJECT VERTABELO GIF" width="500"/>
</p>

## 🔑 Authentication Details
Admin Login:  
- Nickname: a  
- Password: b  
Normal User Login:  
- Nickname: b  
- Password: b  
## 📋 Features and Queries
### Users
-- View all registered users and their information  
SELECT * FROM Users;  
### Posts
-- View all posts and their associated information  
SELECT * FROM Posts;  
### Likes
-- View all likes, including who sent them  
SELECT * FROM Likes;  

### Pagination
Pagination is available in the Admin Panel. Click on the top of post likes to see detailed engagement information.  

## 📂 Database Details
### Sample Data
Located in backend/Context/SampleData.cs  

### Database Creation Script
Defined in MasterContext.cs  

### Models
- Models/User.cs  
- Models/Post.cs  
- Models/Like.cs
- 
### Table Connections
- Data/UserConfiguration.cs
- Data/PostConfiguration.cs
- Data/LikeConfiguration.cs


## 🚀 Build and Run Instructions

### Backend
# Navigate to the backend directory  
cd TIN_PRO/Project/backend  
# Restore dependencies  
dotnet restore  
# Build the project  
dotnet build  
# Apply database migrations  
dotnet ef migrations add InitialCreate  
dotnet ef database update  
# Run the application  
dotnet run  

### Frontend
# Navigate to the frontend directory  
cd TIN_PRO/Project/frontend  
# Install dependencies  
npm install  
# Start the application  
npm start  


### Repository Description
#### Admin Functionalities:
- **Warn Users:**  
  - Admins can warn users if their post contains illegal or inappropriate content.  
  - Warning a user results in the deletion of the flagged post from the website.  
  - Users receiving 3 warnings will be permanently banned.  
  - Warned users will see a notification each time they log into the website.  

- **Ban Users:**  
  - Banned users cannot log into the website.  
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
    - Regular users’ nicknames will appear in **blue**.  
    - Admins’ nicknames will appear in **red**.  
  - Posts will support various reaction types, and a **like count** will indicate the total number of reactions received.  
  - Each post can include a **description** provided by the user, offering additional context or details about the content.  

- **Editing & Deleting:**  
  - Posts can be edited or deleted by their author or an admin.  
