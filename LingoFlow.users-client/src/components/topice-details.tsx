// // import { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import Word from "../models/word";

// // const Details = () => {
// //     const { id } = useParams(); // 👈 שליפת ה-id מהנתיב
// //     const [words, setWords] = useState<Word[]>([]);
// //     const [subjectname, setSubjectName] = useState<string>("");

// //     useEffect(() => {
// //         // דמוי קריאה ל-API כדי להוריד את נושאי השיחה
// //         fetch(`http://localhost:5092/api/Word/subject/${id}`) // כתובת ה-API שמחזירה את נושאי השיחה
// //             .then(response => response.json())
// //             .then(data => setWords(data))
// //             .catch(error => console.error('Error fetching words:', error));
// //     }, [id]);

// //     useEffect(() => {
// //         fetch(`http://localhost:5092/api/Subject/${id}`)
// //             .then(res => res.json())
// //             .then(data => setSubjectName(data.name))
// //             .catch(error => console.error('Error fetching subject name: ', error));
// //     }, [id]);

// //     return (<>
// //         <h1>{subjectname}</h1>
// //         <h2>Vocabulary</h2>
// //         {/* הצגת המילים שהתקבלו */}
// //         <ol>
// //             {words.length > 0 ? (
// //                 words.map((word, index) => (
// //                     <li key={index}>{word.name}- {word.translation}</li> // נניח של-Word יש תכונה text
// //                 )))
// //                 : (<p>No words found.</p>)
// //             }
// //         </ol>
// //     </>)
// // }
// // export default Details;

//MUI
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Word from "../models/word";
// import { Container, Typography, Box, List, ListItem, IconButton, Grid, Divider, CircularProgress } from "@mui/material";
// import VolumeUpIcon from '@mui/icons-material/VolumeUp';
// import StopIcon from '@mui/icons-material/Stop';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import { useTheme } from "@mui/material/styles";
// import '../css/details.css'
// const Details = () => {
//     const { id } = useParams();
//     const [words, setWords] = useState<Word[]>([]);
//     const [topicName, setTopicName] = useState<string>("");
//     const [loading, setLoading] = useState<boolean>(true);
//     const [speech, setSpeech] = useState<SpeechSynthesisUtterance | null>(null);
//     const [paused, setPaused] = useState<boolean>(false);

//     const theme = useTheme();

//     useEffect(() => {
//         fetch(`http://localhost:5092/api/Word/Topic/${id}`)
//             .then(response => response.json())
//             .then(data => {
//                 setWords(data);
//                 setLoading(false);
//             })
//             .catch(error => {
//                 console.error('Error fetching words:', error);
//                 setLoading(false);
//             });
//     }, [id]);

//     useEffect(() => {
//         fetch(`http://localhost:5092/api/Topic/${id}`)
//             .then(res => res.json())
//             .then(data => setTopicName(data.name))
//             .catch(error => console.error('Error fetching topic name: ', error));
//     }, [id]);

//     const playAudio = (text: string) => {
//         stopAudio();
//         const utterance = new SpeechSynthesisUtterance(text);
//         utterance.lang = 'en-US';
//         utterance.rate = 0.9;
//         utterance.onend = () => {
//             setSpeech(null);
//             setPaused(false);
//         };
//         window.speechSynthesis.speak(utterance);
//         setSpeech(utterance);
//     };

//     const stopAudio = () => {
//         if (speech) {
//             window.speechSynthesis.cancel();
//             setSpeech(null);
//             setPaused(false);
//         }
//     };

//     const pauseAudio = () => {
//         if (speech && !paused) {
//             window.speechSynthesis.pause();
//             setPaused(true);
//         }
//     };

//     const resumeAudio = () => {
//         if (paused) {
//             window.speechSynthesis.resume();
//             setPaused(false);
//         }
//     };

//     return (
//         <Container maxWidth="xl" sx={{ marginTop: 5 }}>
//             <Typography variant="h4" align="center" sx={{ fontWeight: "bold", color: theme.palette.primary.main, marginBottom: 3 }}>
//                 {topicName} Vocabulary
//             </Typography>

//             {loading ? (
//                 <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
//                     <CircularProgress />
//                 </Box>
//             ) : (
//                 <Box sx={{ padding: 3 }}>
//                     <List>
//                         {words.length > 0 ? (
//                             words.map((word, index) => (
//                                 <ListItem key={index} sx={{ paddingY: 2 }}>
//                                     <Grid container spacing={2} alignItems="center">
//                                         <Grid item xs={1}>
//                                             <Typography variant="h6" color="textSecondary" sx={{ textAlign: "right" }}>
//                                                 {index + 1}.
//                                             </Typography>
//                                         </Grid>

//                                         <Grid item xs={4}>
//                                             <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}>
//                                                 {word.name}
//                                             </Typography>
//                                         </Grid>

