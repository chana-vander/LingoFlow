using AutoMapper;
using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
using LingoFlow.Core.Services;
using LingoFlow.Service;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace LingoFlow.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;
        private readonly IMapper _mapper;
        public FeedbackController(IFeedbackService feedbackService, IMapper mapper)
        {
            _feedbackService = feedbackService;
            _mapper = mapper;
        }
        // GET: api/<UserController>
        [HttpGet]
        public async Task<IEnumerable<FeedbackDto>> Get()
        {
            var feedbackDto = await _feedbackService.GetAllFeedbacksAsync();
            var feedbacks = new List<FeedbackDto>();
            foreach (var feedback in feedbackDto)
            {
                feedbacks.Add(_mapper.Map<FeedbackDto>(feedback));
            }
            return feedbacks;
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Feedback>> Get(int id)
        {
            var feedback = await _feedbackService.GetFeedbackByIdAsync(id);

            if (feedback == null)
            {
                return NotFound($"Feedback with ID {id} not found.");
            }

            return Ok(feedback);
        }

        // POST api/<FeedbackController>
        [HttpPost]
        public async Task<ActionResult<FeedbackDto>> Post([FromBody] FeedbackDto feedback)
        {
            if (feedback == null)
            {
                return BadRequest("Invalid feedback data.");
            }

            var createdFeedback = await _feedbackService.AddFeedbackAsync(feedback);
            if (createdFeedback == null)
            {
                return StatusCode(500, "An error occurred while creating the feedback.");
            }

            return Ok(createdFeedback);
        }

        // PUT api/<FeedbackController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<bool>> Put(int id, [FromBody] FeedbackDto feedback)
        {
            if (feedback == null)
            {
                return BadRequest("Invalid feedback data.");
            }

            var updatedTopic = await _feedbackService.UpdateFeedbackAsync(id, feedback);
            if (updatedTopic == null)
            {
                return NotFound($"Topic with ID {id} not found.");
            }

            return Ok(updatedTopic);
        }

        // DELETE api/<FeedbackController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {

            var result = await _feedbackService.DeleteFeedbackAsync(id);
            if (!result)
            {
                return NotFound($"Topic with ID {id} not found.");
            }

            return Ok(true);
        }
    }
}
