using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.Text;
using LingoFlow.Core.Services;
using LingoFlow.Service;
using LingoFlow.Core.Repositories;
using LingoFlow.Data.Repositories;
using LingoFlow.Data;
using LingoFlow.Core.Models;
using LingoFlow.Core;
using AutoMapper;
using DotNetEnv;
using Amazon.S3;
using Amazon;
using Microsoft.OpenApi.Models;
using Amazon.Runtime;
using Microsoft.Extensions.DependencyInjection;
using DotEnv;
using System;
using Microsoft.AspNetCore.Identity;
using MySqlConnector;

// טוען את משתני הסביבה מקובץ .env
Env.Load();
Console.WriteLine("Loaded .env file...");
Console.WriteLine("Bucket: " + Env.GetString("AWS__BucketName"));
Console.WriteLine("Bucket: " + Env.GetString("JWT__Secret"));

//Env.Load("C:\\שנה ב תכנות\\LingoFlow\\LingoFlow.Server\\LingoFlow.Api\\env.env");
var builder = WebApplication.CreateBuilder(args);
//שליפת נתונים מקובץ סביבה
builder.Configuration["AWS:BucketName"] = Env.GetString("AWS__BucketName");
builder.Configuration["AWS:Region"] = Env.GetString("AWS__Region");
builder.Configuration["AWS:AccessKey"] = Env.GetString("AWS__AccessKey");
builder.Configuration["AWS:SecretKey"] = Env.GetString("AWS__SecretKey");
builder.Configuration["OpenAI:ApiKey"] = Env.GetString("OpenAI__ApiKey");
builder.Configuration["OpenAI:GptKey"] = Env.GetString("OpenAi__GptKey");
builder.Configuration["Connection:String"] = Env.GetString("Connection__String");
Console.WriteLine("AI GPT:  " + Env.GetString("OpenAI__GptKey"));
Console.WriteLine("bucket name: " + Env.GetString("AWS__BucketName"));
Console.WriteLine("connection string: " + Env.GetString("Connection__String"));
// הוספת CORS עם הרשאה לכל המקורות
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
//builder.Services.AddDbContext<DataContext>();



//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowSpecificOrigin",
//        builder => builder.WithOrigins(
//                "http://localhost:5173",
//                "https://my-react-project-6w5y.onrender.com"
//            )
//            .AllowAnyMethod()
//            .AllowAnyHeader()
//            .AllowCredentials());
//});


// רישום שירותים ל-DI
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IrecordingService, recordingService>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();
builder.Services.AddScoped<ITopicService, TopicService>();
builder.Services.AddScoped<IVocabularyService, VocabularyService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IFeedbackAnalysisService, FeedbackAnalysisService>();


builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IrecordingRepository, recordingRepository>();
builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>();
builder.Services.AddScoped<ITopicRepository, TopicRepository>();
builder.Services.AddScoped<IVocabularyRepository, VocabularyRepository>();
builder.Services.AddScoped<IManagerRepository, ManagerRepository>();
builder.Services.AddScoped<IChatService, ChatService>();

// הוספת בקרי API
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "LingoFlow API", Version = "v1" });

    // ?? מוסיפים תמיכה בטפסים
    c.SupportNonNullableReferenceTypes();

    // ?? מוסיפים את זה כדי שSwagger ידע להתמודד עם קבצים
    c.MapType<IFormFile>(() => new OpenApiSchema
    {
        Type = "string",
        Format = "binary"
    });
});

// הגדרת AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Services.AddAWSService<IAmazonS3>();
//תמיכה בHTTP
builder.Services.AddHttpClient();

var connectionString = Env.GetString("Connection__string");

////בדיקת חיבור לדטה בייס
//using var connection = new MySqlConnection(connectionString);
//connection.Open();
//Console.WriteLine("Connected successfully!");


// הוספת קונפיגורציה של RegionEndpoint
builder.Services.AddSingleton<AmazonS3Client>(serviceProvider =>
{
    //var region = Environment.GetEnvironmentVariable("AWS__Region");
    //var accessKey = Environment.GetEnvironmentVariable("AWS__AccessKey");
    //var secretKey = Environment.GetEnvironmentVariable("AWS__SecretKey");
    var region = Env.GetString("AWS__Region");
    var accessKey = Env.GetString("AWS__AccessKey");
    var secretKey = Env.GetString("AWS__SecretKey");
    Console.WriteLine(connectionString);

    if (string.IsNullOrEmpty(region) || string.IsNullOrEmpty(accessKey) || string.IsNullOrEmpty(secretKey))
    {
        Console.WriteLine("null");
        //throw new InvalidOperationException("AWS credentials or region are missing.");
    }
    Console.WriteLine($"AWS AccessKey: {accessKey}");
    Console.WriteLine($"AWS SecretKey: {secretKey}");
    Console.WriteLine($"AWS Region: {region}");

    return new AmazonS3Client(
        new BasicAWSCredentials(accessKey, secretKey),
        new AmazonS3Config
        {
            RegionEndpoint = RegionEndpoint.GetBySystemName(region)  // הגדרת האזור כאן
        });
});
//connect to mysql
builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 36)))
);


// הגדרת JWT Authentication

//var jwtSecret = Environment.GetEnvironmentVariable("JWT__Sercret");
var jwtSecret = Env.GetString("JWT__Secret");
Console.WriteLine("jwtSecret: "+ jwtSecret);
if (string.IsNullOrEmpty(jwtSecret))
{
    throw new InvalidOperationException("JWT secret is missing from configuration.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = Environment.GetEnvironmentVariable("JWT__Issuer"),
            ValidAudience = Environment.GetEnvironmentVariable("JWT__Audience"),
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

// הרשאות מבוסס-תפקידים
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin")); // למנהלים בלבד
    options.AddPolicy("UserOnly", policy => policy.RequireRole("User")); // למשתמשים בלבד
    options.AddPolicy("AdminOrUser", policy => policy.RequireRole("Admin", "User")); // לשני התפקידים
});

// יצירת אפליקציה
var app = builder.Build();

// הפעלת Swagger רק בסביבת פיתוח
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}

//app.MapGet("/", () => Results.Redirect("/swagger"));
app.MapGet("/", () => Results.Ok("Welcome to LingoFlow API!"));

// סדר נכון של ה-Middleware
app.UseHttpsRedirection();
app.UseCors("AllowAllOrigins");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

// === פונקציית Seeding של Roleים ===
async Task SeedRolesAsync(IServiceProvider serviceProvider)
{
    var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    string[] roleNames = { "user", "admin" };

    foreach (var roleName in roleNames)
    {
        var roleExists = await roleManager.RoleExistsAsync(roleName);
        if (!roleExists)
        {
            await roleManager.CreateAsync(new IdentityRole(roleName));
        }
    }
}