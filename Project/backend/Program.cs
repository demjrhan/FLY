using backend.Context;
using backend.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();


builder.Services.AddDbContext<MasterContext>(options => options.UseSqlite("Data Source=social-media.db"));
// builder.Services.AddScoped<, >();
// builder.Services.AddScoped<, >();
builder.Services.AddAuthorization();
var app = builder.Build();
SampleData.Initialize(app.Services);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();
app.UseAuthorization(); 
app.MapControllers();
app.Run();