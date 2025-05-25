// import { useEffect, useState } from "react";
// import recordStore from "../stores/recordStore";
// import userStore from "../stores/userStore";
// import { Record } from "../models/record";

// import {
//   Box,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   Typography,
//   Paper,
//   Stack,
// } from "@mui/material";

// const GetRecords = () => {
//   const [records, setRecords] = useState<Record[]>([]);
//   const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
//   const userId = userStore.user?.id;

//   const deleteRecord = (id: any) => {
//     recordStore.deleteRecordFromDB(id);
//     setRecords(records.filter((r) => r.id !== id));
//     if (selectedUrl && records.find((r) => r.url === selectedUrl)?.id === id) {
//       setSelectedUrl(null);
//     }
//   };

//   useEffect(() => {
//     if (!userId) return;

//     recordStore
//       .getRecordsByUserId(userId)
//       .then((fetchedRecords) => {
//         setRecords(fetchedRecords);
//       })
//       .catch((error) => {
//         console.error("Error getting records:", error);
//       });
//   }, [userId]);

//   return (
//     <Box
//       sx={{
//         width:"60%",
//         margin: "40px auto",
//         padding: 3,
//         bgcolor: "background.paper",
//         borderRadius: 3,
//         boxShadow: 3,
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         textAlign: "center",
//       }}
//     >
//       <Typography variant="h4" gutterBottom>
//         ההקלטות שלך
//       </Typography>

//       {records.length > 0 ? (
//         <List sx={{ width: "50%" }}>
//           {records.map((record) => (
//             <Paper
//               key={record.id}
//               sx={{ mb: 2, p: 2, display: "flex", alignItems: "center" }}
//               elevation={4}
//             >
//               <Box sx={{ flexGrow: 1, textAlign: "left" }}>
//                 <Typography variant="h6">{record.name}</Typography>
//                 <Typography variant="body2" color="text.secondary">
//                  {record.date}
//                 </Typography>
//               </Box>
//               <Stack direction="row" spacing={1}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={() => setSelectedUrl(record.url)}
//                   sx={{ minWidth: 120 }}
//                 >
//                   הצג הקלטה
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="error"
//                   onClick={() => deleteRecord(record.id)}
//                   sx={{ minWidth: 100 }}
//                 >
//                   מחק
//                 </Button>
//               </Stack>
//             </Paper>
//           ))}
//         </List>
//       ) : (
//         <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
//           אין רשומות להצגה
//         </Typography>
//       )}

//       {selectedUrl && (
//         <Box
//           sx={{
//             mt: 4,
//             width: "48%",
//             bgcolor: "#fafafa",
//             p: 2,
//             borderRadius: 2,
//             boxShadow: 1,
//           }}
//         >
//           <audio
//             controls
//             src={selectedUrl}
//             style={{ width: "100%", outline: "none" }}
//           />
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default GetRecords;


//gemini1:
import { useEffect, useState, useRef } from "react";
import recordStore from "../stores/recordStore";
import userStore from "../stores/userStore";
import { Record } from "../models/record"; // וודא ש-Record.id הוא מסוג number
import Swal from "sweetalert2";

import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Stack,
  Collapse,
  IconButton,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteIcon from "@mui/icons-material/Delete";
import PauseIcon from "@mui/icons-material/Pause";

// קומפוננטת אנימציית העיגולים
const CircleAnimation = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50px",
      gap: "8px",
      "& .circle": {
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        bgcolor: "primary.main",
        animation: "scalePulse 1.2s infinite ease-in-out",
      },
      "& .circle:nth-of-type(2)": {
        animationDelay: "0.2s",
      },
      "& .circle:nth-of-type(3)": {
        animationDelay: "0.4s",
      },
      "@keyframes scalePulse": {
        "0%, 100%": { transform: "scale(0.8)" },
        "50%": { transform: "scale(1.2)" },
      },
    }}
  >
    <Box className="circle" />
    <Box className="circle" />
    <Box className="circle" />
  </Box>
);

