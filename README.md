# FLY
Feel Like Yourself (FLY) is a social media website that allows users to share posts, engage with content, and includes admin tools for moderation, supported by a structured backend and clear documentation.

## Screenshots from website

<p align="center">
    <img src="https://github.com/demjrhan/FLY/blob/main/Images/Welcome.png" alt="Welcome Page" width="500"/>
</p>
<p align="center">
    <img src="https://github.com/demjrhan/FLY/blob/main/Images/AddPost.png" alt="Add Photo" width="500"/>
</p>

<p align="center">
    <img src="https://github.com/demjrhan/FLY/blob/main/Images/Admin_Welcome.png" alt="Admin Welcome Page" width="500"/>
</p>

## Vertabelo Table
<p align="center">
    <img src="https://github.com/demjrhan/FLY/blob/main/Images/FLY.png" alt="FLY VERTABELO PNG" width="500"/>
</p>

##  Authentication Details
Admin Login: Nickname: `a`, Password: `a`  
Normal User Login: Nickname: `b`, Password: `b`
  
##  Database Details
Sample Data: `backend/Context/SampleData.cs`  
Database Script: `MasterContext.cs`  
Models: `Models/User.cs`, `Models/Post.cs`, `Models/Like.cs`  
Configurations: `Data/UserConfiguration.cs`, `Data/PostConfiguration.cs`, `Data/LikeConfiguration.cs`


## Build and Run Instructions

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

