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
import { toJS } from "mobx";

const Feedback: React.FC = observer(() => {
  const navigate = useNavigate(); // השתמש ב-useNavigate מ-React Router
  const recording = toJS(recordStore.recording);

  useEffect(() => {
    const fetchAndProcessFeedback = async () => {
      console.log("▶️ התחלת תהליך המשוב");

      if (
        !recording ||
        recording.id === undefined ||
        recording.id === 0 ||
        !recording.url ||
        recording.topicId === undefined
      ) {
        console.warn("❌ נתוני הקלטה חסרים");
        navigate("/");
        return;
      }

      if (feedbackStore.feedback) {
        console.log("✔️ כבר קיים משוב - אין צורך לעבד שוב");
        return;
      }

      if (!feedbackStore.transcription) {
        await feedbackStore.transcribeFromUrl(recording.url, recording.id);
      }

      if (feedbackStore.transcription && !feedbackStore.feedback) {
        console.log("📄 תמלול שהתקבל מהשרת:", feedbackStore.transcription);
        await feedbackStore.analyzeTranscription(
          feedbackStore.transcription,
          Number(recording.topicId),
          recording.id
        );
      }
    };

    fetchAndProcessFeedback();

    return () => {
      feedbackStore.reset(); // מאפס בין יציאות
    };
  }, [recording?.id]);

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