const GetRecords = () => {
  const [records, setRecords] = useState<Record[]>([]);
  // שיניתי את הסוג ל-number | null מכיוון ש-ID הוא מספר
  const [playingRecordId, setPlayingRecordId] = useState<number | null>(null);
  // שיניתי את הסוג ל-number | undefined מכיוון ש-userStore.user?.id יכול להיות undefined
  const userId = userStore.user?.id;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // פונקציה לקיבוץ הקלטות לפי נושא
  const groupRecordsByTopic = (recordsToGroup: Record[]) => {
    const grouped: { [key: string]: Record[] } = {};
    recordsToGroup.forEach((record) => {
      // ודא שקיים שדה topic במודל Record, אם לא, תחליט מה יהיה נושא ברירת המחדל
      const topic = record.topicName || "ללא נושא";
      if (!grouped[topic]) {
        grouped[topic] = [];
      }
      grouped[topic].push(record);
    });
    return grouped;
  };

  const groupedRecords = groupRecordsByTopic(records);

  // שיניתי את הסוג של recordToDeleteId ל-number
  const handleDeleteRecord = async (recordToDeleteId: number) => {
    const result = await Swal.fire({
      title: "האם אתה בטוח?",
      text: "הקלטה זו תימחק לצמיתות ולא ניתן יהיה לשחזר אותה!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "כן, מחק אותה!",
      cancelButtonText: "בטל",
    });

    if (result.isConfirmed) {
      try {
        await recordStore.deleteRecordFromDB(recordToDeleteId);
        setRecords((prevRecords) =>
          prevRecords.filter((r) => r.id !== recordToDeleteId)
        );
        // השוואה נכונה של ID מסוג number
        if (playingRecordId === recordToDeleteId) {
          setPlayingRecordId(null);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
          }
        }
        Swal.fire("נמחק!", "ההקלטה נמחקה בהצלחה.", "success");
      } catch (error) {
        console.error("Error deleting record:", error);
        Swal.fire("שגיאה!", "אירעה שגיאה בעת מחיקת ההקלטה.", "error");
      }
    }
  };

  const handlePlayPause = (record: Record) => {
    // השוואה נכונה של ID מסוג number
    if (playingRecordId === record.id) {
      setPlayingRecordId(null);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setPlayingRecordId(record.id);
      if (audioRef.current) {
        audioRef.current.src = record.url;
        audioRef.current
          .play()
          .catch((e) => console.error("Error playing audio:", e));
      }
    }
  };

  useEffect(() => {
    // ודא ש-userId הוא מספר לפני ששולפים רשומות
    if (typeof userId !== "number") return;

    recordStore
      .getRecordsByUserId(userId)
      .then((fetchedRecords) => {
        setRecords(fetchedRecords);
      })
      .catch((error) => {
        console.error("Error getting records:", error);
      });
  }, [userId]);

  // useEffect לטיפול באירועי סיום ניגון
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => {
        setPlayingRecordId(null);
      };
      audio.addEventListener("ended", handleEnded);
      return () => {
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioRef.current]);

  return (
    <Box
      sx={{
        width: "80%",
        margin: "40px auto",
        padding: 4,
        bgcolor: "background.paper",
        borderRadius: 4,
        boxShadow: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ mb: 4, color: "primary.dark", fontWeight: "bold" }}
      >
        ההקלטות שלך
      </Typography>

      {Object.keys(groupedRecords).length > 0 ? (
        <Box sx={{ width: "100%" }}>
          {Object.entries(groupedRecords).map(([topic, recordsInTopic]) => (
            <Box key={topic} sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  color: "secondary.main",
                  textAlign: "right",
                  borderBottom: "2px solid",
                  borderColor: "secondary.light",
                  pb: 1,
                }}
              >
                {topic}
              </Typography>
              <List sx={{ width: "100%", p: 0 }}>
                {recordsInTopic.map((record) => (
                  <Paper
                    // מפתח key צריך להיות ייחודי וניתן לרינדור, ID הוא מספר תקין
                    key={record.id}
                    sx={{
                      mb: 2,
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      elevation: 4,
                      borderRadius: 2,
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 8,
                      },
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Box sx={{ flexGrow: 1, textAlign: "right" }}>
                      <Typography
                        variant="h6"
                        sx={{ color: "text.primary", fontWeight: "medium" }}
                      >
                        {record.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {record.date}
                      </Typography>
                    </Box>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        opacity: { xs: 1, md: 0 },
                        transition: "opacity 0.3s ease-in-out",
                        position: "absolute",
                        right: 16,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 1,
                        "@media (hover: hover)": {
                          "&:hover, .MuiPaper-root:hover &": {
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      <IconButton
                        color="primary"
                        aria-label={
                          playingRecordId === record.id
                            ? "השהה הקלטה"
                            : "השמע הקלטה"
                        }
                        onClick={() => handlePlayPause(record)}
                        sx={{
                          p: 1.5,
                          bgcolor: "primary.light",
                          "&:hover": { bgcolor: "primary.main" },
                        }}
                      >
                        {playingRecordId === record.id ? (
                          <PauseIcon sx={{ fontSize: 28 }} />
                        ) : (
                          <PlayArrowIcon sx={{ fontSize: 28 }} />
                        )}
                      </IconButton>

                      <IconButton
                        color="error"
                        aria-label="מחק הקלטה"
                        onClick={() => handleDeleteRecord(record.id)}
                        sx={{
                          p: 1.5,
                          bgcolor: "error.light",
                          "&:hover": { bgcolor: "error.main" },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 28 }} />
                      </IconButton>
                    </Stack>
                  </Paper>
                ))}
              </List>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            mt: 4,
            p: 3,
            border: "1px dashed",
            borderColor: "grey.400",
            borderRadius: 2,
          }}
        >
          אין עדיין הקלטות להצגה. התחל להקליט משהו חדש!
        </Typography>
      )}

      <Collapse
        in={!!playingRecordId}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {playingRecordId && (
          <Box
            sx={{
              mt: 4,
              width: "100%",
              maxWidth: 600,
              bgcolor: "#e3f2fd",
              p: 3,
              borderRadius: 3,
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
              מנגן כעת: {records.find((r) => r.id === playingRecordId)?.name}
            </Typography>
            <audio
              ref={audioRef}
              controls
              src={records.find((r) => r.id === playingRecordId)?.url}
              style={{ width: "100%", outline: "none", filter: "contrast(1.1)" }}
              onEnded={() => setPlayingRecordId(null)}
            />
            <CircleAnimation />
          </Box>
        )}
      </Collapse>
    </Box>
  );
};

export default GetRecords;

// //gemini2:
// import { useEffect, useState, useRef } from "react";
// import recordStore from "../stores/recordStore";
// import userStore from "../stores/userStore";
// import { Record } from "../models/record"; // וודא ש-Record.id הוא מסוג number
// import Swal from "sweetalert2";

// import {
//     Box,
//     List,
//     Typography,
//     Paper,
//     Stack,
//     Collapse,
//     IconButton,
//     keyframes, // לייבוא keyframes מ-MUI ל-CSS-in-JS
// } from "@mui/material";
// import PlayArrowIcon from "@mui/icons-material/PlayArrow"; // אייקון משולש לפליי
// import DeleteIcon from "@mui/icons-material/Delete";
// import PauseIcon from "@mui/icons-material/Pause"; // אייקון להשהיה
// // import { DownloadIcon } from "lucide-react";
// import DownloadIcon from '@mui/icons-material/Download';
// import Button from '@mui/material/Button';

// // אנימציית הפולס של העיגולים
// const scalePulse = keyframes`
//   0%, 100% { transform: scale(0.8); opacity: 0.7; }
//   50% { transform: scale(1.2); opacity: 1; }
// `;

// // קומפוננטת אנימציית העיגולים כאשר הקלטה מתנגנת
// const CircleAnimation = () => (
//     <Box
//         sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "50px",
//             gap: "8px",
//             mt: 2, // רווח קטן מעל
//             "& .circle": {
//                 width: "14px", // עיגולים קצת יותר גדולים
//                 height: "14px",
//                 borderRadius: "50%",
//                 bgcolor: "#2196f3", // כחול של האפליקציה
//                 animation: `${scalePulse} 1.2s infinite ease-in-out`,
//             },
//             "& .circle:nth-of-type(2)": {
//                 animationDelay: "0.2s",
//             },
//             "& .circle:nth-of-type(3)": {
//                 animationDelay: "0.4s",
//             },
//         }}
//     >
//         <Box className="circle" />
//         <Box className="circle" />
//         <Box className="circle" />
//     </Box>
// );

// const GetRecords = () => {
//     const [records, setRecords] = useState<Record[]>([]);
//     // מזהה ההקלטה המושמעת, כעת מסוג number
//     const [playingRecordId, setPlayingRecordId] = useState<number | null>(null);
//     // userId יכול להיות undefined בהתחלה
//     const userId = userStore.user?.id;
//     // רפרנס לאלמנט האודיו שיישב ברקע
//     const audioRef = useRef<HTMLAudioElement | null>(null);

//     // פונקציה לקיבוץ הקלטות לפי נושא
//     const groupRecordsByTopic = (recordsToGroup: Record[]) => {
//         const grouped: { [key: string]: Record[] } = {};
//         recordsToGroup.forEach((record) => {
//             // ודא שקיים שדה 'topic' במודל Record, אם לא, תחליט מה יהיה נושא ברירת המחדל
//             const topic = record.topicName || "כללי"; // נושא ברירת מחדל
//             if (!grouped[topic]) {
//                 grouped[topic] = [];
//             }
//             grouped[topic].push(record);
//         });
//         return grouped;
//     };

//     const groupedRecords = groupRecordsByTopic(records);

//     // פונקציה למחיקת הקלטה עם אישור SweetAlert2
//     const handleDeleteRecord = async (recordToDeleteId: number) => {
//         const result = await Swal.fire({
//             title: "האם אתה בטוח שברצונך למחוק?",
//             text: "הקלטה זו תימחק לצמיתות ולא ניתן יהיה לשחזר אותה!",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#d32f2f", // אדום עמוק
//             cancelButtonColor: "#1976d2", // כחול
//             confirmButtonText: "כן, מחק אותה!",
//             cancelButtonText: "בטל",
//             customClass: {
//                 popup: 'swal2-popup-rtl' // תמיכה בעברית ב-SweetAlert2
//             },
//         });

//         if (result.isConfirmed) {
//             try {
//                 await recordStore.deleteRecordFromDB(recordToDeleteId);
//                 setRecords((prevRecords) =>
//                     prevRecords.filter((r) => r.id !== recordToDeleteId)
//                 );
//                 // אם מוחקים את ההקלטה שמתנגנת, עוצרים את הניגון
//                 if (playingRecordId === recordToDeleteId) {
//                     setPlayingRecordId(null);
//                     if (audioRef.current) {
//                         audioRef.current.pause();
//                         audioRef.current.src = ""; // מנקה את ה-src
//                     }
//                 }
//                 Swal.fire({
//                     title: "נמחק!",
//                     text: "ההקלטה נמחקה בהצלחה.",
//                     icon: "success",
//                     confirmButtonColor: "#1976d2",
//                     customClass: {
//                         popup: 'swal2-popup-rtl'
//                     },
//                 });
//             } catch (error) {
//                 console.error("Error deleting record:", error);
//                 Swal.fire({
//                     title: "שגיאה!",
//                     text: "אירעה שגיאה בעת מחיקת ההקלטה.",
//                     icon: "error",
//                     confirmButtonColor: "#1976d2",
//                     customClass: {
//                         popup: 'swal2-popup-rtl'
//                     },
//                 });
//             }
//         }
//     };

//     // פונקציה להשמעת/השהיית הקלטה
//     const handlePlayPause = (record: Record) => {
//         if (!audioRef.current) return; // וודא שהרפרנס קיים לפני פעולה

//         if (playingRecordId === record.id) {
//             // אם זו ההקלטה שכבר מתנגנת, עוצרים אותה
//             audioRef.current.pause();
//             setPlayingRecordId(null);
//         } else {
//             // מפעילים הקלטה חדשה
//             // וודא שה-URL קיים לפני הניגון
//             if (record.url) {
//                 audioRef.current.src = record.url;
//                 audioRef.current.play().catch((e) => {
//                     console.error("Error playing audio:", e);
//                     // אם יש שגיאת נגינה, נאפס את ה-playingRecordId
//                     setPlayingRecordId(null);
//                 });
//                 setPlayingRecordId(record.id);
//             } else {
//                 console.warn("Record URL is missing, cannot play audio.");
//                 setPlayingRecordId(null); // גם כאן, אם חסר URL, נאפס
//             }
//         }
//     };

//     // שליפת הקלטות עם טעינת הקומפוננטה
//     useEffect(() => {
//         if (typeof userId !== "number") return; // לוודא ש-userId הוא מספר

//         recordStore
//             .getRecordsByUserId(userId)
//             .then((fetchedRecords) => {
//                 setRecords(fetchedRecords);
//                 setPlayingRecordId(null); // וודא שאין הקלטה מנוגנת עם טעינה
//             })
//             .catch((error) => {
//                 console.error("Error getting records:", error);
//             });
//     }, [userId]);

//     // useEffect לטיפול באירועי סיום ניגון
//     useEffect(() => {
//         const audio = audioRef.current;
//         if (audio) {
//             const handleEnded = () => {
//                 setPlayingRecordId(null); // כשנגמר השיר, מאפסים את ה-playingRecordId
//             };
//             audio.addEventListener("ended", handleEnded);
//             return () => {
//                 audio.removeEventListener("ended", handleEnded);
//             };
//         }
//     }, [audioRef.current]);
//     // const Download = (url:string,name:string) => {
//     //     if (!url) return
    
//     //     const a = document.createElement("a")
//     //     a.href = url
//     //     a.download = `${name|| "recording"}.mp3`
//     //     document.body.appendChild(a)
//     //     a.click()
//     //     document.body.removeChild(a)
//     //   }
//     const Download = (url: string, name: string) => {
//         if (!url) return;
    
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = name || "recording.mp3"; // ודא שהשם נכון
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//     };
    
    
//     // קריאה לפונקציה
//     // Download('your_audio_url.mp3', 'my_audio_file');
    
//     return (
//         <Box
//             sx={{
//                 width: "90%", // רוחב רחב יותר
//                 maxWidth: 1000, // רוחב מקסימלי כדי שלא יהיה רחב מדי במסכים גדולים
//                 margin: "40px auto",
//                 padding: 4,
//                 bgcolor: "#e3f2fd", // רקע כחול בהיר מאוד
//                 borderRadius: 4,
//                 boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)", // צל עדין וברור
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 textAlign: "center",
//                 direction: "rtl", // תמיכה בעברית
//             }}
//         >
//             <Typography
//                 variant="h3"
//                 component="h1"
//                 gutterBottom
//                 sx={{
//                     mb: 4,
//                     color: "#1976d2", // כחול עמוק לכותרת
//                     fontWeight: "bold",
//                     textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
//                 }}
//             >
//                 ההקלטות שלי
//             </Typography>

//             {Object.keys(groupedRecords).length > 0 ? (
//                 <Box sx={{ width: "100%" }}>
//                     {Object.entries(groupedRecords).map(([topic, recordsInTopic]) => (
//                         <Box key={topic} sx={{ mb: 4 }}>
//                             <Typography
//                                 variant="h5"
//                                 sx={{
//                                     mb: 2,
//                                     color: "#d32f2f", // אדום לנושאים
//                                     textAlign: "right",
//                                     borderBottom: "2px solid",
//                                     borderColor: "#ef5350", // אדום בהיר לקו תחתון
//                                     pb: 1,
//                                     fontWeight: "bold",
//                                     pr: 1, // ריפוד ימינה
//                                 }}
//                             >
//                                 {topic}
//                             </Typography>
//                             <List sx={{ width: "100%", p: 0 }}>
//                                 {recordsInTopic.map((record) => (
//                                     <Paper
//                                         key={record.id} // ID הוא מספר, ומתאים ל-key
//                                         sx={{
//                                             mb: 2,
//                                             p: 2,
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "space-between",
//                                             elevation: 4,
//                                             borderRadius: 2,
//                                             transition: "all 0.3s ease-in-out",
//                                             position: "relative",
//                                             overflow: "hidden",
//                                             bgcolor: "#ffffff", // רקע לבן לכרטיס
//                                             border: "1px solid #bbdefb", // מסגרת כחולה בהירה
//                                             "&:hover": {
//                                                 transform: "translateY(-5px)",
//                                                 boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
//                                             },
//                                         }}
//                                     >
//                                         {/* אייקון הפליי המופיע בריחוף */}
//                                         <IconButton
//                                             color="primary"
//                                             aria-label={
//                                                 playingRecordId === record.id
//                                                     ? "השהה הקלטה"
//                                                     : "השמע הקלטה"
//                                             }
//                                             onClick={() => handlePlayPause(record)}
//                                             sx={{
//                                                 position: "absolute",
//                                                 left: 16, // מיקום משמאל
//                                                 top: "50%",
//                                                 transform: "translateY(-50%)",
//                                                 bgcolor: "#2196f3", // כחול חזק
//                                                 color: "white",
//                                                 opacity: { xs: 1, md: 0 }, // תמיד גלוי במובייל, בריחוף בדסקטופ
//                                                 transition: "opacity 0.3s ease-in-out",
//                                                 "&:hover": {
//                                                     bgcolor: "#1976d2", // כחול כהה יותר בריחוף
//                                                     transform: "translateY(-50%) scale(1.1)",
//                                                 },
//                                                 "& .MuiPaper-root:hover &": {
//                                                     opacity: 1, // מופיע בריחוף על ה-Paper
//                                                 },
//                                                 width: 50, // גודל כפתור גדול יותר
//                                                 height: 50,
//                                             }}
//                                         >
//                                             {playingRecordId === record.id ? (
//                                                 <PauseIcon sx={{ fontSize: 30 }} />
//                                             ) : (
//                                                 <PlayArrowIcon sx={{ fontSize: 30 }} />
//                                             )}
//                                         </IconButton>

//                                         <Box sx={{ flexGrow: 1, textAlign: "right", pr: 8, pl: 2 }}>
//                                             {" "}
//                                             {/* ריפוד כדי למנוע חפיפה עם כפתור הפליי */}
//                                             <Typography
//                                                 variant="h6"
//                                                 sx={{ color: "#424242", fontWeight: "600" }}
//                                             >
//                                                 {record.name}
//                                             </Typography>
//                                             <Typography variant="body2" color="text.secondary">
//                                                 {record.date}
//                                             </Typography>
//                                         </Box>

//                                         {/* כפתור המחיקה - תמיד גלוי */}
//                                         <IconButton
//                                             color="error"
//                                             aria-label="מחק הקלטה"
//                                             onClick={() => handleDeleteRecord(record.id)}
//                                             sx={{
//                                                 p: 1.5,
//                                                 bgcolor: "#ef5350", // אדום
//                                                 color: "white",
//                                                 "&:hover": { bgcolor: "#d32f2f" }, // אדום עמוק יותר בריחוף
//                                                 width: 50, // גודל כפתור
//                                                 height: 50,
//                                             }}
//                                         >
//                                             <DeleteIcon sx={{ fontSize: 28 }} />
//                                         </IconButton>
//                                         {/* כפתור הורדה */}
//                                         <Button onClick={() => Download(record.url,record.name)} 
//                                             // variant="outlined"
//                                             // color="secondary"
//                                             // component="a"
//                                             // href={record.url}
//                                             // download={`${record.name}.mp3`}
//                                             // startIcon={<DownloadIcon />}
//                                         >
//                                             <DownloadIcon />
//                                         </Button>
//                                     </Paper>
//                                 ))}
//                             </List>
//                         </Box>
//                     ))}
//                 </Box>
//             ) : (
//                 <Typography
//                     variant="h6"
//                     color="text.secondary"
//                     sx={{
//                         mt: 4,
//                         p: 3,
//                         border: "1px dashed #90caf9", // מסגרת מקווקוות כחולה
//                         borderRadius: 2,
//                         bgcolor: "#f0f8ff", // רקע בהיר יותר
//                     }}
//                 >
//                     אין עדיין הקלטות להצגה. התחל להקליט משהו חדש!
//                 </Typography>
//             )}

//             {/* אנימציית העיגולים המופיעה רק כשיש ניגון */}
//             <Collapse
//                 in={!!playingRecordId} // יופיע רק אם יש playingRecordId (מספר)
//                 sx={{
//                     width: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     mt: 4,
//                 }}
//             >
//                 {playingRecordId && ( // וודא שיש playingRecordId לפני הרינדור הפנימי
//                     <Box
//                         sx={{
//                             display: "flex",
//                             flexDirection: "column",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             p: 2,
//                             bgcolor: "#bbdefb", // רקע כחול בהיר
//                             borderRadius: 3,
//                             boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
//                             width: "100%",
//                             maxWidth: 400, // רוחב מקסימלי לאנימציה
//                         }}
//                     >
//                         <Typography variant="subtitle1" color="#1976d2" sx={{ mb: 1, fontWeight: "bold" }}>
//                             מנגן כעת: {records.find((r) => r.id === playingRecordId)?.name}
//                         </Typography>
//                         <CircleAnimation />
//                     </Box>
//                 )}
//             </Collapse>

//             {/* נגן האודיו בפועל, מוסתר אך עובד */}
//             <audio
//                 ref={audioRef}
//                 // ה-src יקבל את ה-URL רק כאשר playingRecordId מוגדר
//                 src={records.find((r) => r.id === playingRecordId)?.url || ""}
//                 onEnded={() => setPlayingRecordId(null)} // כשההקלטה נגמרת, נאפס את ה-state
//                 hidden // נגן האודיו מוסתר מהתצוגה
//             />
//         </Box>
//     );
// };

// export default GetRecords;
// //GPT
// import { useEffect, useState } from "react";
// import recordStore from "../stores/recordStore";
// import userStore from "../stores/userStore";
// import { Record } from "../models/record";

// import {
//   Box,
//   Button,
//   List,
//   ListItem,
//   Typography,
//   Paper,
//   Stack,
//   Dialog,
//   DialogTitle,
//   DialogActions,
//   Tooltip,
//   IconButton,
// } from "@mui/material";
// import { Delete, PlayArrow } from "@mui/icons-material";

// import "../css/recordingStyle.css"

// const GetRecords = () => {
//   const [records, setRecords] = useState<Record[]>([]);
//   const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
//   const [playAnimationId, setPlayAnimationId] = useState<number | null>(null);
//   const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
//   const userId = userStore.user?.id;

//   const fetchRecords = () => {
//     if (!userId) return;
//     recordStore
//       .getRecordsByUserId(userId)
//       .then((fetchedRecords) => {
//         setRecords(fetchedRecords);
//       })
//       .catch((error) => {
//         console.error("Error getting records:", error);
//       });
//   };

//   useEffect(() => {
//     fetchRecords();
//   }, [userId]);

//   const confirmDelete = (id: number) => {
//     setConfirmDeleteId(id);
//   };

//   const handleDelete = () => {
//     if (confirmDeleteId !== null) {
//       recordStore.deleteRecordFromDB(confirmDeleteId);
//       setRecords(records.filter((r) => r.id !== confirmDeleteId));
//       if (
//         selectedUrl &&
//         records.find((r) => r.url === selectedUrl)?.id === confirmDeleteId
//       ) {
//         setSelectedUrl(null);
//       }
//       setConfirmDeleteId(null);
//     }
//   };

//   const handlePlay = (url: string, id: number) => {
//     setSelectedUrl(url);
//     setPlayAnimationId(id);
//   };

//   return (
//     <Box
//       sx={{
//         width: "80%",
//         margin: "40px auto",
//         padding: 3,
//         bgcolor: "background.paper",
//         borderRadius: 3,
//         boxShadow: 3,
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//       }}
//     >
//       <Typography variant="h4" gutterBottom>
//         ההקלטות שלך
//       </Typography>

//       {records.length > 0 ? (
//         <List sx={{ width: "100%" }}>
//           {records.map((record) => (
//             <Paper
//               key={record.id}
//               elevation={4}
//               className="record-item"
//               onMouseLeave={() => setPlayAnimationId(null)}
//             >
//               <Box className="record-content">
//                 <Box>
//                   <Typography variant="h6">{record.name}</Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {record.date} - {record.topicName ?? "ללא נושא"}
//                   </Typography>
//                 </Box>
//                 <Box className="record-actions">
//                   <Tooltip title="השמע הקלטה">
//                     <IconButton onClick={() => handlePlay(record.url, record.id)}>
//                       <PlayArrow />
//                     </IconButton>
//                   </Tooltip>
//                   <Tooltip title="מחק הקלטה">
//                     <IconButton onClick={() => confirmDelete(record.id)} color="error">
//                       <Delete />
//                     </IconButton>
//                   </Tooltip>
//                 </Box>
//               </Box>
//               {playAnimationId === record.id && (
//                 <Box className="wave-animation"></Box>
//               )}
//             </Paper>
//           ))}
//         </List>
//       ) : (
//         <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
//           אין רשומות להצגה
//         </Typography>
//       )}

//       {selectedUrl && (
//         <Box sx={{ mt: 4, width: "60%" }}>
//           <audio
//             controls
//             src={selectedUrl}
//             style={{ width: "100%", outline: "none" }}
//             autoPlay
//           />
//         </Box>
//       )}

//       <Dialog
//         open={confirmDeleteId !== null}
//         onClose={() => setConfirmDeleteId(null)}
//       >
//         <DialogTitle>האם אתה בטוח שברצונך למחוק את ההקלטה?</DialogTitle>
//         <DialogActions>
//           <Button onClick={() => setConfirmDeleteId(null)}>ביטול</Button>
//           <Button onClick={handleDelete} color="error">
//             מחק
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default GetRecords;