//                                         <Grid item xs={4}>
//                                             <Typography variant="h6" sx={{ color: theme.palette.secondary.main }}>
//                                                 {word.translation}
//                                             </Typography>
//                                         </Grid>

//                                         <Grid item xs={1}>
//                                             <IconButton onClick={() => playAudio(word.name)} color="primary">
//                                                 <VolumeUpIcon />
//                                             </IconButton>
//                                         </Grid>

//                                         <Grid item xs={12}>
//                                             <Divider sx={{ marginY: 1 }} />
//                                         </Grid>

//                                         <Grid item xs={6}>
//                                             <Typography variant="body1" sx={{ fontStyle: "italic", color: theme.palette.text.primary }}>
//                                                 {word.sentence}
//                                             </Typography>
//                                         </Grid>

//                                         <Grid item xs={6}>
//                                             <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
//                                                 {word.sentenceTranslate}
//                                             </Typography>
//                                         </Grid>

//                                         <Grid item xs={1}>
//                                             <IconButton onClick={() => playAudio(word.sentence)} color="primary">
//                                                 <VolumeUpIcon />
//                                             </IconButton>
//                                         </Grid>

//                                         <Grid item xs={1}>
//                                             <IconButton onClick={pauseAudio} color="primary">
//                                                 <StopIcon />
//                                             </IconButton>
//                                         </Grid>

//                                         <Grid item xs={1}>
//                                             <IconButton onClick={resumeAudio} color="success">
//                                                 <PlayArrowIcon />
//                                             </IconButton>
//                                         </Grid>

//                                         <Grid item xs={12}>
//                                             <Divider sx={{ marginY: 1 }} />
//                                         </Grid>
//                                     </Grid>
//                                 </ListItem>
//                             ))
//                         ) : (
//                             <Typography variant="body1" color="textSecondary" align="center">
//                                 לא נמצאו מילים.
//                             </Typography>
//                         )}
//                     </List>
//                 </Box>
//             )}
//         </Container>
//     );
// };

// export default Details;

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

// const Details = () => {
//   const { id } = useParams<{ id: string }>();
//   const [words, setWords] = useState<Word[]>([]);
//   const [topicName, setTopicName] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(true);
//   const [speech, setSpeech] = useState<SpeechSynthesisUtterance | null>(null);
//   const [paused, setPaused] = useState<boolean>(false);
//   const [expandedWordId, setExpandedWordId] = useState<number | null>(null);

//   const theme = useTheme();

//   useEffect(() => {
//     fetch(`http://localhost:5092/api/Vocabulary/Topic/${id}`)
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);

//         setWords(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching words:", error);
//         setLoading(false);
//       });
//   }, [id]);

//   useEffect(() => {
//     fetch(`http://localhost:5092/api/Topic/${id}`)
//       .then((res) => res.json())
//       .then((data) => setTopicName(data.name))
//       .catch((error) => console.error("Error fetching topic name: ", error));
//   }, [id]);
// console.log(words);

//   // const playAplayAudioudio = (text: string) => {
//   //   stopAudio();
//   //   const utterance = new SpeechSynthesisUtterance(text);
//   //   utterance.lang = "en-US";
//   //   utterance.rate = 0.9;
//   //   utterance.onend = () => {
//   //     setSpeech(null);
//   //     setPaused(false);
//   //   };
//   //   window.speechSynthesis.speak(utterance);
//   //   setSpeech(utterance);
//   // };
//   const playAudio = (text: string) => {
//     console.log(text);

//     if (!text || text.trim() === "") {
//       console.warn("טקסט ריק. אין מה להשמיע.");
//       return;
//     }

//     if (!("speechSynthesis" in window)) {
//       alert("הדפדפן שלך לא תומך בהקראת טקסט.");
//       return;
//     }

//     stopAudio();

//     const utterance = new SpeechSynthesisUtterance(text.trim());

//     // טען קולות זמינים
//     const voices = window.speechSynthesis.getVoices();
//     const englishVoice = voices.find(
//       (v) => v.lang === "en-US" || v.lang.startsWith("en")
//     );
//     console.log(englishVoice);//undefind

//     if (englishVoice) {
//       utterance.voice = englishVoice;
//     } else {
//       console.warn("לא נמצא קול באנגלית. משתמש בקול ברירת מחדל.");
//     }

//     utterance.lang = "en-US";
//     utterance.rate = 0.9;

//     utterance.onstart = () => {
//       console.log("התחיל להשמיע:", utterance.text);
//     };

//     utterance.onerror = (event) => {
//       console.error("שגיאה בהשמעה:", event.error);
//     };

//     utterance.onend = () => {
//       console.log("סיים להשמיע:", utterance.text);
//       setSpeech(null);
//       setPaused(false);
//     };

