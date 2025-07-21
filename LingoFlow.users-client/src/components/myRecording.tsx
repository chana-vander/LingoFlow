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

//gemini1:- מה שעובד מעולה בסד
// import { useEffect, useState, useRef } from "react";
// import recordStore from "../stores/recordStore";
// import userStore from "../stores/userStore";
// import { Record } from "../models/record";
// import Swal from "sweetalert2";

// import {
//   Box,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   Typography,
//   Paper,
//   Stack,
//   Collapse,
//   IconButton,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogActions,
// } from "@mui/material";
// import FeedbackIcon from "@mui/icons-material/Feedback";
// import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import DeleteIcon from "@mui/icons-material/Delete";
// import PauseIcon from "@mui/icons-material/Pause";
// import DownloadIcon from "@mui/icons-material/Download";
// import "../css/search-sidebar.css";
// import { feedbackStore } from "../stores/feedbackStore";
// import { Feedback } from "../models/feedback";
// import { ChevronRight, Filter, Search } from "lucide-react";

// // קומפוננטת אנימציית העיגולים
// const CircleAnimation = () => (
//   <Box
//     sx={{
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       height: "50px",
//       gap: "8px",
//       "& .circle": {
//         width: "12px",
//         height: "12px",
//         borderRadius: "50%",
//         bgcolor: "primary.main",
//         animation: "scalePulse 1.2s infinite ease-in-out",
//       },
//       "& .circle:nth-of-type(2)": {
//         animationDelay: "0.2s",
//       },
//       "& .circle:nth-of-type(3)": {
//         animationDelay: "0.4s",
//       },
//       "@keyframes scalePulse": {
//         "0%, 100%": { transform: "scale(0.8)" },
//         "50%": { transform: "scale(1.2)" },
//       },
//     }}
//   >
//     <Box className="circle" />
//     <Box className="circle" />
//     <Box className="circle" />
//   </Box>
// );

// const GetRecords = () => {
//   const [records, setRecords] = useState<Record[]>([]);
//   // שיניתי את הסוג ל-number | null מכיוון ש-ID הוא מספר
//   const [playingRecordId, setPlayingRecordId] = useState<number | null>(null);
//   // שיניתי את הסוג ל-number | undefined מכיוון ש-userStore.user?.id יכול להיות undefined
//   const userId = userStore.user?.id;
//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const [filteredRecords, setFilteredRecords] = useState<Record[]>([]);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("date");
//   const [filterLevel, setFilterLevel] = useState("all");
//   const [filterTopic, setFilterTopic] = useState("all");

//   // פונקציה לקיבוץ הקלטות לפי נושא
//   const groupRecordsByTopic = (recordsToGroup: Record[]) => {
//     const grouped: { [key: string]: Record[] } = {};
//     recordsToGroup.forEach((record) => {
//       // ודא שקיים שדה topic במודל Record, אם לא, תחליט מה יהיה נושא ברירת המחדל
//       const topic = record.topicId || "ללא נושא";
//       if (!grouped[topic]) {
//         grouped[topic] = [];
//       }
//       grouped[topic].push(record);
//     });
//     return grouped;
//   };

//   const groupedRecords = groupRecordsByTopic(records);

//   // שיניתי את הסוג של recordToDeleteId ל-number
//   const handleDeleteRecord = async (recordToDeleteId: number) => {
//     const result = await Swal.fire({
//       title: "האם אתה בטוח?",
//       text: "הקלטה זו תימחק לצמיתות ולא ניתן יהיה לשחזר אותה!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "כן, מחק אותה!",
//       cancelButtonText: "בטל",
//     });

//     if (result.isConfirmed) {
//       try {
//         await recordStore.deleteRecordFromDB(recordToDeleteId);
//         setRecords((prevRecords) =>
//           prevRecords.filter((r) => r.id !== recordToDeleteId)
//         );
//         // השוואה נכונה של ID מסוג number
//         if (playingRecordId === recordToDeleteId) {
//           setPlayingRecordId(null);
//           if (audioRef.current) {
//             audioRef.current.pause();
//             audioRef.current.src = "";
//           }
//         }
//         Swal.fire("נמחק!", "ההקלטה נמחקה בהצלחה.", "success");
//       } catch (error) {
//         console.error("Error deleting record:", error);
//         Swal.fire("שגיאה!", "אירעה שגיאה בעת מחיקת ההקלטה.", "error");
//       }
//     }
//   };

//   const handlePlayPause = (record: Record) => {
//     // השוואה נכונה של ID מסוג number
//     if (playingRecordId === record.id) {
//       setPlayingRecordId(null);
//       if (audioRef.current) {
//         audioRef.current.pause();
//       }
//     } else {
//       if (record.id !== undefined) setPlayingRecordId(record.id);
//       if (audioRef.current) {
//         audioRef.current.src = record.url;
//         audioRef.current
//           .play()
//           .catch((e) => console.error("Error playing audio:", e));
//       }
//     }
//   };

//   const handleDownload = async (record: Record) => {
//     const response = await fetch(record.url);
//     const blob = await response.blob();
//     const link = document.createElement("a");
//     link.href = window.URL.createObjectURL(blob);
//     link.download = `${record.name}.mp3`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   useEffect(() => {
//     // ודא ש-userId הוא מספר לפני ששולפים רשומות
//     if (typeof userId !== "number") return;

//     recordStore
//       .getRecordsByUserId(userId)
//       .then((fetchedRecords) => {
//         setRecords(fetchedRecords);
//       })
//       .catch((error) => {
//         console.error("Error getting records:", error);
//       });
//   }, [userId]);

//   // useEffect לטיפול באירועי סיום ניגון
//   useEffect(() => {
//     const audio = audioRef.current;
//     if (audio) {
//       const handleEnded = () => {
//         setPlayingRecordId(null);
//       };
//       audio.addEventListener("ended", handleEnded);
//       return () => {
//         audio.removeEventListener("ended", handleEnded);
//       };
//     }
//   }, [audioRef.current]);

//   const [feedback, setFeedback] = useState<Feedback | null>(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   // הוספת useEffect לעקוב אחרי השינויים ב-feedback
//   useEffect(() => {
//     if (feedback) {
//       console.log("Updated feedback:", feedback);
//       setOpenDialog(true); // פתח את הדיאלוג
//       console.log(openDialog);
//     }
//   }, [feedback]);
//   const displayFeedback = async (recordId: number) => {
//     try {
//       const feedbackData = await feedbackStore.getFeedbackByRecordId(recordId);
//       console.log("Feedback Data:", feedbackData);

//       setFeedback(feedbackData[0]);

