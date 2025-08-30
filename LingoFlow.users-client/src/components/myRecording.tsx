//myRecording.tsx
//הצגת כל ההקלטות של המשתמש

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