//     window.speechSynthesis.speak(utterance);
//     setSpeech(utterance);
//   };

//   // const playAudio = (text: string) => {
//   //   stopAudio();
//   //   const utterance = new SpeechSynthesisUtterance(text);
//   //   console.log(utterance.text);

//   //   utterance.lang = "en-US";
//   //   utterance.rate = 0.9;
//   //   utterance.onend = () => {
//   //     setSpeech(null);
//   //     setPaused(false);
//   //   };
//   //   window.speechSynthesis.speak(utterance);
//   //   setSpeech(utterance.text);
//   // };
//   const stopAudio = () => {
//     if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
//       window.speechSynthesis.cancel();
//     }
//     setSpeech(null);
//     setPaused(false);
//   };

//   const pauseAudio = () => {
//     if (speech && !paused) {
//       window.speechSynthesis.pause();
//       setPaused(true);
//     }
//   };

//   const resumeAudio = () => {
//     if (paused) {
//       window.speechSynthesis.resume();
//       setPaused(false);
//     }
//   };

//   const handleCardClick = (id: number) => {
//     setExpandedWordId(expandedWordId === id ? null : id);
//   };

//   const handleWordAudioClick = (event: React.MouseEvent, wordName: string) => {
//     event.stopPropagation();
//     playAudio(wordName);
//   };

//   const handleSentenceAudioClick = (
//     event: React.MouseEvent,
//     sentence: string,
//     wordId: number
//   ) => {
//     event.stopPropagation();
//     playAudio(sentence);
//     setExpandedWordId(wordId);
//   };

//   return (
//     <Container
//       maxWidth="md"
//       sx={{
//         marginTop: 5,
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//       }}
//     >
//       <Typography
//         variant="h4"
//         align="center"
//         sx={{
//           fontWeight: "bold",
//           color: theme.palette.primary.main,
//           marginBottom: 3,
//         }}
//       >
//         {topicName} Vocabulary
//       </Typography>

//       <Typography
//         variant="subtitle2"
//         color="textSecondary"
//         align="center"
//         sx={{ marginBottom: 2 }}
//       >
//         לחצו על כרטיסייה כדי לראות את התרגום והמשפט, ועל סמל הרמקול כדי לשמוע את
//         ההגייה.
//       </Typography>

//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Box sx={{ padding: 3, width: "100%" }}>
//           {words.length > 0 ? (
//             words.map((word, index) => (
//               <WordCard
//                 key={word.id || index}
//                 onClick={() => handleCardClick(word.id)}
//               >
//                 <Grid container alignItems="center" spacing={2}>
//                   <Grid item xs={6}>
//                     <WordContainer>
//                       <WordNumber variant="h6">{index + 1}.</WordNumber>
//                       <WordText variant="h5">{word.word}</WordText>
//                       <IconButton
//                         onClick={(event) =>
//                           handleWordAudioClick(event, word.word)
//                         }
//                         color="primary"
//                         size="small"
//                       >
//                         <VolumeUpIcon />
//                       </IconButton>
//                     </WordContainer>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <TranslationText variant="h5" align="right">
//                       {word.wordTanslation}
//                     </TranslationText>
//                   </Grid>
//                   <Grid item xs={12}>
//                     <SentenceContainer expanded={expandedWordId === word.id}>
//                       <Divider sx={{ marginBottom: 1 }} />
//                       <Typography variant="body1" sx={{ fontStyle: "italic" }}>
//                         {word.sentence}
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary">
//                         {word.sentenceTranslate}
//                       </Typography>
//                       <Box sx={{ mt: 1 }}>
//                         <IconButton
//                           onClick={(event) =>
//                             handleSentenceAudioClick(
//                               event,
//                               word.sentence,
//                               word.id
//                               // ??index
//                             )
//                           }
//                           color="primary"
//                           size="small"
//                         >
//                           <VolumeUpIcon />
//                         </IconButton>
//                         <IconButton
//                           onClick={pauseAudio}
//                           color="warning"
//                           size="small"
//                         >
//                           <StopIcon />
//                         </IconButton>
//                         <IconButton
//                           onClick={resumeAudio}
//                           color="success"
//                           size="small"
//                         >
//                           <PlayArrowIcon />
//                         </IconButton>
//                       </Box>
//                     </SentenceContainer>
//                   </Grid>
//                 </Grid>
//               </WordCard>
//             ))
//           ) : (
//             <Typography variant="body1" color="textSecondary" align="center">
//               לא נמצאו מילים.
//             </Typography>
//           )}
//         </Box>
//       )}
//     </Container>
//   );
// };

