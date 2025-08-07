# FLY

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![C#](https://img.shields.io/badge/c%23-%23239120.svg?style=for-the-badge&logo=csharp&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![.Net](https://img.shields.io/badge/.NET-5C2D91?style=for-the-badge&logo=.net&logoColor=white) ![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Swagger](https://img.shields.io/badge/swagger-%2385EA2D.svg?style=for-the-badge&logo=swagger&logoColor=black) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

Feel Like Yourself (FLY) is a social media website that allows users to share posts, engage with content, and includes admin tools for moderation, supported by a structured backend and clear documentation.

## Screenshots from website

<a href="https://github.com/demjrhan/FLY" target="_blank">
    <img src="https://github.com/demjrhan/FLY/blob/main/Images/Welcome.png" alt="Welcome Page" width="1000"/>
</a>
<a href="https://github.com/demjrhan/FLY" target="_blank">
    <img src="https://github.com/demjrhan/FLY/blob/main/Images/AddPost.png" alt="Add Photo" width="1000"/>
</a>

<a href="https://github.com/demjrhan/FLY" target="_blank">
    <img src="https://github.com/demjrhan/FLY/blob/main/Images/Admin_Welcome.png" alt="Admin Welcome Page" width="1000"/>
</a>

## Vertabelo Table
<a href="https://github.com/demjrhan/FLY" target="_blank">
    <img src="https://github.com/demjrhan/FLY/blob/main/Images/FLY.png" alt="FLY VERTABELO PNG" width="1000"/>
</a>

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

