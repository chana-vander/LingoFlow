import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { feedbackStore } from "../stores/feedbackStore";
import recordStore from "../stores/recordStore"; // וודא שהייבוא נכון: export const recordStore = new RecordStore();
// קוד שעובד עם עיצוב
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Feedback: React.FC = observer(() => {
  const navigate = useNavigate(); // השתמש ב-useNavigate מ-React Router
  const recording = recordStore.recording; // recording יכול להיות Record | null

  // useEffect לטיפול בלוגיקה אסינכרונית בעת טעינת הקומפוננטה
  useEffect(() => {
    console.log("in feedback: ", recording);
    const fetchAndProcessFeedback = async () => {
      // אם אין הקלטה זמינה, או אם חסרים פרטים חיוניים
      if (
        !recording ||
        recording.id === undefined ||
        !recording.url ||
        recording.topicId === undefined
      ) {
        console.warn(
          "Missing recording data (ID, URL, or Topic ID). Cannot process feedback."
        );
        // לדוגמה, הפנה חזרה לדף הבית אם אין נתונים
        navigate("/");
        return;
      }

      // אם כבר יש משוב בסטור, אל תבצע קריאות שוב
      if (feedbackStore.feedback) {
        console.log("Feedback already loaded from store.");
        // feedback=feedbackStore.feedback;
        return;
      }

      try {
        // 1. בצע תמלול והמתן לסיומו
        // transcribeFromUrl מעדכנת את feedbackStore.transcription
        await feedbackStore.transcribeFromUrl(recording.url, recording.id);
        console.log(
          "Transcription status: ",
          feedbackStore.transcription ? "Success" : "Failed"
        );

        // 2. אם התמלול הצליח, בצע ניתוח משוב
        if (feedbackStore.transcription) {
          // analyzeTranscription מעדכנת את feedbackStore.feedback
          await feedbackStore.analyzeTranscription(
            feedbackStore.transcription,
            // וודא ש-recording.topicId הוא מספר. אם הוא string, המר אותו:
            Number(recording.topicId),
            recording.id
          );
          console.log(
            "Feedback status: ",
            feedbackStore.feedback ? "Success" : "Failed"
          );
        } else {
          console.error(
            "Transcription failed or is empty. Cannot analyze feedback."
          );
        }
      } catch (error) {
        console.error("Error during feedback process:", error);
        // הגדר הודעת שגיאה בסטור אם לא טופלה כבר ב-feedbackStore
        if (!feedbackStore.error) {
          feedbackStore.error = "אירעה שגיאה בטעינת המשוב.";
        }
      }
    };

    fetchAndProcessFeedback(); // קרא לפונקציה האסינכרונית
    console.log(feedbackStore.feedback);

    // // פונקציית ניקוי: מאפסת את הסטור כשיוצאים מהקומפוננטה
    // return () => {
    //   feedbackStore.reset();
    // };
  }, [recording, navigate]); // תלויות: הפעל מחדש כשההקלטה או הניווט משתנים

  // הצגת מצב טעינה, שגיאה או משוב
  const { loading, error, transcription, feedback } = feedbackStore;

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
      >
        <CircularProgress color="primary" size={60} />
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          מכינים עבורך משוב על ההקלטה שלך...
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          זה יכול לקחת כמה רגעים. אנא המתן בסבלנות!
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        sx={{ color: "red" }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          אופס! משהו השתבש...
        </Typography>
        <Typography variant="body1" color="error" sx={{ textAlign: "center" }}>
          {error}
        </Typography>
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#007bff",
              color: "white",
              cursor: "pointer",
            }}
          >
            נסה שוב
          </button>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#cc0000",
              color: "white",
              cursor: "pointer",
            }}
          >
            חזור לדף הבית
          </button>
        </Box>
      </Box>
    );
  }

  // אם אין משוב (אבל אין שגיאה ואין טעינה), זה אומר שלא נמצאו נתונים או שההקלטה לא הייתה תקינה מלכתחילה
  if (!feedback) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
      >
        <Typography variant="h6" color="textSecondary">
          אין משוב זמין עבור ההקלטה הזו.
        </Typography>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#cc0000",
            color: "white",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          חזור לדף הראשי
        </button>
      </Box>
    );
  }

  // תצוגת המשוב בפועל
  return (
    <Box
      sx={{
        maxWidth: 900,
        margin: "40px auto",
        p: 3,
        direction: "rtl",
        textAlign: "right",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ color: "#007bff" }}
      >
        המשוב שלך על ההקלטה
      </Typography>

      {/* ציון כללי */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={4}
        gap={2}
      >
        <Typography variant="h6" color="textPrimary">
          ציון כללי:
        </Typography>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2em",
            fontWeight: "bold",
            color: "white",
            backgroundColor:
              feedback.score >= 80
                ? "#4CAF50" // ירוק
                : feedback.score >= 60
                ? "#FFC107" // כתום
                : "#F44336", // אדום
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          {feedback.score}
        </Box>
      </Box>

      {/* תמלול ההקלטה */}
      {transcription && (
        <Card sx={{ mb: 4, bgcolor: "#e6f7ff", border: "1px solid #b3e0ff" }}>
          <CardContent>
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              align="center"
              sx={{ color: "#007bff" }}
            >
              התמלול של ההקלטה שלך:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                color: "#222",
              }}
            >
              {transcription}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Divider sx={{ my: 4 }} />

      {/* פרטי המשוב */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(280px, 1fr))"
        gap={3}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ color: "#cc0000" }}>
              דקדוק:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              ציון:{" "}
              <span style={{ color: "#007bff" }}>
                {feedback.grammarScore}/10
              </span>
            </Typography>
            <Typography variant="body2">{feedback.grammarComment}</Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ color: "#cc0000" }}>
              שטף דיבור:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              ציון:{" "}
              <span style={{ color: "#007bff" }}>
                {feedback.fluencyScore}/10
              </span>
            </Typography>
            <Typography variant="body2">{feedback.fluencyComment}</Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ color: "#cc0000" }}>
              אוצר מילים:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              ציון:{" "}
              <span style={{ color: "#007bff" }}>
                {feedback.vocabularyScore}/10
              </span>
            </Typography>
            <Typography variant="body2">
              {feedback.vocabularyComment}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ gridColumn: "1 / -1" }}>
          {" "}
          {/* תופס את כל הרוחב */}
          <CardContent>
            <Typography variant="h6" sx={{ color: "#cc0000" }}>
              משוב כללי:
            </Typography>
            <Typography variant="body2">{feedback.generalFeedback}</Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ color: "#cc0000" }}>
              מילים בשימוש:
            </Typography>
            <Typography variant="body1">
              <span style={{ fontWeight: "bold", color: "#007bff" }}>
                {feedback.usedWordsCount}
              </span>{" "}
              מתוך{" "}
              <span style={{ fontWeight: "bold", color: "#007bff" }}>
                {feedback.totalWordsRequired}
              </span>{" "}
              נדרשות
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ color: "#cc0000" }}>
              זמן מתן משוב:
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", color: "#007bff" }}
            >
              {new Date(feedback.givenAt).toLocaleString("he-IL")}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 25px",
            borderRadius: "25px",
            border: "none",
            backgroundColor: "#cc0000",
            color: "white",
            fontSize: "1.1em",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s ease, transform 0.2s ease",
          }}
        >
          חזור לדף הראשי
        </button>
      </Box>
    </Box>
  );
});

