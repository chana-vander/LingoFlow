using AutoMapper;
using LingoFlow.Api.Models;
using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
using LingoFlow.Core.Services;
using LingoFlow.Service;
using Microsoft.AspNetCore.Mvc;
using System.Numerics;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace LingoFlow.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        public UserController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }
        // GET: api/<UserController>
        [HttpGet]
        //[Route("api/users")]
        public async Task<IEnumerable<UserLoginDto>> Get()
        {

            var userDto = await _userService.GetAllUsersAsync();
            var users = new List<UserLoginDto>();
            foreach (var user in userDto)
            {
                users.Add(_mapper.Map<UserLoginDto>(user));
            }
            //var userDtos = _mapper.Map<List<UserLoginDto>>(users);
            return users;
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserLoginDto>> Get(int id)
        {
            var userDto = await _userService.GetUserByIdAsync(id);
            //var users = Mapping.MapToUsetDto<userDto
            //if (user == null)
            //{
            //    return NotFound($"User with ID {id} not found.");
            //}

            return Ok(userDto);
        }




        //public async Task<ActionResult> Post(DoctorPostModel d)
        //{
        //    var dToPost = new Doctor { Doctor_name = d.Doctor_name, occupation = d.occupation, phone = d.phone };
        //    Doctor doctor = await _doctorsService.AddAsync(dToPost);
        //    return Ok(doctor);
        //    //_doctorsService.SaveChanges();
        //}
        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] UserRegisterDto user)
        {
            if (user == null)
            {
                return BadRequest("Invalid Topic data.");
            }

            var updatedUser = await _userService.UpdateUserAsync(id, user);
            if (updatedUser == null)
            {
                return NotFound($"Topic with ID {id} not found.");
            }

            return Ok(updatedUser);
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _userService.DeleteUserAsync(id);
            if (!result)
            {
                return NotFound($"Topic with ID {id} not found.");
            }

            return Ok(true);
        }
    }
}

//using AutoMapper;
//using LingoFlow.Core.Dto;
//using LingoFlow.Core.Models;
//using LingoFlow.Core.Services;
//using Microsoft.AspNetCore.Mvc;
//using System.Collections.Generic;
//using System.Threading.Tasks;

//namespace LingoFlow.Api.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class UserController : ControllerBase
//    {
//        private readonly IUserService _userService;
//        private readonly IMapper _mapper;

//        public UserController(IUserService userService, IMapper mapper)
//        {
//            _userService = userService;
//            _mapper = mapper;
//        }

//        // GET: api/User
//        [HttpGet]
//        public async Task<ActionResult<IEnumerable<UserLoginDto>>> GetAllUsers()
//        {
//            var users = await _userService.GetAllUsersAsync();
//            if (users == null)
//            {
//                return NotFound("No users found.");
//            }

//            return Ok(_mapper.Map<List<UserLoginDto>>(users));
//        }

//        // GET api/User/{id}
//        [HttpGet("{id}")]
//        public async Task<ActionResult<UserLoginDto>> GetUserById(int id)
//        {
//            var user = await _userService.GetUserByIdAsync(id);
//            if (user == null)
//            {
//                return NotFound($"User with ID {id} not found.");
//            }

//            return Ok(_mapper.Map<UserLoginDto>(user));
//        }

//        // POST api/User
//        [HttpPost]
//        public async Task<IActionResult> AddUser([FromBody] UserRegisterDto userDto)
//        {
//            if (userDto == null)
//            {
//                return BadRequest("Invalid user data.");
//            }

//            var user = _mapper.Map<User>(userDto);
//            var addedUser = await _userService.AddUserAsync(user);

//            return CreatedAtAction(nameof(GetUserById), new { id = addedUser.Id }, _mapper.Map<UserLoginDto>(addedUser));
//        }

//        // PUT api/User/{id}
//        [HttpPut("{id}")]
//        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserRegisterDto userDto)
//        {
//            if (userDto == null)
//            {
//                return BadRequest("Invalid user data.");
//            }

//            var user = _mapper.Map<User>(userDto);
//            var isUpdated = await _userService.UpdateUserAsync(id, user);

//            if (!isUpdated)
//            {
//                return NotFound($"User with ID {id} not found.");
//            }

//            return NoContent();
//        }

//        // DELETE api/User/{id}
//        [HttpDelete("{id}")]
//        public async Task<ActionResult<bool>> DeleteUser(int id)
//        {
//            var isDeleted = await _userService.DeleteUserAsync(id);

//            if (!isDeleted)
//            {
//                return NotFound($"User with ID {id} not found.");
//            }

//            return Ok(true);
//        }

//    }
//}