// export default Details;

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

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Word from "../models/word";
// import {
//   Container,
//   Typography,
//   Box,
//   List,
//   ListItem,
//   IconButton,
//   Grid,
//   Divider,
//   CircularProgress,
//   Paper,
//   Card,
//   CardContent,
//   Chip,
//   Tooltip,
//   createTheme,
//   ThemeProvider
// } from "@mui/material";
// import VolumeUpIcon from '@mui/icons-material/VolumeUp';
// import StopIcon from '@mui/icons-material/Stop';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import TranslateIcon from '@mui/icons-material/Translate';
// import MenuBookIcon from '@mui/icons-material/MenuBook';
// import { alpha } from '@mui/material/styles';

// const Details = () => {
//     const { id } = useParams();
//     const [words, setWords] = useState<Word[]>([]);
//     const [topicName, setTopicName] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [speech, setSpeech] = useState<SpeechSynthesisUtterance | null>(null);
//     const [paused, setPaused] = useState(false);
//     const [playingIndex, setPlayingIndex] = useState(null);

//     // Create a custom theme with blue and red colors
//     const theme = createTheme({
//         palette: {
//             primary: {
//                 main: '#1976d2', // Blue shade
//                 light: '#4791db',
//                 dark: '#115293',
//             },
//             secondary: {
//                 main: '#d32f2f', // Red shade
//                 light: '#e57373',
//                 dark: '#b71c1c',
//             },
//             background: {
//                 default: '#f5f8fd',
//                 paper: '#ffffff',
//             },
//             text: {
//                 primary: '#212121',
//                 secondary: '#585858',
//             },
//         },
//         typography: {
//             fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
//             h4: {
//                 fontWeight: 700,
//             },
//             h5: {
//                 fontWeight: 600,
//             },
//             h6: {
//                 fontWeight: 500,
//             },
//         },
//         components: {
//             MuiCard: {
//                 styleOverrides: {
//                     root: {
//                         boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//                         borderRadius: 12,
//                     },
//                 },
//             },
//             MuiDivider: {
//                 styleOverrides: {
//                     root: {
//                         margin: '12px 0',
//                     },
//                 },
//             },
//         },
//     });

//     useEffect(() => {
//         fetch(`http://localhost:5092/api/Word/Topic/${id}`)
//             .then(response => response.json())
//             .then(data => {
//                 setWords(data);
//                 setLoading(false);
//             })
//             .catch(error => {
//                 console.error('Error fetching words:', error);
//                 setLoading(false);
//             });
//     }, [id]);

//     useEffect(() => {
//         fetch(`http://localhost:5092/api/Topic/${id}`)
//             .then(res => res.json())
//             .then(data => setTopicName(data.name))
//             .catch(error => console.error('Error fetching topic name: ', error));
//     }, [id]);

//     const playAudio = (text:any, index:any) => {
//         stopAudio();
//         const utterance = new SpeechSynthesisUtterance(text);
//         utterance.lang = 'en-US';
//         utterance.rate = 0.9;
//         utterance.onend = () => {
//             setSpeech(null);
//             setPaused(false);
//             setPlayingIndex(null);
//         };
//         window.speechSynthesis.speak(utterance);
//         setSpeech(utterance);
//         setPlayingIndex(index);
//     };

//     const stopAudio = () => {
//         if (speech) {
//             window.speechSynthesis.cancel();
//             setSpeech(null);
//             setPaused(false);
//             setPlayingIndex(null);
//         }
//     };

//     const pauseAudio = () => {
//         if (speech && !paused) {
//             window.speechSynthesis.pause();
//             setPaused(true);
//         }
//     };

//     const resumeAudio = () => {
//         if (paused) {
//             window.speechSynthesis.resume();
//             setPaused(false);
//         }
//     };

//     return (
//         <ThemeProvider theme={theme}>
//             <Container maxWidth="lg" sx={{ marginTop: 5, marginBottom: 5 }}>
//                 <Box sx={{
//                     backgroundImage: 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(211,47,47,0.1) 100%)',
//                     borderRadius: 4,
//                     padding: 3,
//                     mb: 4,
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     flexDirection: 'column'
//                 }}>
//                     <Box sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         mb: 1,
//                         backgroundColor: alpha(theme.palette.primary.main, 0.1),
//                         px: 3,
//                         py: 1,
//                         borderRadius: 2
//                     }}>
//                         <MenuBookIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 32 }} />
//                         <Typography variant="h4" align="center" sx={{
//                             fontWeight: "bold",
//                             color: theme.palette.primary.main,
//                             background: 'linear-gradient(45deg, #1976d2 30%, #d32f2f 90%)',
//                             WebkitBackgroundClip: 'text',
//                             WebkitTextFillColor: 'transparent'
//                         }}>
//                             {topicName} Vocabulary
//                         </Typography>
//                     </Box>

//                     <Chip
//                         label={`${words.length} words`}
//                         color="primary"
//                         size="small"
//                         sx={{ fontWeight: 500 }}
//                     />
//                 </Box>