export default Feedback;

// שלי
// const Feedback: React.FC = observer(() => {
//   const recording=recordStore.recording;
//   const f=async()=>{
//     if(recording?.id){
//       const transcription=feedbackStore.transcribeFromUrl(recording.url,recording.id);
//     }
//     if(recording?.topicId){
//       const feedback=feedbackStore.analyzeTranscription(transaction,recording.topicId,recording.id);
//     }
//   }
//   return (<>

//   </>);
// });
// export default Feedback;

// import React, { useEffect, useState } from "react";
// // import { observer } from "mobx-react-lite";
// // import { feedbackStore } from "../stores/feedbackStore";
// // import { recordStore } from "../stores/recordStore";

// const Feedback: React.FC = observer(() => {
//   const { recording } = recordStore;
//   const { feedback, transcription, loading } = feedbackStore;
//   const [started, setStarted] = useState(false);

//   const styles: { [key: string]: React.CSSProperties } = {
//     container: {
//       padding: "30px",
//       backgroundColor: "#f8f9fa",
//       fontFamily: "Arial, sans-serif",
//       direction: "rtl",
//     },
//     title: {
//       fontSize: "24px",
//       color: "#1a237e", // כחול כהה
//       textAlign: "center",
//       marginBottom: "20px",
//     },
//     box: {
//       backgroundColor: "#ffffff",
//       border: "2px solid #b71c1c", // אדום כהה
//       borderRadius: "12px",
//       padding: "20px",
//       maxWidth: "600px",
//       margin: "0 auto",
//       boxShadow: "0 0 15px rgba(0,0,0,0.1)",
//       color: "#212121",
//     },
//     center: {
//       display: "flex",
//       flexDirection: "column" as const,
//       alignItems: "center",
//       justifyContent: "center",
//       height: "60vh",
//     },
//     spinner: {
//       border: "8px solid #e0e0e0",
//       borderTop: "8px solid #1e88e5",
//       borderRadius: "50%",
//       width: "60px",
//       height: "60px",
//       animation: "spin 1s linear infinite",
//     },
//     text: {
//       marginTop: "20px",
//       fontSize: "18px",
//       color: "#b71c1c", // אדום
//     },
//   };

