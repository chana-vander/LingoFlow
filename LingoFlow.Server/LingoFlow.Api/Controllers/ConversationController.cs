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
    public class ConversationController : ControllerBase
    {
        private readonly IConversationService _conversationService;
        private readonly IMapper _mapper;
        public ConversationController(IConversationService conversationService, IMapper mapper)
        {
            _conversationService = conversationService;
            _mapper = mapper;
        }
        // GET: api/<UserController>
        [HttpGet]
        public async Task<IEnumerable<ConversationDto>> Get()
        {
            var conversationDto = await _conversationService.GetAllConversationsAsync();
            var conversations = new List<ConversationDto>();
            foreach (var conversation in conversationDto)
            {
                conversations.Add(_mapper.Map<ConversationDto>(conversation));
            }
            return conversations;
        }

        // GET api/<ConversationController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(int id)
        {
            var conversation = await _conversationService.GetConversationByIdAsync(id);

            if (conversation == null)
            {
                return NotFound($"Conversation with ID {id} not found.");
            }

            return Ok(conversation);
        }

        // POST api/<ConversationController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ConversationDto conversation)
        {
            if (conversation == null)
            {
                return BadRequest("שיחה ריקה:(");
            }
            var addConversation = await _conversationService.AddConversationAsync(conversation);
            return Ok(addConversation);
        }
        //
        [HttpPost("upload")]
        public async Task<IActionResult> UploadAudio([FromForm] UploadAudioRequest request)
        {
            if (request.File == null || request.File.Length == 0)
                return BadRequest("No file uploaded.");

            try
            {
                var s3Url = await _conversationService.UploadToS3Async(
                    request.File.OpenReadStream(),
                    request.TopicName,
                    request.UserId
                );

                var newConversation = new ConversationDto
                {
                    UserId = request.UserId,
                    Date = DateTime.UtcNow,
                    Url = s3Url
                };

                var result = await _conversationService.AddConversationAsync(newConversation);
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
            var recordings = await _conversationService.GetRecordingsByUserIdAsync(userId);

            if (recordings == null || !recordings.Any())
            {
                return NotFound($"No recordings found for user ID {userId}");
            }

            return Ok(recordings);
        }



        //פונקציה להתחלת הקלטה
        // POST: api/conversations/start
        //[HttpPost("start")]
        //public async Task<IActionResult> StartRecording([FromBody] ConversationPostModel request)
        //{
        //    // קריאה לפונקציה בשירות
        //    var conversation = await _conversationService.StartRecordingAsync(request.UserId, request.TopicId);

        //    if (conversation != null)
        //        return Ok(new { message = "Recording started successfully", conversationId = conversation.Id });
        //    else
        //        return BadRequest(new { message = "Failed to start recording" });
        //}

        // PUT api/<ConversationController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<bool>> Put(int id, [FromBody] ConversationDto conversation)
        {

            if (conversation == null)
            {
                return BadRequest("Invalid conversation data.");
            }

            var updatedUser = await _conversationService.UpdateConversationAsync(id, conversation);
            if (updatedUser == null)
            {
                return NotFound($"conversation with ID {id} not found.");
            }

            return Ok(updatedUser);
        }

        // DELETE api/<ConversationController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            var result = await _conversationService.DeleteConversationAsync(id);
            if (!result)
            {
                return NotFound($"Topic with ID {id} not found.");
            }

            return Ok(true);
        }
    }
}
