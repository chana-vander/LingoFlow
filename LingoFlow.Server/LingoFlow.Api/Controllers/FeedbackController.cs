using AutoMapper;
using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
using LingoFlow.Core.Services;
using LingoFlow.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace LingoFlow.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;
        private readonly IMapper _mapper;
        private readonly IFeedbackAnalysisService _feedbackAnalysis;
        public FeedbackController(IFeedbackService feedbackService, IMapper mapper, IFeedbackAnalysisService feedbackAnalysis)
        {
            _feedbackService = feedbackService;
            _mapper = mapper;
            _feedbackAnalysis = feedbackAnalysis;

        }
        //analysis feedback
        [HttpPost("analyze")]
        public async Task<ActionResult<FeedbackDto>> Analyze([FromBody] AnalyzeRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Transcription))
                return BadRequest("Transcription is required.");

            Feedback feedback = await _feedbackAnalysis.AnalyzeAsync(request.Transcription, request.TopicId, request.ConversationId);
            FeedbackDto feedbackDto = _mapper.Map<FeedbackDto>(feedback);
            var addedFeedback = await _feedbackService.AddFeedbackAsync(feedbackDto);

            return Ok(addedFeedback);
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
                return NotFound($"Feedback with ID {id} not found.");
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
                return NotFound($"Feedback with ID {id} not found.");
            }

            return Ok(true);
        }
        //לפי מזהה הקלטה
        [HttpGet("record/{recordId}")]
        public async Task<IActionResult> GetFeedbackByRecordId(int recordId)
        {
            var feedback= await _feedbackService.GetFeedbackByRecordIdAsync(recordId);
            if (feedback == null)
            {
                return NotFound($"No feedback found for record ID {recordId}");
            }

            return Ok(feedback);
        }

    }
}