//   useEffect(() => {
//     const fetchFeedback = async () => {
//       if (!recording || !recording.id || !recording.topicId) return;

//       await feedbackStore.transcribeFromUrl(recording.url, recording.id);
//       await feedbackStore.analyzeTranscription(
//         feedbackStore.transcription,
//         recording.topicId,
//         recording.id
//       );

//       setStarted(true);
//     };

//     fetchFeedback();
//   }, [recording]);

//   if (loading || !started || !feedback) {
//     return (
//       <div style={styles.center}>
//         <div style={styles.spinner}></div>
//         <p style={styles.text}>אנחנו מכינים עבורך משוב על ההקלטה שלך...</p>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>המשוב שלך</h2>
//       <div style={styles.box}>
//         <p><strong>ציון כולל:</strong> {feedback.score} / 10</p>
//         <p><strong>דקדוק:</strong> {feedback.grammarScore} - {feedback.grammarComment}</p>
//         <p><strong>שטף:</strong> {feedback.fluencyScore} - {feedback.fluencyComment}</p>
//         <p><strong>אוצר מילים:</strong> {feedback.vocabularyScore} - {feedback.vocabularyComment}</p>
//         <p><strong>מילים בשימוש:</strong> {feedback.usedWordsCount} מתוך {feedback.totalWordsRequired}</p>
//         <p><strong>משוב כללי:</strong> {feedback.generalFeedback}</p>
//         <p><strong>המשוב ניתן בתאריך:</strong> {new Date(feedback.givenAt).toLocaleString()}</p>
//       </div>
//     </div>
//   );
// });

// export default Feedback;

// import React, { useEffect, useState } from "react";
// import { observer } from "mobx-react-lite";
// import { feedbackStore } from "../stores/feedbackStore";
// import recordStore from "../stores/recordStore";

// const FeedbackPage: React.FC = observer(() => {
//   const recording = recordStore.recording;
//   const [started, setStarted] = useState(false);

//   useEffect(() => {
//     if (!recording || !recording.id || !recording.topicId || started) return;

//     setStarted(true); // כדי שלא ירוץ שוב

//     const run = async () => {
//       try {
//         if (recording.id) {
//           await feedbackStore.transcribeFromUrl(recording.url, recording.id);

//           await feedbackStore.analyzeTranscription(
//             feedbackStore.transcription,
//             recording.topicId,
//             recording.id
//           );
//         }
//         // אפשרות לשמירה בשרת (אם יש לך saveFeedback):
//         // await feedbackStore.saveFeedback(feedbackStore.feedback!);

//       } catch (err) {
//         console.error("שגיאה בתהליך הבאת המשוב", err);
//       }
//     };