//                 {loading ? (
//                     <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4, marginBottom: 4 }}>
//                         <CircularProgress sx={{ color: theme.palette.secondary.main }} />
//                     </Box>
//                 ) : (
//                     <Box>
//                         <List sx={{ p: 0 }}>
//                             {words.length > 0 ? (
//                                 words.map((word, index) => (
//                                     <Card
//                                         key={index}
//                                         sx={{
//                                             mb: 3,
//                                             position: 'relative',
//                                             overflow: 'visible',
//                                             '&:hover': {
//                                                 boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
//                                                 transform: 'translateY(-2px)',
//                                                 transition: 'all 0.3s ease'
//                                             },
//                                             borderLeft: playingIndex === index ?
//                                                 `5px solid ${theme.palette.secondary.main}` :
//                                                 `5px solid ${theme.palette.primary.main}`
//                                         }}
//                                     >
//                                         <Box
//                                             sx={{
//                                                 position: 'absolute',
//                                                 top: -12,
//                                                 left: 16,
//                                                 backgroundColor: theme.palette.primary.main,
//                                                 color: 'white',
//                                                 width: 30,
//                                                 height: 30,
//                                                 borderRadius: '50%',
//                                                 display: 'flex',
//                                                 alignItems: 'center',
//                                                 justifyContent: 'center',
//                                                 fontWeight: 'bold',
//                                                 boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
//                                             }}
//                                         >
//                                             {index + 1}
//                                         </Box>
//                                         <CardContent sx={{ pt: 3 }}>
//                                             <Grid container spacing={2}>
//                                                 <Grid item xs={12} md={5}>
//                                                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                                                         <Typography
//                                                             variant="h5"
//                                                             sx={{
//                                                                 color: theme.palette.primary.main,
//                                                                 fontWeight: "bold",
//                                                                 mr: 1
//                                                             }}
//                                                         >
//                                                             {word.name}
//                                                         </Typography>
//                                                         <Tooltip title="Pronounce word">
//                                                             <IconButton
//                                                                 onClick={() => playAudio(word.name, index)}
//                                                                 color="primary"
//                                                                 size="small"
//                                                                 sx={{
//                                                                     backgroundColor: alpha(theme.palette.primary.main, 0.1),
//                                                                     '&:hover': {
//                                                                         backgroundColor: alpha(theme.palette.primary.main, 0.2),
//                                                                     }
//                                                                 }}
//                                                             >
//                                                                 <VolumeUpIcon fontSize="small" />
//                                                             </IconButton>
//                                                         </Tooltip>
//                                                     </Box>

//                                                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                                         <TranslateIcon sx={{ color: theme.palette.secondary.main, mr: 1, fontSize: 16 }} />
//                                                         <Typography
//                                                             variant="h6"
//                                                             sx={{
//                                                                 color: theme.palette.secondary.main,
//                                                                 fontWeight: 500
//                                                             }}
//                                                         >
//                                                             {word.translation}
//                                                         </Typography>
//                                                     </Box>
//                                                 </Grid>

//                                                 <Grid item xs={12}>
//                                                     <Divider sx={{
//                                                         my: 2,
//                                                         backgroundImage: 'linear-gradient(to right, rgba(25,118,210,0.2), rgba(211,47,47,0.2))'
//                                                     }} />
//                                                 </Grid>

//                                                 <Grid item xs={12} md={8}>
//                                                     <Paper
//                                                         elevation={0}
//                                                         sx={{
//                                                             p: 2,
//                                                             backgroundColor: alpha(theme.palette.primary.main, 0.05),
//                                                             borderRadius: 2,
//                                                             mb: 1
//                                                         }}
//                                                     >
//                                                         <Typography
//                                                             variant="body1"
//                                                             sx={{
//                                                                 fontStyle: "italic",
//                                                                 color: theme.palette.text.primary,
//                                                                 position: 'relative',
//                                                                 pl: 3,
//                                                                 '&:before': {
//                                                                     content: '"""',
//                                                                     position: 'absolute',
//                                                                     left: 0,
//                                                                     top: -5,
//                                                                     fontSize: '1.5rem',
//                                                                     color: alpha(theme.palette.primary.main, 0.5)
//                                                                 }
//                                                             }}
//                                                         >
//                                                             {word.sentence}
//                                                         </Typography>
//                                                     </Paper>

