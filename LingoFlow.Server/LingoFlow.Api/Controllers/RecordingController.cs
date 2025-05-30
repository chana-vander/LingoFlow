using AutoMapper;
using LingoFlow.Api.Models;
using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
using LingoFlow.Core.Services;
using LingoFlow.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Numerics;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace LingoFlow.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class recordingController : ControllerBase
    {
        private readonly IrecordingService _recordingService;
        private readonly IMapper _mapper;
        public recordingController(IrecordingService recordingService, IMapper mapper)
        {
            _recordingService = recordingService;
            _mapper = mapper;
        }
        // GET: api/<UserController>
        [HttpGet]
        public async Task<IEnumerable<recordingDto>> Get()
        {
            var recordingDto = await _recordingService.GetAllrecordingsAsync();
            var recordings = new List<recordingDto>();
            foreach (var recording in recordingDto)
            {
                recordings.Add(_mapper.Map<recordingDto>(recording));
            }
            return recordings;
        }

        // GET api/<recordingController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(int id)
        {
            var recording = await _recordingService.GetrecordingByIdAsync(id);

            if (recording == null)
            {
                return NotFound($"recording with ID {id} not found.");
            }

            return Ok(recording);
        }

        // POST api/<recordingController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] recordingDto recording)
        {
            if (recording == null)
            {
                return BadRequest("שיחה ריקה:(");
            }
            var addrecording = await _recordingService.AddrecordingAsync(recording);
            return Ok(addrecording);
        }
        //
        [HttpPost("upload")]
        public async Task<IActionResult> UploadAudio([FromForm] UploadAudioRequest request)
        {
            if (request.File == null || request.File.Length == 0)
                return BadRequest("No file uploaded.");

            try
            {
                var s3Url = await _recordingService.UploadToS3Async(
                    request.File.OpenReadStream(),
                    request.TopicName,
                    request.UserId
                );

                var newrecording = new recordingDto
                {
                    UserId = request.UserId,
                    Date = DateTime.UtcNow,
                    Url = s3Url
                };

                var result = await _recordingService.AddrecordingAsync(newrecording);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error uploading file: {ex.Message}");
            }
        }
        //שליפת הקלטות לפי מזהה משתמש
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetRecordingsByUserId(int userId)
        {
            var recordings = await _recordingService.GetRecordingsByUserIdAsync(userId);

            if (recordings == null || !recordings.Any())
            {
                return NotFound($"No recordings found for user ID {userId}");
            }

            return Ok(recordings);
        }



        //פונקציה להתחלת הקלטה
        // POST: api/recordings/start
        //[HttpPost("start")]
        //public async Task<IActionResult> StartRecording([FromBody] recordingPostModel request)
        //{
        //    // קריאה לפונקציה בשירות
        //    var recording = await _recordingService.StartRecordingAsync(request.UserId, request.TopicId);

        //    if (recording != null)
        //        return Ok(new { message = "Recording started successfully", recordingId = recording.Id });
        //    else
        //        return BadRequest(new { message = "Failed to start recording" });
        //}

        // PUT api/<recordingController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<bool>> Put(int id, [FromBody] recordingDto recording)
        {

            if (recording == null)
            {
                return BadRequest("Invalid recording data.");
            }

            var updatedUser = await _recordingService.UpdaterecordingAsync(id, recording);
            if (updatedUser == null)
            {
                return NotFound($"recording with ID {id} not found.");
            }

            return Ok(updatedUser);
        }

        // DELETE api/<recordingController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            var result = await _recordingService.DeleterecordingAsync(id);
            if (!result)
            {
                return NotFound($"Topic with ID {id} not found.");
            }

            return Ok(true);
        }
    }
}