//     run();
//   }, [recording, started]);

//   if (feedbackStore.loading) {
//     return <p>אנחנו מכינים עבורך משוב על ההקלטה שלך...</p>;
//   }

//   if (feedbackStore.error) {
//     return <p>שגיאה: {feedbackStore.error}</p>;
//   }

//   if (!feedbackStore.feedback) {
//     return <p>לא התקבל משוב</p>;
//   }

//   const f = feedbackStore.feedback;

//   return (
//     <div>
//       <p>משוב כללי: {f.generalFeedback}</p>
//       <p>ציון כולל: {f.score}</p>
//       <p>דקדוק - ציון: {f.grammarScore} | הערה: {f.grammarComment}</p>
//       <p>שטף דיבור - ציון: {f.fluencyScore} | הערה: {f.fluencyComment}</p>
//       <p>אוצר מילים - ציון: {f.vocabularyScore} | הערה: {f.vocabularyComment}</p>
//       <p>מילים נדרשות: {f.totalWordsRequired}</p>
//       <p>מילים שבאמת השתמשת: {f.usedWordsCount}</p>
//       <p>הוקלט ב: {f.givenAt}</p>

//       <hr />

//       <p>תמלול ההקלטה:</p>
//       <p>{feedbackStore.transcription}</p>
//     </div>
//   );
// });

// export default FeedbackPage;

// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import { observer } from "mobx-react-lite"
// import { feedbackStore } from "../stores/feedbackStore"
// import recordStore from "../stores/recordStore"
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   LinearProgress,
//   Chip,
//   Grid,
//   Paper,
//   CircularProgress,
//   Fade,
//   Slide,
//   Zoom,
//   Avatar,
// } from "@mui/material"
// import { School, Psychology, RecordVoiceOver, MenuBook, Star, CheckCircle, AccessTime } from "@mui/icons-material"
// import '../css/feedbackPage.css'

// const FeedbackPage: React.FC = observer(() => {
//   const recording = recordStore.recording
//   const [started, setStarted] = useState(false)

//   useEffect(() => {
//     if (!recording || !recording.id || !recording.topicId || started) return

//     setStarted(true)

//     const run = async () => {
//       try {
//         if (recording.id) {
//           await feedbackStore.transcribeFromUrl(recording.url, recording.id)

//           await feedbackStore.analyzeTranscription(feedbackStore.transcription, recording.topicId, recording.id)
//         }
//       } catch (err) {
//         console.error("שגיאה בתהליך הבאת המשוב", err)
//       }
//     }

//     run()
//   }, [recording, started])

//   const getScoreColor = (score: number) => {
//     if (score >= 80) return "#4caf50"
//     if (score >= 60) return "#ff9800"
//     return "#f44336"
//   }

//   const getScoreIcon = (score: number) => {
//     if (score >= 80) return "🌟"
//     if (score >= 60) return "👍"
//     return "💪"
//   }

//   if (feedbackStore.loading) {
//     return (
//       <Box className="loading-container">
//         <Fade in={true} timeout={800}>
//           <Box className="loading-content">
//             <Box className="loading-animation">
//               <CircularProgress size={80} thickness={4} className="loading-spinner" />
//               <Box className="loading-pulse"></Box>
//             </Box>
//             <Typography variant="h5" className="loading-text">
//               אנחנו מכינים עבורך משוב על ההקלטה שלך...
//             </Typography>
//             <Typography variant="body1" className="loading-subtext">
//               זה יקח רק כמה שניות ⏰
//             </Typography>
//           </Box>
//         </Fade>
//       </Box>
//     )
//   }

//   if (feedbackStore.error) {
//     return (
//       <Fade in={true}>
//         <Box className="error-container">
//           <Card className="error-card">
//             <CardContent>
//               <Typography variant="h6" color="error">
//                 שגיאה: {feedbackStore.error}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Box>
//       </Fade>
//     )
//   }

//   if (!feedbackStore.feedback) {
//     return (
//       <Fade in={true}>
//         <Box className="no-feedback-container">
//           <Typography variant="h6">לא התקבל משוב</Typography>
//         </Box>
//       </Fade>
//     )
//   }