//                                                     <Paper
//                                                         elevation={0}
//                                                         sx={{
//                                                             p: 2,
//                                                             backgroundColor: alpha(theme.palette.secondary.main, 0.05),
//                                                             borderRadius: 2,
//                                                             mb: 1
//                                                         }}
//                                                     >
//                                                         <Typography
//                                                             variant="body1"
//                                                             sx={{
//                                                                 color: theme.palette.text.secondary,
//                                                                 position: 'relative',
//                                                                 pl: 3,
//                                                                 '&:before': {
//                                                                     content: '"""',
//                                                                     position: 'absolute',
//                                                                     left: 0,
//                                                                     top: -5,
//                                                                     fontSize: '1.5rem',
//                                                                     color: alpha(theme.palette.secondary.main, 0.5)
//                                                                 }
//                                                             }}
//                                                         >
//                                                             {word.sentenceTranslate}
//                                                         </Typography>
//                                                     </Paper>
//                                                 </Grid>

//                                                 <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: {xs: 'flex-start', md: 'flex-end'} }}>
//                                                     <Box sx={{ display: 'flex', gap: 1 }}>
//                                                         <Tooltip title="Pronounce sentence">
//                                                             <IconButton
//                                                                 onClick={() => playAudio(word.sentence, index)}
//                                                                 color="primary"
//                                                                 sx={{
//                                                                     backgroundColor: theme.palette.primary.main,
//                                                                     color: 'white',
//                                                                     '&:hover': {
//                                                                         backgroundColor: theme.palette.primary.dark,
//                                                                     }
//                                                                 }}
//                                                             >
//                                                                 <VolumeUpIcon />
//                                                             </IconButton>
//                                                         </Tooltip>

//                                                         <Tooltip title={paused ? "Resume" : "Pause"}>
//                                                             <IconButton
//                                                                 onClick={paused ? resumeAudio : pauseAudio}
//                                                                 color="secondary"
//                                                                 disabled={!speech || playingIndex !== index}
//                                                                 sx={{
//                                                                     backgroundColor: paused ?
//                                                                         alpha(theme.palette.secondary.main, 0.1) :
//                                                                         alpha(theme.palette.secondary.main, 0.1),
//                                                                     '&:hover': {
//                                                                         backgroundColor: paused ?
//                                                                             alpha(theme.palette.secondary.main, 0.2) :
//                                                                             alpha(theme.palette.secondary.main, 0.2),
//                                                                     },
//                                                                     '&.Mui-disabled': {
//                                                                         backgroundColor: alpha(theme.palette.action.disabled, 0.1),
//                                                                         color: theme.palette.action.disabled
//                                                                     }
//                                                                 }}
//                                                             >
//                                                                 {paused ? <PlayArrowIcon /> : <StopIcon />}
//                                                             </IconButton>
//                                                         </Tooltip>
//                                                     </Box>
//                                                 </Grid>
//                                             </Grid>
//                                         </CardContent>
//                                     </Card>
//                                 ))
//                             ) : (
//                                 <Paper
//                                     sx={{
//                                         p: 4,
//                                         textAlign: 'center',
//                                         backgroundColor: alpha(theme.palette.primary.main, 0.05),
//                                         borderRadius: 2
//                                     }}
//                                 >
//                                     <Typography variant="h6" color="textSecondary" align="center" dir="rtl">
//                                         לא נמצאו מילים.
//                                     </Typography>
//                                 </Paper>
//                             )}
//                         </List>
//                     </Box>
//                 )}
//             </Container>
//         </ThemeProvider>
//     );
// };

// export default Details;

// "use client"

// import { useEffect, useState } from "react"
// import { useParams } from "react-router-dom"

// // הגדרת הטיפוס Word
// interface Word {
//   id: number
//   name: string
//   translation: string
//   sentence?: string
//   sentenceTranslate?: string
// }

// const Details = () => {
//   const { id } = useParams()
//   const [words, setWords] = useState<Word[]>([])
//   const [subjectName, setSubjectName] = useState<string>("")
//   const [loading, setLoading] = useState<boolean>(true)
//   const [activeAudio, setActiveAudio] = useState<SpeechSynthesisUtterance | null>(null)
//   const [isPlaying, setIsPlaying] = useState<boolean>(false)
//   const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null)

//   useEffect(() => {
//     setLoading(true)
//     // שליפת המילים מה-API
//     fetch(`http://localhost:5092/api/Word/Topic/${id}`)
//       .then((response) => response.json())
//       .then((data) => {
//         setWords(data)
//         setLoading(false)
//       })
//       .catch((error) => {
//         console.error("Error fetching words:", error)
//         setLoading(false)
//       })
//   }, [id])

//   useEffect(() => {
//     // שליפת שם הנושא מה-API
//     fetch(`http://localhost:5092/api/Topic/${id}`)
//       .then((res) => res.json())
//       .then((data) => setSubjectName(data.name))
//       .catch((error) => console.error("Error fetching subject name: ", error))
//   }, [id])

//   // פונקציה להשמעת טקסט
//   const playAudio = (text: string, id: string) => {
//     // עצירת השמעה קודמת אם קיימת
//     if (activeAudio) {
//       window.speechSynthesis.cancel()
//       setActiveAudio(null)
//       setIsPlaying(false)

