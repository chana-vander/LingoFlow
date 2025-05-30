using LingoFlow.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Services
{
    public interface IFeedbackAnalysisService
    {
        public Task<Feedback> AnalyzeAsync(string transcription, int topicId, int recordingId);
        //public string BuildPrompt(string transcription, string wordList);
        //public Task<(string FluencyComment, string GrammarComment, string GeneralFeedback, int Score)> SendToGPT(string prompt);
    }
}