//   const f = feedbackStore.feedback

//   return (
//     <Box className="feedback-container">
//       <Fade in={true} timeout={1000}>
//         <Box>
//           {/* Header Card */}
//           <Slide direction="down" in={true} timeout={800}>
//             <Card className="header-card">
//               <CardContent>
//                 <Box className="header-content">
//                   <Avatar className="header-avatar">
//                     <Star />
//                   </Avatar>
//                   <Box>
//                     <Typography variant="h4" className="header-title">
//                       המשוב שלך מוכן! 🎉
//                     </Typography>
//                     <Typography variant="h6" className="header-subtitle">
//                       ציון כולל: {f.score}/100
//                     </Typography>
//                   </Box>
//                   <Box className="score-circle">
//                     <CircularProgress
//                       variant="determinate"
//                       value={f.score}
//                       size={80}
//                       thickness={6}
//                       className="score-progress"
//                       style={{ color: getScoreColor(f.score) }}
//                     />
//                     <Box className="score-text">
//                       <Typography variant="h6">{f.score}</Typography>
//                     </Box>
//                   </Box>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Slide>

//           {/* General Feedback */}
//           <Zoom in={true} timeout={1000} style={{ transitionDelay: "200ms" }}>
//             <Card className="general-feedback-card">
//               <CardContent>
//                 <Box className="feedback-header">
//                   <Psychology className="feedback-icon" />
//                   <Typography variant="h5">משוב כללי</Typography>
//                 </Box>
//                 <Typography variant="body1" className="general-feedback-text">
//                   {f.generalFeedback}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Zoom>

//           {/* Scores Grid */}
//           <Grid container spacing={3} className="scores-grid">
//             <Grid item xs={12} md={4}>
//               <Zoom in={true} timeout={1000} style={{ transitionDelay: "400ms" }}>
//                 <Card className="score-card grammar-card">
//                   <CardContent>
//                     <Box className="score-header">
//                       <School className="score-icon" />
//                       <Typography variant="h6">דקדוק</Typography>
//                       <Chip
//                         label={`${f.grammarScore}/100`}
//                         className="score-chip"
//                         style={{ backgroundColor: getScoreColor(f.grammarScore) }}
//                       />
//                     </Box>
//                     <LinearProgress
//                       variant="determinate"
//                       value={f.grammarScore}
//                       className="score-progress-bar"
//                       style={{ color: getScoreColor(f.grammarScore) }}
//                     />
//                     <Typography variant="body2" className="score-comment">
//                       {f.grammarComment}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Zoom>
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <Zoom in={true} timeout={1000} style={{ transitionDelay: "600ms" }}>
//                 <Card className="score-card fluency-card">
//                   <CardContent>
//                     <Box className="score-header">
//                       <RecordVoiceOver className="score-icon" />
//                       <Typography variant="h6">שטף דיבור</Typography>
//                       <Chip
//                         label={`${f.fluencyScore}/100`}
//                         className="score-chip"
//                         style={{ backgroundColor: getScoreColor(f.fluencyScore) }}
//                       />
//                     </Box>
//                     <LinearProgress
//                       variant="determinate"
//                       value={f.fluencyScore}
//                       className="score-progress-bar"
//                       style={{ color: getScoreColor(f.fluencyScore) }}
//                     />
//                     <Typography variant="body2" className="score-comment">
//                       {f.fluencyComment}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Zoom>
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <Zoom in={true} timeout={1000} style={{ transitionDelay: "800ms" }}>
//                 <Card className="score-card vocabulary-card">
//                   <CardContent>
//                     <Box className="score-header">
//                       <MenuBook className="score-icon" />
//                       <Typography variant="h6">אוצר מילים</Typography>
//                       <Chip
//                         label={`${f.vocabularyScore}/100`}
//                         className="score-chip"
//                         style={{ backgroundColor: getScoreColor(f.vocabularyScore) }}
//                       />
//                     </Box>
//                     <LinearProgress
//                       variant="determinate"
//                       value={f.vocabularyScore}
//                       className="score-progress-bar"
//                       style={{ color: getScoreColor(f.vocabularyScore) }}
//                     />
//                     <Typography variant="body2" className="score-comment">
//                       {f.vocabularyComment}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Zoom>
//             </Grid>
//           </Grid>