//       // אם לוחצים על אותו כפתור שכבר מנגן, רק עוצרים ולא מתחילים מחדש
//       if (currentPlayingId === id) {
//         setCurrentPlayingId(null)
//         return
//       }
//     }

//     // יצירת אובייקט השמעה חדש
//     const utterance = new SpeechSynthesisUtterance(text)
//     utterance.lang = "en-US"
//     utterance.rate = 0.9

//     // הגדרת פעולה בסיום ההשמעה
//     utterance.onend = () => {
//       setActiveAudio(null)
//       setIsPlaying(false)
//       setCurrentPlayingId(null)
//     }

//     // השמעת הטקסט
//     window.speechSynthesis.speak(utterance)
//     setActiveAudio(utterance)
//     setIsPlaying(true)
//     setCurrentPlayingId(id)
//   }

//   // פונקציה לעצירת השמעה
//   const stopAudio = () => {
//     if (activeAudio) {
//       window.speechSynthesis.pause()
//       setIsPlaying(false)
//     }
//   }

//   // פונקציה להמשך השמעה
//   const resumeAudio = () => {
//     if (activeAudio && !isPlaying) {
//       window.speechSynthesis.resume()
//       setIsPlaying(true)
//     }
//   }

//   // סגנונות CSS מוגדרים ישירות בקומפוננטה
//   const styles = {
//     pageContainer: {
//       backgroundColor: "#f8fafc",
//       minHeight: "100vh",
//       padding: "20px 0",
//       display: "flex",
//       justifyContent: "center",
//     },
//     container: {
//       width: "100%",
//       maxWidth: "800px",
//       margin: "0 auto",
//       padding: "20px",
//       fontFamily: "Arial, sans-serif",
//     },
//     header: {
//       textAlign: "center" as const,
//       marginBottom: "30px",
//     },
//     title: {
//       color: "#1e40af", // כחול כהה
//       fontSize: "28px",
//       fontWeight: "bold",
//       margin: "0",
//     },
//     subtitle: {
//       color: "#4b5563", // אפור כהה
//       fontSize: "18px",
//       marginTop: "5px",
//     },
//     divider: {
//       height: "4px",
//       width: "80px",
//       background: "linear-gradient(to right, #1e40af, #ef4444)", // גרדיאנט מכחול לאדום
//       margin: "15px auto",
//       borderRadius: "2px",
//     },
//     wordsList: {
//       backgroundColor: "white",
//       borderRadius: "10px",
//       boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//       padding: "20px",
//       listStyle: "none",
//       margin: "0",
//     },
//     wordItem: {
//       padding: "15px 0",
//       borderBottom: "1px solid #f3f4f6",
//       display: "flex",
//       alignItems: "flex-start",
//     },
//     wordNumber: {
//       width: "30px",
//       height: "30px",
//       backgroundColor: "#dbeafe", // כחול בהיר
//       color: "#1e40af", // כחול כהה
//       borderRadius: "50%",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       fontWeight: "bold",
//       marginRight: "15px",
//       flexShrink: 0,
//     },
//     wordContent: {
//       flexGrow: 1,
//     },
//     wordHeader: {
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       marginBottom: "8px",
//     },
//     wordNameContainer: {
//       display: "flex",
//       alignItems: "center",
//     },
//     wordName: {
//       color: "#1e40af", // כחול כהה
//       fontSize: "18px",
//       fontWeight: "bold",
//       margin: "0",
//       display: "inline",
//       direction: "ltr",
//       textAlign: "left" as const,
//     },
//     wordTranslation: {
//       color: "#ef4444", // אדום
//       fontSize: "18px",
//       margin: "0 0 0 5px",
//       display: "inline",
//       direction: "rtl",
//       textAlign: "right" as const,
//     },
//     sentenceContainer: {
//       marginTop: "10px",
//       display: "flex",
//       flexDirection: "column" as const,
//     },
//     sentence: {
//       color: "#4b5563", // אפור כהה
//       fontSize: "14px",
//       fontStyle: "italic",
//       marginBottom: "5px",
//       direction: "ltr",
//       textAlign: "left" as const,
//     },
//     sentenceTranslation: {
//       color: "#6b7280", // אפור בינוני
//       fontSize: "14px",
//       direction: "rtl",
//       textAlign: "right" as const,
//     },
//     audioControls: {
//       display: "flex",
//       alignItems: "center",
//       gap: "5px",
//       marginTop: "8px",
//     },
//     soundButton: {
//       backgroundColor: "#dbeafe", // כחול בהיר
//       color: "#1e40af", // כחול כהה
//       border: "none",
//       borderRadius: "50%",
//       width: "36px",
//       height: "36px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       cursor: "pointer",
//       flexShrink: 0,
//       transition: "background-color 0.2s",
//     },
//     activeButton: {
//       backgroundColor: "#93c5fd", // כחול בהיר יותר כשפעיל
//     },
//     controlButton: {
//       backgroundColor: "#f3f4f6", // אפור בהיר
//       color: "#4b5563", // אפור כהה
//       border: "none",
//       borderRadius: "50%",
//       width: "30px",
//       height: "30px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       cursor: "pointer",
//       flexShrink: 0,
//       transition: "background-color 0.2s",
//     },
//     loadingContainer: {
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       height: "200px",
//     },
//     loadingSpinner: {
//       border: "4px solid rgba(0, 0, 0, 0.1)",
//       borderLeft: "4px solid #1e40af",
//       borderRadius: "50%",
//       width: "40px",
//       height: "40px",
//       animation: "spin 1s linear infinite",
//     },
//     noWordsMessage: {
//       textAlign: "center" as const,
//       color: "#6b7280",
//       fontSize: "18px",
//       padding: "30px 0",
//     },
//   }

