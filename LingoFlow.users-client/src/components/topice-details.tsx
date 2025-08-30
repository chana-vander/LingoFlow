//topice-details.tsx
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  IconButton,
  Grid,
  Divider,
  CircularProgress,
  styled,
} from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import StopIcon from "@mui/icons-material/Stop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useTheme } from "@mui/material/styles";
import "../style/details.css";
import Word from "../models/word";
import config from "../config";

// עיצוב הכרטיסים
const WordCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#f9f9f9" : "#303030",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  transition: "transform 0.2s ease-in-out, boxShadow 0.2s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: theme.shadows[3],
  },
}));

const WordContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const WordText = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.primary.main,
}));

const TranslationText = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: "bold",
  textAlign: "right",
}));

const SentenceContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "expanded",
})<{ expanded: boolean }>(({ theme, expanded }) => ({
  marginTop: theme.spacing(1),
  maxHeight: expanded ? "200px" : "0",
  overflow: "hidden",
  transition: "max-height 0.3s ease-in-out, padding 0.3s ease-in-out",
  padding: expanded ? theme.spacing(1, 0) : theme.spacing(0),
  color: theme.palette.secondary.light,
}));

const WordNumber = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginRight: theme.spacing(1),
}));

const Details = () => {
  const { id } = useParams<{ id: string }>();
  const [words, setWords] = useState<Word[]>([]);
  const [topicName, setTopicName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [speech, setSpeech] = useState<SpeechSynthesisUtterance | null>(null);
  const [paused, setPaused] = useState<boolean>(false);
  const [expandedWordId, setExpandedWordId] = useState<number | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState<boolean>(false); // New state to track voice loading
  const { apiUrl } = config;
  const theme = useTheme();

  console.log(topicName);
  
  // --- Data Fetching UseEffects ---
  useEffect(() => {
    if (!id) return; // Prevent fetch if ID is not available

    fetch(`${apiUrl}/Vocabulary/Topic/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Word[]) => {
        // Add type annotation for data
        console.log("Fetched words:", data);
        setWords(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching words:", error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!id) return; // Prevent fetch if ID is not available

    fetch(`${apiUrl}/Topic/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setTopicName(data.name))
      .catch((error) => console.error("Error fetching topic name: ", error));
  }, [id]);

  console.log("Current words state:", words); // Moved console.log here for better insight

  // --- Speech Synthesis Logic ---

  // Function to stop audio (memoized with useCallback)
  const stopAudio = useCallback(() => {
    if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
      window.speechSynthesis.cancel();
    }
    setSpeech(null);
    setPaused(false);
  }, []); // No dependencies as it operates on window.speechSynthesis directly and resets local states

  // Function to pause audio (memoized with useCallback)
  const pauseAudio = useCallback(() => {
    if (speech && !paused) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }, [speech, paused]);

  // Function to resume audio (memoized with useCallback)
  const resumeAudio = useCallback(() => {
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    }
  }, [paused]);

  // Effect to load voices when the component mounts or when voices change
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
        console.log("SpeechSynthesis voices loaded.");
      } else {
        // Fallback for browsers that might load voices asynchronously slower
        // or if getVoices() returns empty array initially.
        // This is less common in modern browsers if called after document load.
        console.warn(
          "No voices found initially. Waiting for 'voiceschanged' event."
        );
      }
    };

    // Attempt to load voices immediately
    loadVoices();

    // Listen for the 'voiceschanged' event to ensure voices are available
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Cleanup function for when the component unmounts
    return () => {
      if (window.speechSynthesis.onvoiceschanged === loadVoices) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  // Main playAudio function (memoized with useCallback)
  const playAudio = useCallback(
    (text: string) => {
      console.log("Attempting to play audio for:", text);

      if (!text || text.trim() === "") {
        console.warn("Empty text. Nothing to play.");
        return;
      }

      if (!("speechSynthesis" in window)) {
        alert("Your browser does not support text-to-speech.");
        return;
      }

      // Crucial: Only attempt to play if voices are loaded
      if (!voicesLoaded) {
        console.warn("Speech voices are not yet loaded. Please wait a moment.");
        // You might want to provide visual feedback to the user here.
        return;
      }

      stopAudio(); // Stop any currently speaking audio

      const utterance = new SpeechSynthesisUtterance(text.trim());

      const voices = window.speechSynthesis.getVoices();
      // Prioritize en-US, then any English voice
      const englishVoice = voices.find(
        (v) => v.lang === "en-US" || v.lang.startsWith("en")
      );

      if (englishVoice) {
        utterance.voice = englishVoice;
        console.log("Selected English voice:", englishVoice.name);
      } else {
        console.warn(
          "No specific English voice found. Using default browser voice."
        );
        // Even if no specific English voice is found, setting lang helps with pronunciation
      }

      utterance.lang = "en-US"; // Set language explicitly for correct pronunciation
      utterance.rate = 0.9; // Set a slightly slower rate

      utterance.onstart = () => {
        console.log("Started playing:", utterance.text);
      };

      utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        // Add type for event
        console.error("Speech error:", event.error);
        // It's common to get 'interrupted' if another speak() is called too quickly
        // or if browser autoplay policies prevent it.
        setSpeech(null); // Clear speech state on error
        setPaused(false);
      };

      utterance.onend = () => {
        console.log("Finished playing:", utterance.text);
        setSpeech(null);
        setPaused(false);
      };

      window.speechSynthesis.speak(utterance);
      setSpeech(utterance); // Store the utterance in state
    },
    [voicesLoaded, stopAudio]
  ); // Dependencies for useCallback

  // --- Event Handlers for UI ---
  const handleCardClick = useCallback(
    (wordId: number | undefined) => {
      if (wordId !== undefined)
        setExpandedWordId(expandedWordId === wordId ? null : wordId);
    },
    [expandedWordId]
  );

  const handleWordAudioClick = useCallback(
    (event: React.MouseEvent, wordName: string) => {
      event.stopPropagation(); // Prevent card expansion
      playAudio(wordName);
    },
    [playAudio]
  );

  const handleSentenceAudioClick = useCallback(
    (event: React.MouseEvent, sentence: string, wordId: number | undefined) => {
      event.stopPropagation(); // Prevent card expansion
      playAudio(sentence);
      if (wordId !== undefined) setExpandedWordId(wordId); // Expand the card if not already
    },
    [playAudio]
  );
  console.log("expexted word id: ", expandedWordId);

  return (
    <Container
      maxWidth="md"
      sx={{
        marginTop: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: "bold",
          color: theme.palette.primary.main,
          marginBottom: 3,
        }}
      >
        {/* {topicName} Vocabulary */}
      </Typography>

      <Typography
        variant="subtitle2"
        color="textSecondary"
        align="center"
        sx={{ marginBottom: 2 }}
      >
        לחצו על כל כרטיס כדי לחשוף את התרגום והמשפט לדוגמה<br/>
        רוצים לשמוע איך
        אומרים את זה? לחצו על סמל הרמקול
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ padding: 3, width: "100%" }}>
          {words.length > 0 ? (
            words.map((word, index) => (
              <WordCard
                key={word.id || index}
                onClick={() => handleCardClick(word.id)}
              >
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={6}>
                    <WordContainer>
                      <WordNumber variant="h6">{index + 1}.</WordNumber>
                      <WordText variant="h5">{word.word}</WordText>
                      <IconButton
                        onClick={(event) =>
                          handleWordAudioClick(event, word.word)
                        }
                        color="primary"
                        size="small"
                        disabled={!voicesLoaded} // Disable if voices not loaded
                      >
                        <VolumeUpIcon />
                      </IconButton>
                    </WordContainer>
                  </Grid>
                  <Grid item xs={6}>
                    <TranslationText variant="h5" align="right">
                      {word.wordTranslation}
                    </TranslationText>
                  </Grid>
                  <Grid item xs={12}>
                    <SentenceContainer expanded={expandedWordId === word.id}>
                      <Divider sx={{ marginBottom: 1 }} />
                      <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                        {word.sentence}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {word.sentenceTranslate}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <IconButton
                          onClick={(event) =>
                            handleSentenceAudioClick(
                              event,
                              word.sentence,
                              word.id
                            )
                          }
                          color="primary"
                          size="small"
                          disabled={!voicesLoaded} // Disable if voices not loaded
                        >
                          <VolumeUpIcon />
                        </IconButton>
                        <IconButton
                          onClick={pauseAudio}
                          color="warning"
                          size="small"
                          disabled={!speech || paused} // Disable if no speech or already paused
                        >
                          <StopIcon />
                        </IconButton>
                        <IconButton
                          onClick={resumeAudio}
                          color="success"
                          size="small"
                          disabled={!speech || !paused} // Disable if no speech or not paused
                        >
                          <PlayArrowIcon />
                        </IconButton>
                      </Box>
                    </SentenceContainer>
                  </Grid>
                </Grid>
              </WordCard>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary" align="center">
              לא נמצאו מילים.
            </Typography>
          )}
          {/* Optional: Display a loading message for voices */}
          {!voicesLoaded && (
            <Typography
              variant="caption"
              color="textSecondary"
              align="center"
              sx={{ mt: 2 }}
            >
              טוען קולות דיבור...
            </Typography>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Details;