//           {/* Statistics */}
//           <Slide direction="up" in={true} timeout={1000} style={{ transitionDelay: "1000ms" }}>
//             <Card className="statistics-card">
//               <CardContent>
//                 <Typography variant="h5" className="statistics-title">
//                   סטטיסטיקות ההקלטה
//                 </Typography>
//                 <Grid container spacing={3}>
//                   <Grid item xs={12} sm={6}>
//                     <Box className="stat-item">
//                       <CheckCircle className="stat-icon" />
//                       <Box>
//                         <Typography variant="h6">{f.usedWordsCount}</Typography>
//                         <Typography variant="body2">מילים שהשתמשת בהן</Typography>
//                       </Box>
//                     </Box>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Box className="stat-item">
//                       <MenuBook className="stat-icon" />
//                       <Box>
//                         <Typography variant="h6">{f.totalWordsRequired}</Typography>
//                         <Typography variant="body2">מילים נדרשות</Typography>
//                       </Box>
//                     </Box>
//                   </Grid>
//                 </Grid>
//                 <Box className="completion-rate">
//                   <Typography variant="body1">
//                     שיעור השלמה: {Math.round((f.usedWordsCount / f.totalWordsRequired) * 100)}%
//                   </Typography>
//                   <LinearProgress
//                     variant="determinate"
//                     value={(f.usedWordsCount / f.totalWordsRequired) * 100}
//                     className="completion-progress"
//                   />
//                 </Box>
//               </CardContent>
//             </Card>
//           </Slide>

//           {/* Transcription */}
//           <Fade in={true} timeout={1000} style={{ transitionDelay: "1200ms" }}>
//             <Card className="transcription-card">
//               <CardContent>
//                 <Box className="transcription-header">
//                   <RecordVoiceOver className="transcription-icon" />
//                   <Typography variant="h5">תמלול ההקלטה</Typography>
//                 </Box>
//                 <Paper className="transcription-content">
//                   <Typography variant="body1" className="transcription-text">
//                     {feedbackStore.transcription}
//                   </Typography>
//                 </Paper>
//                 <Box className="timestamp">
//                   <AccessTime className="timestamp-icon" />
//                   <Typography variant="caption">הוקלט ב: {new Date(f.givenAt).toLocaleString("he-IL")}</Typography>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Fade>
//         </Box>
//       </Fade>
//     </Box>
//   )
// })

// export default FeedbackPage

//gpt
// import React, { useEffect, useState } from "react";
// import { observer } from "mobx-react-lite";
// import { feedbackStore } from "../stores/feedbackStore";
// import recordStore from "../stores/recordStore";
// import {
//   Box,
//   CircularProgress,
//   Typography,
//   Paper,
//   Fade,
//   Button,
//   IconButton,
//   Tooltip,
// } from "@mui/material";
// import ShareIcon from "@mui/icons-material/Share";
// import { styled, keyframes } from "@mui/system";

// // רקע אנימטיבי
// const pulseBackground = keyframes`
//   0% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
//   100% { background-position: 0% 50%; }
// `;

// const Background = styled(Box)({
//   minHeight: "100vh",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   background: "linear-gradient(-45deg, #1e3c72, #2a5298, #ff4e50, #f9d423)",
//   backgroundSize: "300% 300%",
//   animation: `${pulseBackground} 12s ease infinite`,
//   padding: "2rem",
//   direction: "rtl",
// });

// // אפקט הקלדה
// const Typing = ({ text }: { text: string }) => {
//   const [displayed, setDisplayed] = useState("");

//   useEffect(() => {
//     let i = 0;
//     const interval = setInterval(() => {
//       setDisplayed((prev) => prev + text[i]);
//       i++;
//       if (i >= text.length) clearInterval(interval);
//     }, 40);
//     return () => clearInterval(interval);
//   }, [text]);

//   return (
//     <Typography
//       variant="h5"
//       sx={{ color: "#fff", fontWeight: 500, textShadow: "0 0 6px #000" }}
//     >
//       {displayed}
//     </Typography>
//   );
// };