//       console.log("record", recordId);
//     } catch (error) {
//       console.error("Error getting feedback:", error);
//     }
//   };
//   return (
//     <Box
//       sx={{
//         width: "80%",
//         margin: "40px auto",
//         padding: 4,
//         bgcolor: "background.paper",
//         borderRadius: 4,
//         boxShadow: 6,
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         textAlign: "center",
//       }}
//     >

//       <Typography
//         variant="h3"
//         component="h1"
//         gutterBottom
//         sx={{ mb: 4, color: "primary.dark", fontWeight: "bold" }}
//       >
//         ההקלטות שלך
//       </Typography>

//       {Object.keys(groupedRecords).length > 0 ? (
//         <Box sx={{ width: "100%" }}>
//           {Object.entries(groupedRecords).map(([topic, recordsInTopic]) => (
//             <Box key={topic} sx={{ mb: 4 }}>
//               <Typography
//                 variant="h5"
//                 sx={{
//                   mb: 2,
//                   color: "secondary.main",
//                   textAlign: "right",
//                   borderBottom: "2px solid",
//                   borderColor: "secondary.light",
//                   pb: 1,
//                 }}
//               >
//                 {topic}
//               </Typography>
//               <List sx={{ width: "100%", p: 0 }}>
//                 {recordsInTopic.map((record) => (
//                   <Paper
//                     // מפתח key צריך להיות ייחודי וניתן לרינדור, ID הוא מספר תקין
//                     key={record.id}
//                     sx={{
//                       mb: 2,
//                       p: 2,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       elevation: 4,
//                       borderRadius: 2,
//                       transition: "all 0.3s ease-in-out",
//                       "&:hover": {
//                         transform: "translateY(-5px)",
//                         boxShadow: 8,
//                       },
//                       position: "relative",
//                       overflow: "hidden",
//                     }}
//                   >
//                     <Box sx={{ flexGrow: 1, textAlign: "right" }}>
//                       <Typography
//                         variant="h6"
//                         sx={{ color: "text.primary", fontWeight: "medium" }}
//                       >
//                         {record.name}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {record.date}
//                       </Typography>
//                     </Box>

//                     <Stack
//                       direction="row"
//                       spacing={1}
//                       sx={{
//                         opacity: { xs: 1, md: 0 },
//                         transition: "opacity 0.3s ease-in-out",
//                         position: "absolute",
//                         right: 16,
//                         top: "50%",
//                         transform: "translateY(-50%)",
//                         zIndex: 1,
//                         "@media (hover: hover)": {
//                           "&:hover, .MuiPaper-root:hover &": {
//                             opacity: 1,
//                           },
//                         },
//                       }}
//                     >
//                       <IconButton
//                         aria-label="הורדה"
//                         onClick={() => handleDownload(record)}
//                       >
//                         {" "}
//                         <DownloadIcon />
//                       </IconButton>
//                       <IconButton
//                         color="success"
//                         aria-label="הצג משוב"
//                         onClick={() => {
//                           if (record.id !== undefined) {
//                             displayFeedback(record.id);
//                           }
//                         }}
//                       >
//                         {/* כאן תוכל להוסיף אייקון או טקסט לכפתור */}
//                         <FeedbackIcon color="primary" fontSize="large" />
//                       </IconButton>
//                       <IconButton
//                         color="primary"
//                         aria-label={
//                           playingRecordId === record.id
//                             ? "השהה הקלטה"
//                             : "השמע הקלטה"
//                         }
//                         onClick={() => handlePlayPause(record)}
//                         sx={{
//                           p: 1.5,
//                           bgcolor: "primary.light",
//                           "&:hover": { bgcolor: "primary.main" },
//                         }}
//                       >
//                         {playingRecordId === record.id ? (
//                           <PauseIcon sx={{ fontSize: 28 }} />
//                         ) : (
//                           <PlayArrowIcon sx={{ fontSize: 28 }} />
//                         )}
//                       </IconButton>

//                       <IconButton
//                         color="error"
//                         aria-label="מחק הקלטה"
//                         onClick={() => {
//                           if (record.id !== undefined) {
//                             handleDeleteRecord(record.id);
//                           } else {
//                             console.error("Record ID is undefined");
//                           }
//                         }}
//                         sx={{
//                           p: 1.5,
//                           bgcolor: "error.light",
//                           "&:hover": { bgcolor: "error.main" },
//                         }}
//                       >
//                         <DeleteIcon sx={{ fontSize: 28 }} />
//                       </IconButton>
//                     </Stack>
//                   </Paper>
//                 ))}
//               </List>
//             </Box>
//           ))}
//         </Box>
//       ) : (
//         <Typography
//           variant="h6"
//           color="text.secondary"
//           sx={{
//             mt: 4,
//             p: 3,
//             border: "1px dashed",
//             borderColor: "grey.400",
//             borderRadius: 2,
//           }}
//         >
//           אין עדיין הקלטות להצגה. התחל להקליט משהו חדש!
//         </Typography>
//       )}

//       <Collapse
//         in={!!playingRecordId}
//         sx={{
//           width: "100%",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         {playingRecordId && (
//           <Box
//             sx={{
//               mt: 4,
//               width: "100%",
//               maxWidth: 600,
//               bgcolor: "#e3f2fd",
//               p: 3,
//               borderRadius: 3,
//               boxShadow: 3,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//             }}
//           >
//             <Typography
//               variant="subtitle1"
//               color="text.secondary"
//               sx={{ mb: 1 }}
//             >
//               מנגן כעת: {records.find((r) => r.id === playingRecordId)?.name}
//             </Typography>
//             <audio
//               ref={audioRef}
//               controls
//               src={records.find((r) => r.id === playingRecordId)?.url}
//               style={{
//                 width: "100%",
//                 outline: "none",
//                 filter: "contrast(1.1)",
//               }}
//               onEnded={() => setPlayingRecordId(null)}
//             />
//             <CircleAnimation />
//           </Box>
//         )}
//       </Collapse>
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//         <DialogTitle>משוב להקלטה</DialogTitle>
//         <DialogContent>
//           {feedback ? (
//             <Box>
//               {/* <Typography variant="h6">משוב כללי: {feedback.}</Typography> */}
//               {/* <Typography variant="h6">ציון כללי: {feedback.}</Typography> */}

//               <Typography>
//                 ציון דקדוק: {feedback.grammarScore} - {feedback.grammarComment}
//               </Typography>
//               <Typography>
//                 ציון שטף: {feedback.fluencyScore} - {feedback.fluencyComment}
//               </Typography>
//               <Typography>
//                 ציון אוצר מילים: {feedback.vocabularyScore} -{" "}
//                 {feedback.vocabularyComment}
//               </Typography>
//               <Typography>
//                 תאריך: {new Date(feedback.givenAt).toLocaleDateString()}
//               </Typography>
//             </Box>
//           ) : (
//             <Typography>אין משוב זמין.</Typography>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)} color="primary">
//             סגור
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default GetRecords;

