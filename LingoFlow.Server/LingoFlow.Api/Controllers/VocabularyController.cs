using AutoMapper;
using LingoFlow.Core;
using LingoFlow.Core.Dto;
using LingoFlow.Core.Models;
using LingoFlow.Core.Services;
using Microsoft.AspNetCore.Mvc;
namespace LingoFlow.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VocabularyController : ControllerBase
    {
        private readonly IVocabularyService _wordService;
        private readonly IMapper _mapper;
        public VocabularyController(IVocabularyService wordService, IMapper mapper)
        {
            _wordService = wordService;
            _mapper = mapper;
        }
        // GET: api/<UserController>
        [HttpGet]
        public async Task<IEnumerable<VocabularyDto>> Get()
        {
            var wordsDto = await _wordService.GetAllWordsAsync();
            var words = new List<VocabularyDto>();
            foreach (var word in wordsDto)
            {
                words.Add(_mapper.Map<VocabularyDto>(word));
            }
            return words;
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Vocabulary>> Get(int id)
        {
            var word = await _wordService.GetWordByIdAsync(id);
            var wordDto = Mapping.MapToWordDto(word);
            if (wordDto == null)
            {
                return NotFound($"Word with ID {id} not found.");
            }

            return Ok(wordDto);
        }
        //Get byTopicId
        [HttpGet("Topic/{TopicId:int}")]
        public async Task<IActionResult> GetByTopicId(int TopicId)
        {
            var words = await _wordService.GetWordsByTopicIdAsync(TopicId);

            if (words == null || !words.Any())
            {
                return NotFound($"No words found for Topic ID {TopicId}.");
            }

            return Ok(words);
        }

        //POST
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] VocabularyDto wordDto)
        {
            if (wordDto == null)
                return BadRequest("Invalid word data.");

            var createdWord = await _wordService.AddWordAsync(wordDto);
            if (createdWord == null)
                return StatusCode(500, "An error occurred while creating the word.");

            return Ok(createdWord);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] VocabularyDto wordDto)
        {
            if (wordDto == null)
                return BadRequest("Invalid word data.");

            var updatedWord = await _wordService.UpdateWordAsync(id, wordDto);
            if (updatedWord == null)
                return NotFound($"Word with ID {id} not found.");

            return Ok(updatedWord);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _wordService.DeleteWordAsync(id);
            if (!result)
                return NotFound($"Word with ID {id} not found.");

            return Ok(true);
        }
    }
}
