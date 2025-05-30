//using AutoMapper;
//using LingoFlow.Api.Models;
//using LingoFlow.Core.Dto;
//using LingoFlow.Core.Repositories;
//using LingoFlow.Core.Services;
//using LingoFlow.Service;
//using Microsoft.AspNetCore.Mvc;

//[Route("api/[controller]")]
//[ApiController]
//public class AuthController : ControllerBase
//{
//    private readonly IAuthService _authService;
//    private readonly IUserService _userService;
//    private readonly IMapper _mapper;


//    public AuthController(IAuthService authService, IUserService userService, IMapper mapper)
//    {
//        _authService = authService;
//        _userService = userService;
//        _mapper = mapper;
//    }


//    [HttpPost("login")]
//    public async Task<IActionResult> LoginAsync([FromBody] LoginModel model)
//    {
//        Console.WriteLine("auth1 ");
//        Console.WriteLine(model.Email+ " " + model.Password);
//        var roleName = await _userService.AuthenticateAsync(model.Email, model.Password);
//        Console.WriteLine("role name ",roleName);

//        var user = await _userService.GetUserByEmailAsync(model.Email);
//        Console.WriteLine("after user ",user);
//        if (roleName == "admin")
//        {
//            var token = _authService.GenerateJwtToken(model.Email, new[] { "admin" });
//            return Ok(new { Token = token, User = user });
//        }

//        else if (roleName == "user")
//        {
//            var token = _authService.GenerateJwtToken(model.Email, new[] { "user" });
//            Console.WriteLine("token: ",token);
//            return Ok(new { Token = token });
//        }

//        return Unauthorized();
//    }

//    [HttpPost("register")]
//    public async Task<IActionResult> RegisterAsync([FromBody] UserRegisterPostModel model)
//    {
//        if (model == null)
//        {
//            return Conflict("User is not valid");
//        }

//        var modelD = _mapper.Map<UserRegisterDto>(model);
//        var existingUser = await _userService.AddUserAsync(modelD);
//        if (existingUser == null)
//            return BadRequest("User could not be created.");

//        // Check if the role exists
//        int roleId = await _roleRpository.GetIdByRoleAsync(model.RoleName);
//        if (roleId == -1)
//        {
//            return BadRequest("Role not found.");
//        }

//        var userRole = await _userRoleService.AddAsync(model.RoleName, existingUser.Id);
//        if (userRole == null)
//            return BadRequest("Error assigning role to user.");

//        var token = _authService.GenerateJwtToken(model.Email, new[] { model.RoleName });
//        return Ok(new { Token = token });
//    }
//}

//public class LoginModel
//{
//    public string? Email { get; set; }
//    public string? Password { get; set; }
//}

//מוצשק:
using LingoFlow.Api.Models;
using LingoFlow.Core.Dto;
using LingoFlow.Core.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IUserService _userService;
    private readonly ITokenService _tokenService;

    public AuthController(IAuthService authService, IUserService userService, ITokenService tokenService)
    {
        _authService = authService;
        _userService = userService;
        _tokenService = tokenService;
    }

    //[HttpPost("login")]
    //public async Task<IActionResult> LoginAsync([FromBody] UserLoginDto model)
    //{
    //    var token = await _authService.AuthenticateAsync(model.Email, model.Password);
    //    Console.WriteLine("token: "+token);
    //    if (token == null)
    //    {
    //        return Unauthorized("Invalid credentials");
    //    }

    //    var user = await _userService.GetUserByEmailAsync(model.Email);
    //    return Ok(new { Token = token, User = user });
    //}
    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync([FromBody] UserLoginDto model)
    {
        Console.WriteLine(model.Email);
        Console.WriteLine(model);
        if (model == null)
        {
            return BadRequest("Invalid request");
        }

        Console.WriteLine($"Login attempt for: {model.Email}");
        Console.WriteLine(model.Name);
        var token = await _userService.AuthenticateAsync(model.Email, model.Password);
        if (token == null)
        {
            Console.WriteLine("Authentication failed");
            return Unauthorized("Invalid credentials");
        }

        UserLoginDto user = await _userService.GetUserByEmailAsync(model.Email);
        return Ok(new { Token = token, User = user });
    }


    //[HttpPost("register")]
    //public async Task<IActionResult> RegisterAsync([FromBody] UserRegisterDto model)
    //{
    //    var user = await _userService.AddUserAsync(model); // ? אין צורך ב-Mapper כאן!
    //    if (user == null)
    //    {
    //        //return BadRequest("User could not be created.");
    //        return BadRequest(new { message = "User with this email already exists." });
    //    }

    //    return Ok(new { Message = "User registered successfully" });
    //}
    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromBody] UserRegisterDto model)
    {
        var user = await _userService.AddUserAsync(model);
        if (user == null)
        {
            return BadRequest(new { message = "User with this email already exists." });
        }

        // יצירת טוקן מייד לאחר ההרשמה
        var token = _tokenService.GenerateJwtToken(user.Email, "user");

        return Ok(new { Message = "User registered successfully", Token = token, User = user });
    }

}