// // כרטיס משוב
// const FeedbackCard = styled(Paper)(({ theme }) => ({
//   padding: "2rem",
//   maxWidth: "800px",
//   background: "linear-gradient(145deg, #ffffff, #f1f1f1)",
//   boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
//   borderRadius: "20px",
// }));

// const FeedbackPage: React.FC = observer(() => {
//   const recording = recordStore.recording;
//   const [started, setStarted] = useState(false);
//   const [showCard, setShowCard] = useState(false);

//   useEffect(() => {
//     if (!recording || !recording.id || !recording.topicId || started) return;

//     setStarted(true);

//     const run = async () => {
//       try {
//         if (recording.id) {
//           await feedbackStore.transcribeFromUrl(recording.url, recording.id);
//           await feedbackStore.analyzeTranscription(
//             feedbackStore.transcription,
//             recording.topicId,
//             recording.id
//           );
//         }
//         setTimeout(() => setShowCard(true), 300); // מעבר חלק
//       } catch (err) {
//         console.error("שגיאה בתהליך הבאת המשוב", err);
//       }
//     };

//     run();
//   }, [recording, started]);

//   const f = feedbackStore.feedback;

//   return (
//     <Background>
//       {feedbackStore.loading && (
//         <Box textAlign="center">
//           <CircularProgress
//             size={80}
//             thickness={4}
//             sx={{ color: "#ff3c3c", mb: 3 }}
//           />
//           <Typing text="אנחנו מנתחים עבורך את ההקלטה..." />
//         </Box>
//       )}

//       {feedbackStore.error && (
//         <Typography color="error" variant="h6">
//           שגיאה: {feedbackStore.error}
//         </Typography>
//       )}

//       {!feedbackStore.loading && f && (
//         <Fade in={showCard} timeout={600}>
//           <FeedbackCard>
//             <Typography variant="h4" gutterBottom color="primary">
//               משוב אישי על ההקלטה
//             </Typography>

//             <Typography variant="subtitle1" gutterBottom>
//               משוב כללי: {f.generalFeedback}
//             </Typography>

//             <Typography>
//               🎯 <strong>ציון כולל:</strong> {f.score}
//             </Typography>
//             <Typography>
//               🧠 <strong>דקדוק:</strong> {f.grammarScore} | {f.grammarComment}
//             </Typography>
//             <Typography>
//               🔊 <strong>שטף דיבור:</strong> {f.fluencyScore} |{" "}
//               {f.fluencyComment}
//             </Typography>
//             <Typography>
//               💬 <strong>אוצר מילים:</strong> {f.vocabularyScore} |{" "}
//               {f.vocabularyComment}
//             </Typography>

//             <Typography>
//               📚 <strong>מילים נדרשות:</strong> {f.totalWordsRequired}
//             </Typography>
//             <Typography>
//               ✅ <strong>מילים בשימוש:</strong> {f.usedWordsCount}
//             </Typography>

//             <Typography sx={{ mt: 2, fontStyle: "italic", fontSize: "0.9rem" }}>
//               🕒 נשלח בתאריך: {f.givenAt}
//             </Typography>

//             <Box mt={3}>
//               <Typography variant="h6" gutterBottom>
//                 תמלול ההקלטה:
//               </Typography>
//               <Typography>{feedbackStore.transcription}</Typography>
//             </Box>

//             <Box mt={4} textAlign="left">
//               <Tooltip title="שיתוף המשוב">
//                 <IconButton
//                   onClick={() => {
//                     navigator.share?.({
//                       title: "LingoFlow Feedback",
//                       text: f.generalFeedback,
//                     });
//                   }}
//                   sx={{
//                     backgroundColor: "#1e88e5",
//                     color: "#fff",
//                     "&:hover": { backgroundColor: "#1565c0" },
//                     boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//                   }}
//                 >
//                   <ShareIcon />
//                 </IconButton>
//               </Tooltip>
//             </Box>
//           </FeedbackCard>
//         </Fade>
//       )}
//     </Background>
//   );
// });

// export default FeedbackPage;
