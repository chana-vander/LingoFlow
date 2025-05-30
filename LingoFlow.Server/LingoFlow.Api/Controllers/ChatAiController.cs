using LingoFlow.Core.Models;
using LingoFlow.Core.Services;
using LingoFlow.Service;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace LingoFlow.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatAiController : ControllerBase
    {
        // GET: api/<ChatAiController>

        private readonly IChatService _chatService;

        public ChatAiController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ChatRequest request)
        {
            var response = await _chatService.AskLingoBot(request);
            return Ok(new { content = response });
        }
    }
}