//   // הוספת סגנון גלובלי לאנימציה
//   useEffect(() => {
//     const style = document.createElement("style")
//     style.innerHTML = `
//       @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//       }
//     `
//     document.head.appendChild(style)
//     return () => {
//       document.head.removeChild(style)
//     }
//   }, [])

//   return (
//     <div style={styles.pageContainer}>
//       <div style={styles.container}>
//         {/* כותרת הנושא */}
//         <div style={styles.header}>
//           <h1 style={styles.title}>{subjectName}</h1>
//           <div style={styles.divider}></div>
//           <h2 style={styles.subtitle}>Vocabulary</h2>
//         </div>

//         {/* מצב טעינה */}
//         {loading ? (
//           <div style={styles.loadingContainer}>
//             <div style={styles.loadingSpinner}></div>
//           </div>
//         ) : (
//           <ul style={styles.wordsList}>
//             {/* רשימת המילים */}
//             {words.length > 0 ? (
//               words.map((word, index) => (
//                 <li key={index} style={styles.wordItem}>
//                   {/* מספר המילה */}
//                   <div style={styles.wordNumber}>{index + 1}</div>

//                   {/* תוכן המילה */}
//                   <div style={styles.wordContent}>
//                     <div style={styles.wordHeader}>
//                       <div style={styles.wordNameContainer}>
//                         <h3 style={styles.wordName}>{word.name}</h3>
//                         <span style={styles.wordTranslation}> - {word.translation}</span>
//                       </div>

//                       {/* כפתור השמעה למילה */}
//                       <button
//                         onClick={() => playAudio(word.name, `word-${index}`)}
//                         style={{
//                           ...styles.soundButton,
//                           ...(currentPlayingId === `word-${index}` ? styles.activeButton : {}),
//                         }}
//                         title="Play word pronunciation"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="18"
//                           height="18"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
//                           <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
//                           <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
//                         </svg>
//                       </button>
//                     </div>

//                     {/* משפט לדוגמה אם קיים */}
//                     {word.sentence && (
//                       <div style={styles.sentenceContainer}>
//                         <p style={styles.sentence}>"{word.sentence}"</p>
//                         {word.sentenceTranslate && <p style={styles.sentenceTranslation}>{word.sentenceTranslate}</p>}

//                         {/* כפתורי שליטה בהשמעת המשפט */}
//                         <div style={styles.audioControls}>
//                           {/* כפתור השמעת משפט */}
//                           <button
//                             onClick={() => playAudio(word.sentence, `sentence-${index}`)}
//                             style={{
//                               ...styles.soundButton,
//                               ...(currentPlayingId === `sentence-${index}` ? styles.activeButton : {}),
//                             }}
//                             title="Play sentence pronunciation"
//                           >
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="18"
//                               height="18"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             >
//                               <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
//                               <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
//                               <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
//                             </svg>
//                           </button>

//                           {/* כפתור עצירה */}
//                           <button
//                             onClick={stopAudio}
//                             style={styles.controlButton}
//                             title="Pause audio"
//                             disabled={!activeAudio || !isPlaying}
//                           >
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="16"
//                               height="16"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             >
//                               <rect x="6" y="4" width="4" height="16"></rect>
//                               <rect x="14" y="4" width="4" height="16"></rect>
//                             </svg>
//                           </button>

//                           {/* כפתור המשך */}
//                           <button
//                             onClick={resumeAudio}
//                             style={styles.controlButton}
//                             title="Resume audio"
//                             disabled={!activeAudio || isPlaying}
//                           >
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="16"
//                               height="16"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             >
//                               <polygon points="5 3 19 12 5 21 5 3"></polygon>
//                             </svg>
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </li>
//               ))
//             ) : (
//               <div style={styles.noWordsMessage}>לא נמצאו מילים.</div>
//             )}
//           </ul>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Details
