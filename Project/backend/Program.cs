using backend.Context;
using backend.Repositories;
using backend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddDbContext<MasterContext>(options => options.UseSqlite("Data Source=social-media.db"));
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<LikeService>();
builder.Services.AddScoped<LikeRepository>();
builder.Services.AddScoped<PostService>();
builder.Services.AddScoped<PostRepository>();
// builder.Services.AddScoped<, >();
var app = builder.Build();
SampleData.Initialize(app.Services);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();
app.UseAuthorization(); 
app.UseCors();
app.MapControllers();
app.Run();