"use client";

import type React from "react";

import { useEffect, useState, useRef } from "react";
import recordStore from "../stores/recordStore";
import userStore from "../stores/userStore";
import type { Record } from "../models/record";
import Swal from "sweetalert2";

import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  Tooltip,
  Zoom,
  TextField,
  InputAdornment,
  Avatar,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import PauseIcon from "@mui/icons-material/Pause";
import DownloadIcon from "@mui/icons-material/Download";
import AlbumIcon from "@mui/icons-material/Album";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { feedbackStore } from "../stores/feedbackStore";
import type { Feedback } from "../models/feedback";
import "../style/myRecording.css";
import circle from "../images/circle.png";
import bgImg from "../images/background.png"
import { useNavigate } from "react-router-dom";
// Circle Animation Component
// const CircleAnimation = () => (
//   <Box
//     sx={{
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       height: "50px",
//       gap: "8px",
//       "& .circle": {
//         width: "12px",
//         height: "12px",
//         borderRadius: "50%",
//         bgcolor: "#0288d1",
//         animation: "scalePulse 1.2s infinite ease-in-out",
//       },
//       "& .circle:nth-of-type(2)": {
//         animationDelay: "0.2s",
//       },
//       "& .circle:nth-of-type(3)": {
//         animationDelay: "0.4s",
//       },
//       "@keyframes scalePulse": {
//         "0%, 100%": { transform: "scale(0.8)" },
//         "50%": { transform: "scale(1.2)" },
//       },
//     }}
//   >
//     <Box className="circle" />
//     <Box className="circle" />
//     <Box className="circle" />
//   </Box>
// );

