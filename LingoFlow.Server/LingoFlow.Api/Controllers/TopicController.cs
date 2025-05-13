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
    public class TopicController : ControllerBase
    {
        private readonly ITopicService _TopicService;
        private readonly IMapper _mapper;
        public TopicController(ITopicService TopicService, IMapper mapper)
        {
            _TopicService = TopicService;
            _mapper = mapper;
        }
        // GET: api/<UserController>
        [HttpGet]
        public async Task<IEnumerable<TopicDto>> Get()
        {
            var TopicDto = await _TopicService.GetAllTopicsAsync();
            var Topics = new List<TopicDto>();
            foreach (var Topic in TopicDto)
            {
                Topics.Add(_mapper.Map<TopicDto>(Topic));
            }
            return Topics;
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Feedback>> Get(int id)
        {
            var Topic = await _TopicService.GetTopicByIdAsync(id);
            //var wordDto = Mapping.
            if (Topic == null)
            {
                return NotFound($"Topic with ID {id} not found.");
            }

            return Ok(Topic);
        }

        // GET api/Topic/level/{level}
        [HttpGet("level/{level:int}")]
        public async Task<IActionResult> GetByLevel(int level)
        {
            var Topics = await _TopicService.GetTopicsByLevelAsync(level);
            if (Topics == null || !Topics.Any())
            {
                return NotFound($"No Topics found for level {level}");
            }

            return Ok(Topics);
        }

        // POST api/<TopicController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] TopicDto TopicDto)
        {
            if (TopicDto == null)
            {
                return BadRequest("Invalid Topic data.");
            }

            var createdTopic = await _TopicService.AddTopicAsync(TopicDto);
            if (createdTopic == null)
            {
                return StatusCode(500, "An error occurred while creating the Topic.");
            }

            return Ok(createdTopic);
        }
        //PUT
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] string TopicName)
        {
            if (TopicName == null)
            {
                return BadRequest("Invalid Topic data.");
            }

            var updatedTopic = await _TopicService.UpdateTopicAsync(id, TopicName);
            if (updatedTopic == null)
            {
                return NotFound($"Topic with ID {id} not found.");
            }

            return Ok(updatedTopic);
        }

        //DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _TopicService.DeleteTopicAsync(id);
            if (!result)
            {
                return NotFound($"Topic with ID {id} not found.");
            }

            return Ok(true);
        }
    }
}
