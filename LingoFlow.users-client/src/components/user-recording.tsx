// // "use client"

import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
// import { Skeleton } from "@mui/material"
import { Skeleton } from "./ui/skeleton"
import { Alert, AlertDescription } from "./ui/alert"
import { Play, Calendar, Clock, Headphones, FileAudio, Info, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import userStore, { UserStore } from "../stores/userStore";

// טיפוס להקלטה
interface Recording {
  id: number
  userId: number
  user: any
  topicId: number
  topic: any
  url: string
  name: string
  date: string
  length: string
}

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null)
  const router = useNavigate();

  // useEffect(() => {
  //   const fetchRecordings = async () => {
  //     try {
  //       const userId = userStore.user?.id
  //       if (!userId) {
  //         router("/login")
  //         return
  //       }

  //       // שליפת ההקלטות מהשרת
  //       const response = await fetch(`http://localhost:5092/api/Conversation/user/${userId}`)

  //       if (!response.ok) {
  //         throw new Error(`שגיאה בטעינת ההקלטות: ${response.status}`)
  //       }

  //       const data = await response.json()
  //       setRecordings(data)
  //     } catch (err) {
  //       console.error("שגיאה בטעינת ההקלטות:", err)
  //       setError(err instanceof Error ? err.message : "שגיאה לא ידועה בטעינת ההקלטות")
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchRecordings()
  // }, [router])

  // פונקציה לפורמט תאריך
  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const userId = userStore.user?.id
        if (!userId) {
          router("/login")
          return
        }

        // שלב 1 - שליפת רשימת ההקלטות
        const response = await fetch(`http://localhost:5092/api/Conversation/user/${userId}`)
        if (!response.ok) {
          throw new Error(`שגיאה בטעינת ההקלטות: ${response.status}`)
        }

        const data = await response.json() // data = array of recordings

        // שלב 2 - שליפת URL עדכני לכל הקלטה לפי שמה
        const recordingsWithUrls = await Promise.all(
          data.map(async (rec: any) => {
            try {
              const url = await fetchRecordingUrl(rec.name)
              console.log("1 ",rec.recordingName);
              console.log("2 ",rec.name);
              console.log("4",rec);
              // console.log("3 ",rec.data.name);



              return { ...rec, url }
            } catch (e) {
              console.error("שגיאה בשליפת URL עבור:", rec.name, e)
              return { ...rec, url: null } // fallback
            }
          })
        )

        setRecordings(recordingsWithUrls)
      } catch (err) {
        console.error("שגיאה בטעינת ההקלטות:", err)
        setError(err instanceof Error ? err.message : "שגיאה לא ידועה בטעינת ההקלטות")
      } finally {
        setLoading(false)
      }
    }

    fetchRecordings()
  }, [router])

  const fetchRecordingUrl = async (name: string): Promise<string> => {
    console.log("name to server: ",name);

    const res = await fetch(`http://localhost:5092/api/upload/presigned-url?fileName=${name}`)
    if (!res.ok) {
      throw new Error("לא ניתן לשלוף URL עבור הקלטה")
    }
    const data = await res.json()
    console.log(data);
    console.log("res ",res);

    console.log(data.url);

    return data.url // מחזיר { url: "https://..." }
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // פונקציה לניגון הקלטה
  const playRecording = (id: number, url: string) => {
    console.log("id: ",id);
    
    console.log("url: ",url);
    
    setCurrentlyPlaying(id)
    const audio = new Audio(url)
    audio.onended = () => setCurrentlyPlaying(null)
    audio.play().catch((err) => {
      console.error("שגיאה בניגון ההקלטה:", err)
      setCurrentlyPlaying(null)
      setError("לא ניתן לנגן את ההקלטה. ייתכן שהקישור פג תוקף או שאין הרשאות מתאימות.")
    })
  }

  // פונקציה לקבלת צבע רקע לפי מזהה
  const getCardColor = (id: number) => {
    const colors = [
      "from-blue-50 to-blue-100 border-blue-200",
      "from-green-50 to-green-100 border-green-200",
      "from-purple-50 to-purple-100 border-purple-200",
      "from-orange-50 to-orange-100 border-orange-200",
      "from-pink-50 to-pink-100 border-pink-200",
      "from-teal-50 to-teal-100 border-teal-200",
    ]
    return colors[id % colors.length]
  }

  return (
    <div className="container mx-auto px-4 py-8 rtl">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">ההקלטות שלי</h1>
        <p className="text-gray-600 text-center max-w-2xl">
          כאן תוכלו לצפות בכל ההקלטות שביצעתם, להאזין להן ולעקוב אחר ההתקדמות שלכם בדיבור האנגלית
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-2">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Alert className="bg-red-50 border-red-200 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-600">{error}</AlertDescription>
        </Alert>
      ) : recordings.length === 0 ? (
        <div className="text-center py-12">
          <FileAudio className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">אין הקלטות עדיין</h3>
          <p className="text-gray-600 mb-6">
            לא נמצאו הקלטות במערכת. התחילו להקליט את עצמכם מדברים אנגלית כדי לראות את ההקלטות כאן.
          </p>
          <Button onClick={() => router("/record")} className="bg-blue-700 hover:bg-blue-800">
            להתחלת הקלטה חדשה
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recordings.map((recording, index) => (
            <motion.div
              key={recording.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                className={`border-2 bg-gradient-to-br ${getCardColor(recording.id)} hover:shadow-md transition-all duration-300 relative overflow-hidden`}
              >
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-600 rotate-12 z-0"></div>
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-700 font-bold z-10 border-2 border-blue-600">
                  {index + 1}
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-blue-700 flex items-center gap-2">
                    <FileAudio className="h-5 w-5" />
                    {recording.name}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      <span>נושא: {recording.topicId ? `נושא ${recording.topicId}` : "לא צוין"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span>תאריך: {formatDate(recording.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>משך: {recording.length}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    onClick={() => playRecording(recording.id, recording.url)}
                    className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
                    disabled={currentlyPlaying === recording.id}
                  >
                    {currentlyPlaying === recording.id ? (
                      <>
                        <Headphones className="h-4 w-4 animate-pulse" />
                        מנגן כעת...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        האזנה להקלטה
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
// "use client"

// import { useState, useEffect, useRef } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Play, Pause, Trash2, Download, Clock, Volume2, VolumeX } from "lucide-react"
// import {
//   Card,
//   CardContent,
//   Slider,
//   Typography,
//   IconButton,
//   Box,
//   Snackbar,
//   Alert,
//   CircularProgress,
// } from "@mui/material"
// import userStore from "../stores/userStore"

// interface Recording {
//   id: string
//   title: string
//   url: string
//   duration: number
//   createdAt: string
// }

// interface SnackbarMessage {
//   message: string
//   severity: "success" | "error" | "info" | "warning"
// }

// export default function RecordingsPlayer() {
//   const [recordings, setRecordings] = useState<Recording[]>([])
//   const [loading, setLoading] = useState(true)
//   const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [currentTime, setCurrentTime] = useState(0)
//   const [duration, setDuration] = useState(0)
//   const [volume, setVolume] = useState(0.7)
//   const [isMuted, setIsMuted] = useState(false)
//   const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null)
//   const audioRef = useRef<HTMLAudioElement | null>(null)

//   // Create audio element
//   useEffect(() => {
//     audioRef.current = new Audio()
//     audioRef.current.volume = volume

//     audioRef.current.addEventListener("timeupdate", updateProgress)
//     audioRef.current.addEventListener("ended", handleEnded)
//     audioRef.current.addEventListener("loadedmetadata", handleMetadata)

//     return () => {
//       if (audioRef.current) {
//         audioRef.current.removeEventListener("timeupdate", updateProgress)
//         audioRef.current.removeEventListener("ended", handleEnded)
//         audioRef.current.removeEventListener("loadedmetadata", handleMetadata)
//         audioRef.current.pause()
//       }
//     }
//   }, [])

//   // Fetch recordings
//   useEffect(() => {
//     fetchRecordings()
//   }, [])

//   // Update audio volume when volume state changes
//   useEffect(() => {
//     if (audioRef.current) {
//       audioRef.current.volume = isMuted ? 0 : volume
//     }
//   }, [volume, isMuted])

//   const fetchRecordings = async () => {
//     try {
//       setLoading(true)
//       // Assuming the API endpoint follows the same pattern as the delete endpoint
//       const userId = userStore.user?.id
//       const response = await fetch(`http://localhost:5092/api/Conversation/user/${userId}`)

//       if (!response.ok) {
//         throw new Error("Failed to fetch recordings")
//       }

//       const data = await response.json()
//       setRecordings(data)
//     } catch (error) {
//       console.error("Error fetching recordings:", error)
//       setSnackbar({
//         message: "Failed to load your recordings. Please try again.",
//         severity: "error",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const updateProgress = () => {
//     if (audioRef.current) {
//       setCurrentTime(audioRef.current.currentTime)
//     }
//   }

//   const handleMetadata = () => {
//     if (audioRef.current) {
//       setDuration(audioRef.current.duration)
//     }
//   }

//   const handleEnded = () => {
//     setIsPlaying(false)
//     setCurrentTime(0)
//   }

//   const togglePlayPause = (recordingId: string, url: string) => {
//     if (currentlyPlaying === recordingId && isPlaying) {
//       // Pause current recording
//       audioRef.current?.pause()
//       setIsPlaying(false)
//     } else if (currentlyPlaying === recordingId && !isPlaying) {
//       // Resume current recording
//       audioRef.current?.play()
//       setIsPlaying(true)
//     } else {
//       // Play new recording
//       if (audioRef.current) {
//         audioRef.current.src = url
//         audioRef.current.currentTime = 0
//         audioRef.current
//           .play()
//           .then(() => {
//             setIsPlaying(true)
//             setCurrentlyPlaying(recordingId)
//           })
//           .catch((err) => {
//             console.error("Error playing audio:", err)
//             setSnackbar({
//               message: "Could not play this recording. Please try again.",
//               severity: "error",
//             })
//           })
//       }
//     }
//   }

//   const handleSliderChange = (_event: Event, value: number | number[]) => {
//     if (audioRef.current && currentlyPlaying) {
//       const newTime = Array.isArray(value) ? value[0] : value
//       audioRef.current.currentTime = newTime
//       setCurrentTime(newTime)
//     }
//   }

//   const handleVolumeChange = (_event: Event, value: number | number[]) => {
//     const newVolume = Array.isArray(value) ? value[0] : value
//     setVolume(newVolume)
//     if (newVolume > 0 && isMuted) {
//       setIsMuted(false)
//     }
//   }

//   const toggleMute = () => {
//     setIsMuted(!isMuted)
//   }

//   const deleteRecording = async (recordingId: string) => {
//     try {
//       // If this is the currently playing recording, stop it
//       if (currentlyPlaying === recordingId) {
//         audioRef.current?.pause()
//         setIsPlaying(false)
//         setCurrentlyPlaying(null)
//       }

//       // Call the provided delete function
//       await deleteRecordFromDB(recordingId)

//       // Update the UI
//       setRecordings(recordings.filter((rec) => rec.id !== recordingId))

//       setSnackbar({
//         message: "Recording deleted successfully",
//         severity: "success",
//       })
//     } catch (error) {
//       console.error("Error deleting recording:", error)
//       setSnackbar({
//         message: "Failed to delete recording. Please try again.",
//         severity: "error",
//       })
//     }
//   }

//   const downloadRecording = async (url: string, title: string) => {
//     try {
//       const response = await fetch(url)
//       const blob = await response.blob()

//       // Create a download link
//       const downloadLink = document.createElement("a")
//       downloadLink.href = URL.createObjectURL(blob)
//       downloadLink.download = `${title || "recording"}.mp3`

//       // Trigger download
//       document.body.appendChild(downloadLink)
//       downloadLink.click()
//       document.body.removeChild(downloadLink)
//     } catch (error) {
//       console.error("Error downloading recording:", error)
//       setSnackbar({
//         message: "Failed to download recording. Please try again.",
//         severity: "error",
//       })
//     }
//   }

//   const formatTime = (time: number) => {
//     const minutes = Math.floor(time / 60)
//     const seconds = Math.floor(time % 60)
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
//   }

//   // Using the provided delete function
//   async function deleteRecordFromDB(recordId: any) {
//     try {
//       const response = await fetch(`http://localhost:5092/api/Conversation/${recordId}`, {
//         method: "DELETE",
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to delete record with ID ${recordId}`)
//       }

//       console.log(`Record with ID ${recordId} deleted successfully`)
//     } catch (err) {
//       console.error("Error deleting record:", err)
//       throw err // Re-throw to handle in the calling function
//     }
//   }

//   const handleCloseSnackbar = () => {
//     setSnackbar(null)
//   }

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "64px" }}>
//         <CircularProgress color="primary" />
//       </Box>
//     )
//   }

//   if (recordings.length === 0) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "16rem",
//           textAlign: "center",
//           padding: "1rem",
//         }}
//       >
//         <Box sx={{ fontSize: "4rem", mb: 2 }}>🎙️</Box>
//         <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
//           No recordings yet
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           Your recordings will appear here once you create them.
//         </Typography>
//       </motion.div>
//     )
//   }

//   return (
//     <Box sx={{ width: "100%", maxWidth: "64rem", mx: "auto", p: 2 }}>
//       <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
//         <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
//           Your Recordings
//         </Typography>
//       </motion.div>

//       <AnimatePresence>
//         {recordings.map((recording, index) => (
//           <motion.div
//             key={recording.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, x: -100 }}
//             transition={{ delay: index * 0.05 }}
//           >
//             <Card
//               sx={{
//                 mb: 2,
//                 overflow: "hidden",
//                 border: currentlyPlaying === recording.id ? "2px solid" : "1px solid",
//                 borderColor: currentlyPlaying === recording.id ? "primary.main" : "divider",
//               }}
//             >
//               <CardContent sx={{ p: 0 }}>
//                 <Box sx={{ p: 2 }}>
//                   <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <IconButton
//                         sx={{
//                           mr: 1,
//                           color: currentlyPlaying === recording.id ? "primary.main" : "inherit",
//                         }}
//                         onClick={() => togglePlayPause(recording.id, recording.url)}
//                       >
//                         {currentlyPlaying === recording.id && isPlaying ? (
//                           <Pause fontSize="small" />
//                         ) : (
//                           <Play fontSize="small" />
//                         )}
//                       </IconButton>
//                       <Box>
//                         <Typography variant="body1" sx={{ fontWeight: 500 }}>
//                           {recording.title || `Recording ${index + 1}`}
//                         </Typography>
//                         <Box
//                           sx={{ display: "flex", alignItems: "center", fontSize: "0.75rem", color: "text.secondary" }}
//                         >
//                           <Clock size={12} style={{ marginRight: "4px" }} />
//                           <Typography variant="caption">
//                             {new Date(recording.createdAt).toLocaleDateString()}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     </Box>
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <IconButton
//                         size="small"
//                         sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
//                         onClick={() => downloadRecording(recording.url, recording.title || `Recording_${index + 1}`)}
//                       >
//                         <Download size={16} />
//                       </IconButton>
//                       <IconButton
//                         size="small"
//                         sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
//                         onClick={() => deleteRecording(recording.id)}
//                       >
//                         <Trash2 size={16} />
//                       </IconButton>
//                     </Box>
//                   </Box>

//                   {currentlyPlaying === recording.id && (
//                     <motion.div
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: "auto" }}
//                       exit={{ opacity: 0, height: 0 }}
//                       style={{ marginTop: "8px" }}
//                     >
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
//                         <Typography variant="caption">{formatTime(currentTime)}</Typography>
//                         <Slider
//                           value={currentTime}
//                           max={duration}
//                           step={0.1}
//                           onChange={handleSliderChange}
//                           sx={{ flex: 1 }}
//                         />
//                         <Typography variant="caption">{formatTime(duration)}</Typography>
//                       </Box>
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                         <IconButton
//                           size="small"
//                           sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
//                           onClick={toggleMute}
//                         >
//                           {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
//                         </IconButton>
//                         <Slider
//                           value={volume}
//                           max={1}
//                           step={0.01}
//                           onChange={handleVolumeChange}
//                           sx={{ width: "96px" }}
//                         />
//                       </Box>
//                     </motion.div>
//                   )}
//                 </Box>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </AnimatePresence>

//       <Snackbar
//         open={!!snackbar}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         {snackbar ? (
//           <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
//             {snackbar.message}
//           </Alert>
//         ) : undefined}

//       </Snackbar>
//     </Box>
//   )
// }






// import React, { useState, useEffect, useRef } from 'react';
// import { Play, Pause, Volume2, Calendar, Clock, Trash2 } from 'lucide-react';
// import recordStore from '../stores/recordStore';
// import userStore from '../stores/userStore';

// import { Record } from '../models/record';
// // רכיב הצגת ההקלטות
// const RecordingsDisplay: React.FC = () => {
//   const [groupedRecords, setGroupedRecords] = useState<{ [key: string]: Record[] }>({});
//   const [currentlyPlaying, setCurrentlyPlaying] = useState<Record | null>(null);
//   const [hoveredRecord, setHoveredRecord] = useState<string | null>(null);
//   const [expandedTopics, setExpandedTopics] = useState<{ [key: string]: boolean }>({});
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   useEffect(() => {
//     const fetchRecords = async () => {
//       try {
//         // שליפת ההקלטות מהמאגר לפי מזהה המשתמש
//         const records: Record[] = await recordStore.getRecordsByUserId(userStore.user?.id);
        
//         // קיבוץ ההקלטות לפי נושאים
//         const grouped: { [key: string]: Record[] } = records.reduce((acc, record) => {
//           const topicName = record.topicName;
//           if (!acc[topicName]) {
//             acc[topicName] = [];
//           }
//           acc[topicName].push(record);
//           return acc;
//         }, {} as { [key: string]: Record[] });

//         // מיון ההקלטות בתוך כל נושא לפי תאריך (מהחדש לישן)
//         Object.keys(grouped).forEach(topic => {
//           grouped[topic].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//         });

//         setGroupedRecords(grouped);

//         // אתחול של כל הנושאים כמורחבים
//         const initialExpanded: { [key: string]: boolean } = {};
//         Object.keys(grouped).forEach(topic => {
//           initialExpanded[topic] = true;
//         });
//         setExpandedTopics(initialExpanded);
//       } catch (error) {
//         console.error('Error fetching records:', error);
//       }
//     };

//     fetchRecords();
//   }, []);

//   const handlePlayPause = async (record: Record) => {
//     if (currentlyPlaying?.id === record.id) {
//       if (audioRef.current) {
//         audioRef.current.pause();
//         setCurrentlyPlaying(null);
//       }
//     } else {
//       if (audioRef.current) {
//         audioRef.current.pause();
//       }
      
//       try {
//         const audioUrl = record.url;
//         const audio = new Audio(audioUrl);
//         audioRef.current = audio;
        
//         audio.onended = () => {
//           setCurrentlyPlaying(null);
//         };
        
//         audio.onerror = () => {
//           console.error('Error playing audio');
//           setCurrentlyPlaying(null);
//         };
        
//         await audio.play();
//         setCurrentlyPlaying(record);
//       } catch (error) {
//         console.error('Error playing audio:', error);
//       }
//     }
//   };

//   const toggleTopic = (topicName: string) => {
//     setExpandedTopics(prev => ({
//       ...prev,
//       [topicName]: !prev[topicName]
//     }));
//   };

//   const formatDate = (date: string) => {
//     return new Intl.DateTimeFormat('he-IL', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     }).format(new Date(date));
//   };

//   const handleDelete = async (recordId: string) => {
//     console.log('Deleting record:', recordId);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent mb-4">
//             ההקלטות שלי
//           </h1>
//           <p className="text-gray-600 text-lg">
//             כל ההקלטות שלך מקובצות לפי נושאים
//           </p>
//         </div>

//         {/* Topics */}
//         <div className="space-y-8">
//           {Object.entries(groupedRecords).map(([topicName, records]) => (
//             <div key={topicName} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
//               {/* Topic Header */}
//               <button
//                 onClick={() => toggleTopic(topicName)}
//                 className="w-full px-8 py-6 bg-gradient-to-r from-blue-500 to-red-500 text-white font-semibold text-xl text-right flex items-center justify-between hover:from-blue-600 hover:to-red-600 transition-all duration-300"
//               >
//                 <div className="flex items-center space-x-3">
//                   <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
//                     {records.length} הקלטות
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <span>{topicName}</span>
//                   <div className={`transform transition-transform duration-300 ${expandedTopics[topicName] ? 'rotate-180' : ''}`}>
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//               </button>

//               {/* Records Grid */}
//               <div className={`transition-all duration-500 ease-in-out ${
//                 expandedTopics[topicName] 
//                   ? 'max-h-none opacity-100' 
//                   : 'max-h-0 opacity-0 overflow-hidden'
//               }`}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
//                   {records.map((record) => (
//                     <div
//                       key={record.id}
//                       className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//                       onMouseEnter={() => setHoveredRecord(record.id)}
//                       onMouseLeave={() => setHoveredRecord(null)}
//                     >
//                       {/* Record Header */}
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="flex-1">
//                           <h3 className="font-semibold text-gray-800 text-lg mb-2 text-right">
//                             {record.name}
//                           </h3>
//                           <div className="flex items-center justify-end space-x-2 text-sm text-gray-500 mb-1">
//                             <span>{formatDate(record.date)}</span>
//                             <Calendar className="w-4 h-4" />
//                           </div>
//                           <div className="flex items-center justify-end space-x-2 text-sm text-gray-500">
//                             <span>{record.length}</span>
//                             <Clock className="w-4 h-4" />
//                           </div>
//                         </div>
//                       </div>

//                       {/* Audio Visualization */}
//                       <div className="relative mb-4">
//                         <div className="flex items-center justify-center space-x-1 h-12">
//                           {[...Array(20)].map((_, i) => (
//                             <div
//                               key={i}
//                               className={`w-1 bg-gradient-to-t from-blue-400 to-red-400 rounded-full transition-all duration-200 ${
//                                 currentlyPlaying?.id === record.id 
//                                   ? 'animate-pulse' 
//                                   : ''
//                               }`}
//                               style={{
//                                 height: `${20 + Math.random() * 20}px`,
//                                 animationDelay: `${i * 50}ms`
//                               }}
//                             />
//                           ))}
//                         </div>
//                       </div>

//                       {/* Controls */}
//                       <div className="flex items-center justify-between">
//                         <button
//                           onClick={() => handleDelete(record.id)}
//                           className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all duration-300 p-2 hover:bg-red-50 rounded-lg"
//                         >
//                           <Trash2 className="w-5 h-5" />
//                         </button>

//                         <button
//                           onClick={() => handlePlayPause(record)}
//                           className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 transform hover:scale-110 ${
//                             currentlyPlaying?.id === record.id
//                               ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white shadow-lg'
//                               : 'bg-gradient-to-r from-blue-500 to-red-500 text-white opacity-0 group-hover:opacity-100 shadow-lg'
//                           } ${
//                             hoveredRecord === record.id || currentlyPlaying?.id === record.id
//                               ? 'opacity-100'
//                               : ''
//                           }`}
//                         >
//                           {currentlyPlaying?.id === record.id ? (
//                             <Pause className="w-6 h-6" />
//                           ) : (
//                             <Play className="w-6 h-6 mr-1" />
//                           )}
//                         </button>
//                       </div>

//                       {/* Playing Indicator */}
//                       {currentlyPlaying?.id === record.id && (
//                         <div className="absolute top-4 left-4">
//                           <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
//                             <Volume2 className="w-4 h-4" />
//                             <span>מתנגן</span>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Empty State */}
//         {Object.keys(groupedRecords).length === 0 && (
//           <div className="text-center py-16">
//             <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-red-100 rounded-full flex items-center justify-center">
//               <Volume2 className="w-12 h-12 text-gray-400" />
//             </div>
//             <h3 className="text-2xl font-semibold text-gray-700 mb-2">
//               עדיין אין הקלטות
//             </h3>
//             <p className="text-gray-500">
//               התחל להקליט כדי לראות את ההקלטות שלך כאן
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RecordingsDisplay;