const MyRecordings = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [playingRecordId, setPlayingRecordId] = useState<number | null>(null);
  const userId = userStore.user?.id;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [recordDurations, setRecordDurations] = useState<{
    [key: number]: number;
  }>({});

  // Load audio metadata to get duration
  const loadAudioMetadata = async (record: Record) => {
    return new Promise<number>((resolve) => {
      const audio = new Audio();
      audio.addEventListener("loadedmetadata", () => {
        resolve(audio.duration);
      });
      audio.addEventListener("error", () => {
        resolve(0);
      });
      audio.src = record.url;
    });
  };

  // Group recordings by topic
  const groupRecordsByTopic = (recordsToGroup: Record[]) => {
    const grouped: { [key: string]: Record[] } = {};
    recordsToGroup.forEach((record) => {
      const topic = record.topicId || "ללא נושא";
      if (!grouped[topic]) {
        grouped[topic] = [];
      }
      grouped[topic].push(record);
    });
    return grouped;
  };

  const filterAndSortRecords = (recordsToFilter: Record[]) => {
    let filtered = recordsToFilter;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((record) =>
        record.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date (newest first)
    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return filtered;
  };

  const filteredAndSortedRecords = filterAndSortRecords(records);
  const groupedRecords = groupRecordsByTopic(filteredAndSortedRecords);

  const handleDeleteRecord = async (recordToDeleteId: number) => {
    const result = await Swal.fire({
      title: "מחיקת הקלטה",
      text: "האם אתה בטוח שברצונך למחוק הקלטה זו?!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f44336",
      cancelButtonColor: "#2196f3",
      confirmButtonText: "כן, מחק!",
      cancelButtonText: "ביטול",
      reverseButtons: true,
      customClass: {
        popup: "rtl-popup",
      },
    });

    if (result.isConfirmed) {
      try {
        await recordStore.deleteRecordFromDB(recordToDeleteId);
        setRecords((prevRecords) =>
          prevRecords.filter((r) => r.id !== recordToDeleteId)
        );
        if (playingRecordId === recordToDeleteId) {
          setPlayingRecordId(null);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
          }
        }
        Swal.fire({
          title: "נמחק!",
          text: "ההקלטה נמחקה בהצלחה.",
          icon: "success",
          confirmButtonColor: "#4caf50",
          customClass: {
            popup: "rtl-popup",
          },
        });
      } catch (error) {
        console.error("Error deleting record:", error);
        Swal.fire({
          title: "שגיאה!",
          text: "אירעה שגיאה בעת מחיקת ההקלטה.",
          icon: "error",
          confirmButtonColor: "#f44336",
          customClass: {
            popup: "rtl-popup",
          },
        });
      }
    }
  };

  const handlePlayPause = (record: Record) => {
    if (playingRecordId === record.id) {
      setPlayingRecordId(null);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      if (record.id !== undefined) setPlayingRecordId(record.id);
      if (audioRef.current) {
        audioRef.current.src = record.url;
        audioRef.current
          .play()
          .catch((e) => console.error("Error playing audio:", e));
      }
    }
  };

  const handleDownload = async (record: Record) => {
    console.log("record.url ", record.url);

    const response = await fetch(record.url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${record.name}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleProgressClick = (
    event: React.MouseEvent<HTMLDivElement>,
    recordId: number
  ) => {
    if (playingRecordId === recordId && audioRef.current && duration > 0) {
      const rect = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const width = rect.width;
      const clickTime = (clickX / width) * duration;
      audioRef.current.currentTime = clickTime;
      setCurrentTime(clickTime);
    }
  };

  const updateProgress = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  // const displayFeedback = async (recordId: number) => {
  //   try {
  //     const feedbackData = await feedbackStore.getFeedbackByRecordId(recordId);
  //     console.log("Feedback Data:", feedbackData);
  //     setFeedback(feedbackData[0]);
  //   } catch (error) {
  //     console.error("Error getting feedback:", error);
  //   }
  // };
  const displayFeedback = async (record: Record) => {
    try {
      if (record.id !== undefined) {
        const feedbackData = await feedbackStore.getFeedbackByRecordId(
          record.id
        );
        console.log("Feedback Data:", feedbackData);
        setFeedback(feedbackData); // רק אם הצליח
        console.log(feedback);
      }
    } catch (error: any) {
      // אם השרת מחזיר 404 – נציג הודעה למשתמש
      if (error.response && error.response.status === 404) {
        console.warn("No feedback available for this recording.");
        setFeedback(null); // כך יוצג המסר "אין משוב..."
        setSelectedRecord(record); // שומר את ההקלטה הנוכחית
        console.log(feedback);
      } else {
        console.error("Error getting feedback:", error);
      }
    } finally {
      setOpenDialog(true); // פותח את הדיאלוג תמיד, אחרי שהסטייט עודכן
    }
  };

  useEffect(() => {
    if (typeof userId !== "number") return;

    recordStore
      .getRecordsByUserId(userId)
      .then(async (fetchedRecords) => {
        setRecords(fetchedRecords);

        // Load durations for all records
        const durations: { [key: number]: number } = {};
        for (const record of fetchedRecords) {
          if (record.id !== undefined) {
            const duration = await loadAudioMetadata(record);
            durations[record.id] = duration;
          }
        }
        setRecordDurations(durations);
      })
      .catch((error) => {
        console.error("Error getting records:", error);
      });
  }, [userId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => {
        setPlayingRecordId(null);
        setCurrentTime(0);
        setDuration(0);
      };

      const handleTimeUpdate = () => {
        updateProgress();
      };

      const handleLoadedMetadata = () => {
        updateProgress();
      };

      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [audioRef.current]);

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const getRecordDuration = (recordId: number | undefined) => {
    if (recordId === undefined) return 0;
    return recordDurations[recordId] || 0;
  };

  const getFeedback = () => {
    if (selectedRecord) {
      recordStore.setRecording(selectedRecord); // כאן את שולחת את כל ההקלטה
      navigate("/feedback");
    }
  };  

  return (
    <Box
      sx={{
        width: "100%",
        // margin: "40px auto",
        padding: 4,
        // bgcolor: "#f5f9fc",
        // borderRadius: 4,
        // boxShadow: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        direction: "rtl",
      }}
    >
      {/* <Box sx={{
        display: 'flex', // מפעיל Flexbox
        alignItems: 'center', // מיישר את הפריטים אנכית למרכז
        justifyContent: 'center',
        mb: 4, // מרווח תחתון כללי ל-Box
        width: '100%', // ודא שהקונטיינר תופס את כל הרוחב הזמין
      }}> */}
      <Typography
        gutterBottom
        sx={{
          color: "#0277bd",
          margin: "auuto",
          fontSize: "25px",
          marginBottom: "30px",
        }}
      >
        הנה ההקלטות שלך, כדי שתוכל לעקוב אחרי הדרך שעשית וללמוד ממה שכבר הצלחת.
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="חפש הקלטה..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          mb: 0,
          maxWidth: 240,
          // maxHeight:200,
          // marginLeft: '10%',
          marginRight: "48%",
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            bgcolor: "white",
            direction: "ltr",
          },
          "& .MuiInputBase-input": {
            textAlign: "right",
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon sx={{ color: "#0288d1" }} />
            </InputAdornment>
          ),
        }}
      />
      {/* </Box> */}
      <audio
        ref={audioRef}
        style={{ display: "none" }}
        onEnded={() => setPlayingRecordId(null)}
      />

      {Object.keys(groupedRecords).length > 0 ? (
        <Box sx={{ width: "100%" }}>
          {Object.entries(groupedRecords).map(([topic, recordsInTopic]) => (
            <Box key={topic} sx={{ mb: 5 }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  color: "#01579b",

                  // color:"#fff",
                  textAlign: "right",
                  pb: 1,
                }}
              >
                {topic}
              </Typography>
              <Grid container spacing={3} sx={{ direction: "rtl" }}>
                {recordsInTopic.map((record) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={record.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: 8,
                        },
                        bgcolor: "#e1f5fe",
                        borderRadius: 3,
                        overflow: "hidden",
                        direction: "rtl",
                      }}
                    >
                      {/* החלק העליון של הכרטיס -התמונה */}
                      <Box
                        sx={{
                          position: "relative",
                          height: 180,
                          // bgcolor: "#0288d1",
                          backgroundImage: `url(${bgImg})`,
                          backgroundSize: "cover", // התמונה תכסה את כל השטח
                          backgroundPosition: "center", // התמונה תמורכז
                          backgroundRepeat: "no-repeat", // למנוע חזרות
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          filter: "opacity(80%)",
                        }}
                      >
                        <AlbumIcon
                          sx={{
                            fontSize: 100,
                            color: "#e1f5fe",
                            opacity: 0.8,
                            transition: "transform 0.5s ease",
                            animation:
                              playingRecordId === record.id
                                ? "spin 4s linear infinite"
                                : "none",
                            "@keyframes spin": {
                              "0%": { transform: "rotate(0deg)" },
                              "100%": { transform: "rotate(360deg)" },
                            },
                          }}
                        />
                        {/* <Typography
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                            pointerEvents: "none",
                          }}
                        >
                          {record.name.substring(0, 2).toUpperCase()}
                        </Typography> */}
                      </Box>

                      <CardContent
                        sx={{ flexGrow: 1, textAlign: "right", pb: 1 }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ color: "#01579b", fontWeight: "medium", mb: 1 }}
                        >
                          {record.name}
                        </Typography>
                        {/* <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {record.date}
                        </Typography> */}

                        {/* Always visible progress bar */}
                        <Box sx={{ width: "100%", mb: 1 }}>
                          <Box
                            onClick={(e) => handleProgressClick(e, record.id!)}
                            sx={{
                              cursor:
                                playingRecordId === record.id
                                  ? "pointer"
                                  : "default",
                              "&:hover": {
                                opacity:
                                  playingRecordId === record.id ? 0.8 : 1,
                              },
                            }}
                          >
                            <LinearProgress
                              variant="determinate"
                              value={
                                playingRecordId === record.id && duration > 0
                                  ? (currentTime / duration) * 100
                                  : 0
                              }
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: "#b3e5fc",
                                "& .MuiLinearProgress-bar": {
                                  bgcolor: "#d50000",
                                },
                              }}
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mt: 0.5,
                              fontSize: "0.75rem",
                              color: "text.secondary",
                            }}
                          >
                            <span>
                              {playingRecordId === record.id
                                ? formatTime(currentTime)
                                : "0:00"}
                            </span>
                            <span>
                              {playingRecordId === record.id && duration > 0
                                ? formatTime(duration)
                                : formatTime(getRecordDuration(record.id))}
                            </span>
                          </Box>
                        </Box>
                      </CardContent>

                      <CardActions
                        sx={{
                          justifyContent: "center",
                          gap: 1,
                          pb: 2,
                        }}
                      >
                        <Tooltip title="מחק" TransitionComponent={Zoom} arrow>
                          <IconButton
                            size="small"
                            onClick={() => {
                              if (record.id !== undefined) {
                                handleDeleteRecord(record.id);
                              }
                            }}
                            sx={{
                              color: "#0277bd",
                              "&:hover": { bgcolor: "#e1f5fe" },
                            }}
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="הורד" TransitionComponent={Zoom} arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleDownload(record)}
                            sx={{
                              color: "#0277bd",
                              "&:hover": { bgcolor: "#e1f5fe" },
                            }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title="הצג משוב"
                          TransitionComponent={Zoom}
                          arrow
                        >
                          <IconButton
                            size="small"
                            onClick={() => {
                              if (record.id !== undefined) {
                                displayFeedback(record);
                              }
                            }}
                            sx={{
                              color: "#0277bd",
                              "&:hover": { bgcolor: "#e1f5fe" },
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title={playingRecordId === record.id ? "השהה" : "נגן"}
                          TransitionComponent={Zoom}
                          arrow
                        >
                          <IconButton
                            size="large"
                            onClick={() => handlePlayPause(record)}
                            sx={{
                              bgcolor: "white",
                              color: "primary", // שיניתי ל-primary כדי שהאייקון/טקסט יהיה כחול על רקע לבן, או שים צבע אחר שמתאים לך
                              "&:hover": {
                                bgcolor: "#f0f0f0", // צבע אפור בהיר בריחוף, כדי שתהיה אינדיקציה כלשהי
                              },
                              transition: "all 0.2s ease",
                              transform: "scale(1.2)",
                              // הוסף עיצוב נוסף אם האווטאר לא נראה עגול מספיק
                              borderRadius: "50%", // לוודא צורה עגולה
                              overflow: "hidden", // לוודא שהתמונה נחתכת לעיגול
                              padding: 0, // לוודא שאין ריפוד שמשפיע על הצורה
                              display: "flex", // ליישור התוכן במרכז
                              alignItems: "center", // ליישור אנכי
                              justifyContent: "center", // ליישור אופקי
                            }}
                          >
                            {playingRecordId === record.id ? (
                              <PauseIcon />
                            ) : (
                              <Avatar
                                src={circle}
                                alt="Play"
                                sx={{
                                  width: "130%", // מילוי כל השטח של ה-IconButton
                                  height: "130%", // מילוי כל השטח של ה-IconButton
                                  // וודא שהתמונה ממלאת את האווטאר ושומרת על פרופורציות
                                  objectFit: "cover",
                                }}
                              />
                            )}
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      ) : searchTerm.trim() ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
            p: 4,
            border: "2px dashed",
            borderColor: "#4fc3f7",
            borderRadius: 3,
            bgcolor: "#f8f9fa",
          }}
        >
          <SearchOffIcon sx={{ fontSize: 64, color: "#90a4ae", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            אין הקלטות התואמות לחיפוש שלך
          </Typography>
          <Typography variant="body2" color="text.secondary">
            נסה לחפש במילות מפתח אחרות או נקה את שדה החיפוש
          </Typography>
        </Box>
      ) : (
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            mt: 4,
            p: 3,
            border: "1px dashed",
            borderColor: "#4fc3f7",
            borderRadius: 2,
          }}
        >
          אין עדיין הקלטות להצגה. התחל להקליט משהו חדש!
        </Typography>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        dir="rtl"
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 320,
            maxWidth: 500,
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#0288d1",
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          המשוב שלך⬅️
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          {feedback ? (
            <Box sx={{ direction: "rtl" }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: "#e3f2fd",
                  borderRadius: 2,
                  borderRight: "4px solid #0288d1",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "#01579b" }}
                >
                  דקדוק: {feedback.grammarScore}/10
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {feedback.grammarComment}
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: "#e8f5e9",
                  borderRadius: 2,
                  borderRight: "4px solid #2e7d32",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "#2e7d32" }}
                >
                  שטף: {feedback.fluencyScore}/10
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {feedback.fluencyComment}
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: "#fff3e0",
                  borderRadius: 2,
                  borderRight: "4px solid #e65100",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "#e65100" }}
                >
                  אוצר מילים: {feedback.vocabularyScore}/10
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  {feedback.vocabularyComment}
                </Typography>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: "#fff3e0",
                  borderRadius: 2,
                  borderRight: "4px solid #e65100",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "red" }}
                >
                  ציון כולל: {feedback.score}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  {feedback.generalFeedback}
                </Typography>
              </Paper>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "left",
                  mt: 2,
                  color: "text.secondary",
                }}
              >
                ניתן בתאריך: {new Date(feedback.givenAt).toLocaleDateString()}
              </Typography>
            </Box>
          ) : (
            <>
              <Typography sx={{ textAlign: "center", py: 3 }}>
                אין משוב זמין להקלטה זו.
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={getFeedback}
                >
                  שלח למשוב
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="contained"
            sx={{
              bgcolor: "#0288d1",
              "&:hover": { bgcolor: "#01579b" },
            }}
          >
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyRecordings;

// //היום -שלישי בלילה
// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { observer } from 'mobx-react-lite';
// import recordStore from '../stores/recordStore';
// import { Record } from '../models/record';
// import { IoPlayCircleOutline, IoDocumentTextOutline, IoDownloadOutline, IoStarOutline, IoStarSharp } from 'react-icons/io5';
// import { MdGraphicEq } from 'react-icons/md';
// import { FiSearch } from 'react-icons/fi';
// import { format } from 'date-fns';
// import { feedbackStore } from '../stores/feedbackStore'; // מניח שיש לך feedbackStore
// import topicStore from '../stores/topicStore';

// // מניח שיש לך רכיב Modal ורכיב FeedbackDisplay
// // import { Modal } from '../../components/common/Modal';
// // import { FeedbackDisplay } from '../../components/FeedbackDisplay/FeedbackDisplay'; // תיצור את זה

// // --- סגנונות (לצורך הדגמה - שלב עם מערכת העיצוב שלך!) ---
// const styles = {
//     pageContainer: {
//         padding: '40px',
//         maxWidth: '1200px',
//         margin: '0 auto',
//         fontFamily: 'Heebo, sans-serif', // הפונט של LinguaFlow
//         color: '#2c3e50',
//     },
//     header: {
//         textAlign: 'center',
//         marginBottom: '40px',
//     },
//     title: {
//         fontSize: '3.5em',
//         fontWeight: 700,
//         color: '#3498db', // כחול LinguaFlow
//         marginBottom: '10px',
//     },
//     subtitle: {
//         fontSize: '1.2em',
//         color: '#7f8c8d',
//         lineHeight: 1.6,
//     },
//     filtersContainer: {
//         display: 'flex',
//         flexWrap: 'wrap',
//         gap: '15px',
//         marginBottom: '30px',
//         alignItems: 'center',
//         backgroundColor: '#f8f9fa',
//         padding: '20px',
//         borderRadius: '12px',
//         boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
//     },
//     filterGroup: {
//         flex: '1 1 200px',
//         minWidth: '150px',
//     },
//     filterLabel: {
//         display: 'block',
//         marginBottom: '8px',
//         fontWeight: 600,
//         color: '#555',
//     },
//     selectInput: {
//         width: '100%',
//         padding: '12px 15px',
//         borderRadius: '8px',
//         border: '1px solid #ddd',
//         fontSize: '1em',
//         backgroundColor: '#fff',
//         appearance: 'none', // הסרת חץ ברירת מחדל
//         backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666' width='18px' height='18px'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg>")`,
//         backgroundRepeat: 'no-repeat',
//         backgroundPosition: 'right 15px center',
//         backgroundSize: '18px',
//     },
//     searchInputContainer: {
//         flex: '2 1 300px',
//         position: 'relative',
//     },
//     searchInput: {
//         width: '100%',
//         padding: '12px 15px 12px 45px', // התאמת ריפוד לאייקון
//         borderRadius: '8px',
//         border: '1px solid #ddd',
//         fontSize: '1em',
//         backgroundColor: '#fff',
//     },
//     searchIcon: {
//         position: 'absolute',
//         left: '15px',
//         top: '50%',
//         transform: 'translateY(-50%)',
//         color: '#aaa',
//         fontSize: '1.2em',
//     },
//     recordingsGrid: {
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
//         gap: '25px',
//         marginTop: '30px',
//     },
//     recordingCard: {
//         backgroundColor: '#fff',
//         borderRadius: '15px',
//         boxShadow: '0 6px 20px rgba(0, 0, 0, 0.07)',
//         padding: '25px',
//         display: 'flex',
//         flexDirection: 'column',
//         transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//         border: '1px solid #eee',
//         direction: 'rtl', // תמיכה בעברית
//         textAlign: 'right', // תמיכה בעברית
//     },
//     recordingCardHover: {
//         transform: 'translateY(-5px)',
//         boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
//     },
//     cardHeader: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: '15px',
//     },
//     cardDate: {
//         fontSize: '0.9em',
//         color: '#95a5a6',
//         fontWeight: 500,
//     },
//     favoriteButton: {
//         background: 'none',
//         border: 'none',
//         cursor: 'pointer',
//         fontSize: '1.5em',
//         color: '#f1c40f', // זהב למועדפים
//         padding: 0,
//         display: 'flex',
//         alignItems: 'center',
//         transition: 'transform 0.2s ease',
//     },
//     favoriteButtonHover: {
//         transform: 'scale(1.1)',
//     },
//     cardTitle: {
//         fontSize: '1.6em',
//         fontWeight: 700,
//         color: '#34495e',
//         marginBottom: '10px',
//     },
//     cardDetails: {
//         display: 'flex',
//         gap: '20px',
//         marginBottom: '20px',
//     },
//     detailItem: {
//         fontSize: '1em',
//         color: '#555',
//         display: 'flex',
//         alignItems: 'center',
//         gap: '5px',
//     },
//     levelBadge: (level: string) => {
//         let backgroundColor = '#ccc';
//         let textColor = '#fff';
//         switch (level.toLowerCase()) {
//             case 'beginner':
//                 backgroundColor = '#2ecc71'; // ירוק
//                 break;
//             case 'intermediate':
//                 backgroundColor = '#f39c12'; // כתום
//                 break;
//             case 'advanced':
//                 backgroundColor = '#e74c3c'; // אדום
//                 break;
//             default:
//                 backgroundColor = '#9b59b6'; // סגול ללא ידוע
//         }
//         return {
//             backgroundColor,
//             color: textColor,
//             padding: '5px 12px',
//             borderRadius: '20px',
//             fontSize: '0.85em',
//             fontWeight: 600,
//             display: 'inline-block',
//         };
//     },
//     cardActions: {
//         display: 'flex',
//         justifyContent: 'flex-start',
//         gap: '15px',
//         marginTop: 'auto', // דחיפת הכפתורים לתחתית
//     },
//     actionButton: {
//         display: 'flex',
//         alignItems: 'center',
//         gap: '8px',
//         padding: '12px 20px',
//         borderRadius: '10px',
//         border: 'none',
//         fontSize: '1em',
//         cursor: 'pointer',
//         transition: 'background-color 0.3s ease, transform 0.2s ease',
//         fontWeight: 600,
//     },
//     listenButton: {
//         backgroundColor: '#3498db',
//         color: '#fff',
//     },
//     listenButtonHover: {
//         backgroundColor: '#2980b9',
//         transform: 'translateY(-2px)',
//     },
//     feedbackButton: {
//         backgroundColor: '#2c3e50',
//         color: '#fff',
//     },
//     feedbackButtonHover: {
//         backgroundColor: '#1a242f',
//         transform: 'translateY(-2px)',
//     },
//     downloadButton: {
//         backgroundColor: '#95a5a6',
//         color: '#fff',
//     },
//     downloadButtonHover: {
//         backgroundColor: '#7f8c8d',
//         transform: 'translateY(-2px)',
//     },
//     noRecordings: {
//         textAlign: 'center',
//         fontSize: '1.5em',
//         color: '#7f8c8d',
//         marginTop: '50px',
//     },
//     loadingSpinner: {
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         minHeight: '200px',
//     },
//     spinner: {
//         border: '4px solid rgba(0, 0, 0, 0.1)',
//         borderLeftColor: '#3498db',
//         borderRadius: '50%',
//         width: '40px',
//         height: '40px',
//         animation: 'spin 1s linear infinite',
//     },
//     '@keyframes spin': {
//         '0%': { transform: 'rotate(0deg)' },
//         '100%': { transform: 'rotate(360deg)' },
//     },
//     graphPlaceholder: {
//         width: '100%',
//         height: '80px',
//         backgroundColor: '#ecf0f1',
//         borderRadius: '8px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         color: '#7f8c8d',
//         fontSize: '0.9em',
//         marginTop: '15px',
//         marginBottom: '10px',
//     }
// };

// // const mockTopics = topicStore.fetchTopics();
// const mockTopics=['f','f','f'];
// const mockLevels = ['מתחיל', 'בינוני', 'מתקדם'];

// // --- רכיב MyRecordingsPage ---
// const MyRecordingsPage: React.FC = observer(() => {
//     const [records, setRecords] = useState<Record[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     const [filterDate, setFilterDate] = useState<string>('');
//     const [filterLevel, setFilterLevel] = useState<string>('');
//     const [filterTopic, setFilterTopic] = useState<string>('');
//     const [searchTerm, setSearchTerm] = useState<string>('');

//     const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
//     const [selectedRecordForFeedback, setSelectedRecordForFeedback] = useState<Record | null>(null);
//     const [isPlaying, setIsPlaying] = useState<string | null>(null); // שומר את ה-URL של האודיו המושמע כרגע

//     // מצב מועדפים מדמה (באפליקציה אמיתית זה יישמר ב-DB או ב-local storage)
//     const [favorites, setFavorites] = useState<Set<number>>(new Set());

//     const userId = 1; // זה צריך להגיע מקונטקסט האותנטיקציה שלך

//     useEffect(() => {
//         const fetchRecords = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const fetchedRecords = await recordStore.getRecordsByUserId(userId);
//                 // הדמיית הוספת נתוני משוב, רמה ונושא לצורך תצוגה
//                 const recordsWithEnhancedData = fetchedRecords.map(rec => ({
//                     ...rec,
//                     level: mockLevels[Math.floor(Math.random() * mockLevels.length)], // רמת דמה
//                     feedbackScoreChange: Math.random() > 0.5 ? parseFloat((Math.random() * 10 - 5).toFixed(1)) : null, // שינוי ציון דמה
//                     // topicName: mockTopics[Math.floor(Math.random() * mockTopics.length)].name // שם נושא דמה
//                 }));
//                 setRecords(recordsWithEnhancedData);
//             } catch (err: any) {
//                 setError("אחזור ההקלטות נכשל. אנא נסה שוב.");
//                 console.error("שגיאה באחזור הקלטות:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchRecords();
//     }, [userId]);

//     const filteredRecords = useMemo(() => {
//         let tempRecords = records;

//         if (filterDate) {
//             tempRecords = tempRecords.filter(record =>
//                 format(new Date(record.date), 'yyyy-MM-dd') === filterDate
//             );
//         }

//         if (filterLevel) {
//             tempRecords = tempRecords.filter(record =>
//                 (record as any).level?.toLowerCase() === filterLevel.toLowerCase()
//             );
//         }

//         if (filterTopic) {
//             tempRecords = tempRecords.filter(record =>
//                 (record as any).topicName?.toLowerCase().includes(filterTopic.toLowerCase())
//             );
//         }

//         if (searchTerm) {
//             const lowerCaseSearchTerm = searchTerm.toLowerCase();
//             tempRecords = tempRecords.filter(record =>
//                 record.name.toLowerCase().includes(lowerCaseSearchTerm) ||
//                 (record as any).topicName?.toLowerCase().includes(lowerCaseSearchTerm) ||
//                 (record as any).level?.toLowerCase().includes(lowerCaseSearchTerm)
//             );
//         }

//         // מיון לפי תאריך יורד כברירת מחדל
//         tempRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

//         // עדיפות למועדפים בראש הרשימה
//         return tempRecords.sort((a, b) => {
//             const aIsFavorite = favorites.has(a.id!);
//             const bIsFavorite = favorites.has(b.id!);
//             if (aIsFavorite && !bIsFavorite) return -1;
//             if (!aIsFavorite && bIsFavorite) return 1;
//             return 0;
//         });

//     }, [records, filterDate, filterLevel, filterTopic, searchTerm, favorites]);

//     const handleListen = useCallback(async (record: Record) => {
//         if (!record.url) {
//             alert('אין URL זמין להקלטה זו.');
//             return;
//         }

//         try {
//             const downloadUrl = await recordStore.getDownloadUrl(record.url);
//             if (downloadUrl) {
//                 if (isPlaying === downloadUrl) {
//                     // אם כבר מנגן, עצור אותו
//                     setIsPlaying(null);
//                     const audio = document.getElementById('audio-player') as HTMLAudioElement;
//                     if (audio) audio.pause();
//                 } else {
//                     setIsPlaying(downloadUrl);
//                     const audio = new Audio(downloadUrl);
//                     audio.id = 'audio-player'; // הקצאת ID כדי למצוא אותו בקלות מאוחר יותר
//                     audio.play();
//                     audio.onended = () => setIsPlaying(null); // איפוס כשהשמע מסתיים
//                 }
//             } else {
//                 alert('לא ניתן לקבל URL להורדה עבור ההקלטה.');
//             }
//         } catch (error) {
//             console.error('שגיאה בהפעלת הקלטה:', error);
//             alert('הפעלת ההקלטה נכשלה.');
//         }
//     }, [isPlaying]);

//     const handleViewFeedback = useCallback(async (record: Record) => {
//         if (!record.id) {
//             alert("לא ניתן לצפות במשוב: חסר מזהה הקלטה.");
//             return;
//         }
//         setSelectedRecordForFeedback(record);
//         setIsFeedbackModalOpen(true);
//         // בתרחיש אמיתי, היית שולף את נתוני המשוב כאן באמצעות feedbackStore
//         // דוגמה: await feedbackStore.getFeedbackByConversationId(record.id);
//         // לעת עתה, FeedbackDisplay יטפל בנתוני הדמה שלו או באחזור בהתבסס על selectedRecordForFeedback.
//     }, []);

//     const handleDownload = useCallback(async (record: Record) => {
//         if (!record.url) {
//             alert('אין URL להורדה זמין להקלטה זו.');
//             return;
//         }

//         try {
//             const downloadUrl = await recordStore.getDownloadUrl(record.url);
//             if (downloadUrl) {
//                 const link = document.createElement('a');
//                 link.href = downloadUrl;
//                 link.download = `LinguaFlow_Recording_${record.name || record.id}.mp3`; // או קבע סיומת קובץ
//                 document.body.appendChild(link);
//                 link.click();
//                 document.body.removeChild(link);
//                 alert('הורדת ההקלטה החלה!');
//             } else {
//                 alert('לא ניתן לקבל URL להורדה עבור ההקלטה.');
//             }
//         } catch (error) {
//             console.error('שגיאה בהורדת הקלטה:', error);
//             alert('הורדת ההקלטה נכשלה.');
//         }
//     }, []);

//     const handleToggleFavorite = useCallback((recordId: number) => {
//         setFavorites(prevFavorites => {
//             const newFavorites = new Set(prevFavorites);
//             if (newFavorites.has(recordId)) {
//                 newFavorites.delete(recordId);
//             } else {
//                 newFavorites.add(recordId);
//             }
//             return newFavorites;
//         });
//         // באפליקציה אמיתית, היית מעדכן זאת ב-backend שלך
//     }, []);

//     if (loading) {
//         return (
//             <div style={styles.loadingSpinner}>
//                 <div style={styles.spinner}></div>
//                 <p style={{ marginLeft: '15px', color: '#555' }}>טוען הקלטות...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div style={styles.pageContainer}>
//                 <h1 style={styles.title}>ההקלטות שלי</h1>
//                 <p style={styles.subtitle}>כאן תוכל לעיין בכל ההקלטות שביצעת ולקבל משוב מקצועי.</p>
//                 <div style={{ color: 'red', textAlign: 'center', marginTop: '50px', fontSize: '1.2em' }}>
//                     <p>שגיאה: {error}</p>
//                     <button
//                         onClick={() => window.location.reload()}
//                         style={{
//                             marginTop: '20px',
//                             padding: '10px 20px',
//                             backgroundColor: '#3498db',
//                             color: '#fff',
//                             border: 'none',
//                             borderRadius: '8px',
//                             cursor: 'pointer',
//                             fontSize: '1em',
//                         }}
//                     >
//                         נסה שוב
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div style={styles.pageContainer}>
//             <header
//             // style={styles.header}
//             >
//                 <h1 style={styles.title}>ההקלטות שלי</h1>
//                 <p style={styles.subtitle}>כאן תוכל לעיין בכל ההקלטות שביצעת ולקבל משוב מקצועי.</p>
//             </header>

//             <div
//             // style={styles.filtersContainer}
//             >
//                 <div style={styles.filterGroup}>
//                     <label htmlFor="filterDate" style={styles.filterLabel}>תאריך</label>
//                     <input
//                         type="date"
//                         id="filterDate"
//                         value={filterDate}
//                         onChange={(e) => setFilterDate(e.target.value)}
//                         // style={styles.selectInput}
//                     />
//                 </div>

//                 <div style={styles.filterGroup}>
//                     <label htmlFor="filterLevel" style={styles.filterLabel}>רמה</label>
//                     <select
//                         id="filterLevel"
//                         value={filterLevel}
//                         onChange={(e) => setFilterLevel(e.target.value)}
//                         // style={styles.selectInput}
//                     >
//                         <option value="">כל הרמות</option>
//                         {mockLevels.map(level => (
//                             <option key={level} value={level}>{level}</option>
//                         ))}
//                     </select>
//                 </div>

//                 <div style={styles.filterGroup}>
//                     <label htmlFor="filterTopic" style={styles.filterLabel}>נושא</label>
//                     <select
//                         id="filterTopic"
//                         value={filterTopic}
//                         onChange={(e) => setFilterTopic(e.target.value)}
//                         // style={styles.selectInput}
//                     >
//                         {/* <option value="">כל הנושאים</option>
//                         {mockTopics.map(topic => (
//                             <option key={topic.id} value={topic.name}>{topic.name}</option>
//                         ))} */}
//                     </select>
//                 </div>

//                 <div
//                 // style={styles.searchInputContainer}
//                 >
//                     <label htmlFor="searchTerm" style={styles.filterLabel}>חיפוש</label>
//                     <FiSearch
//                     //  style={styles.searchIcon}
//                      />
//                     <input
//                         type="text"
//                         id="searchTerm"
//                         placeholder="חפש הקלטה..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         style={styles.searchInput}
//                     />
//                 </div>
//             </div>

//             {filteredRecords.length === 0 ? (
//                 <p
//                 // style={styles.noRecordings}
//                 >אין הקלטות התואמות לחיפוש שלך. נסה שוב!</p>
//             ) : (
//                 <div style={styles.recordingsGrid}>
//                     {filteredRecords.map((record) => (
//                         <div key={record.id}
//                         // style={styles.recordingCard}
//                              onMouseEnter={(e) => (e.currentTarget.style.cssText += `transform: ${styles.recordingCardHover.transform}; box-shadow: ${styles.recordingCardHover.boxShadow};`)}
//                              onMouseLeave={(e) => (e.currentTarget.style.cssText = `background-color: ${styles.recordingCard.backgroundColor}; border: ${styles.recordingCard.border}; box-shadow: ${styles.recordingCard.boxShadow}; transform: none;`)}
//                         >
//                             <div style={styles.cardHeader}>
//                                 <span style={styles.cardDate}>
//                                     {format(new Date(record.date), 'dd/MM/yyyy HH:mm')}
//                                 </span>
//                                 <button
//                                     onClick={() => handleToggleFavorite(record.id!)}
//                                     style={styles.favoriteButton}
//                                     onMouseEnter={(e) => (e.currentTarget.style.transform = styles.favoriteButtonHover.transform)}
//                                     onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
//                                 >
//                                     {favorites.has(record.id!) ? <IoStarSharp /> : <IoStarOutline />}
//                                 </button>
//                             </div>
//                             <h3 style={styles.cardTitle}>{record.name}</h3>
//                             <div style={styles.cardDetails}>
//                                 <span style={styles.detailItem}>
//                                     <IoDocumentTextOutline /> {record.topicId || 'כללי'}
//                                 </span>
//                                 <span style={styles.detailItem}>
//                                     <span style={styles.levelBadge((record as any).level || 'Unknown')}>
//                                         {(record as any).level || 'לא ידוע'}
//                                     </span>
//                                 </span>
//                             </div>

//                             {/* גרף שיפור (מקום חלופי) */}
//                             {(record as any).feedbackScoreChange !== null && (
//                                 <div style={styles.graphPlaceholder}>
//                                     <MdGraphicEq style={{ fontSize: '1.5em', marginLeft: '5px' }} />
//                                     <span>שינוי ציון: {parseFloat((record as any).feedbackScoreChange) >= 0 ? '+' : ''}{(record as any).feedbackScoreChange}</span>
//                                 </div>
//                             )}

//                             <div style={styles.cardActions}>
//                                 <button
//                                     onClick={() => handleListen(record)}
//                                     style={{
//                                         ...styles.actionButton,
//                                         ...styles.listenButton,
//                                         ...(isPlaying === record.url && { backgroundColor: '#e67e22' }) // כתום כשהשמע פעיל
//                                     }}
//                                     onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.listenButtonHover.backgroundColor)}
//                                     onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = (isPlaying === record.url ? '#e67e22' : styles.listenButton.backgroundColor))}
//                                 >
//                                     <IoPlayCircleOutline /> {isPlaying === record.url ? 'הפסק' : 'האזן'}
//                                 </button>
//                                 <button
//                                     onClick={() => handleViewFeedback(record)}
//                                     style={{ ...styles.actionButton, ...styles.feedbackButton }}
//                                     onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.feedbackButtonHover.backgroundColor)}
//                                     onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.feedbackButton.backgroundColor)}
//                                 >
//                                     <IoDocumentTextOutline /> צפה במשוב
//                                 </button>
//                                 {record.url && ( // הצג הורדה רק אם קיים URL
//                                     <button
//                                         onClick={() => handleDownload(record)}
//                                         style={{ ...styles.actionButton, ...styles.downloadButton }}
//                                         onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.downloadButtonHover.backgroundColor)}
//                                         onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.downloadButton.backgroundColor)}
//                                     >
//                                         <IoDownloadOutline /> הורד
//                                     </button>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* <Modal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)}>
//                 {selectedRecordForFeedback && (
//                     <FeedbackDisplay
//                         record={selectedRecordForFeedback}
//                         onClose={() => setIsFeedbackModalOpen(false)}
//                     />
//                 )}
//             </Modal> */}
//         </div>
//     );
// });

// export default MyRecordingsPage;
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