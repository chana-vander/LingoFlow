
// //הקוד הזה מעלה קבצי הקלטה לבקט ברוך ד
// import React, { useState, useRef, useEffect } from 'react';
// import userStore from '../stores/userStore';
// import { observer } from 'mobx-react-lite';
// import { Record } from '../models/record';

// const UploadRecording: React.FC = observer(() => {
//   // State variables
//   const userId=userStore.user?.id;
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioURL, setAudioURL] = useState<string | null>(null);
//   const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
//   const [duration, setDuration] = useState(0);
//   const [fileName, setFileName] = useState('');
//   const [presignedUrl, setPresignedUrl] = useState<string | null>(null);

//   // const audioRef = useRef<null>(null);
//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const chunksRef = useRef<Blob[]>([]);

//   // Start recording
//   const startRecording = async () => {
//     if (!userId) return alert('לא נמצא מזהה משתמש!');  // Ensure userId is available
//     chunksRef.current = [];

//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     mediaRecorderRef.current = new MediaRecorder(stream);

//     mediaRecorderRef.current.ondataavailable = (e) => {
//       chunksRef.current.push(e.data);
//     };

//     mediaRecorderRef.current.onstop = () => {
//       const audioBlob = new Blob(chunksRef.current, { type: 'audio/mp3' });
//       setAudioBlob(audioBlob);
//       const audioURL = URL.createObjectURL(audioBlob);
//       setAudioURL(audioURL);
//     };

//     mediaRecorderRef.current.start();
//     setIsRecording(true);
//     setDuration(0);

//     const interval = setInterval(() => {
//       setDuration(prev => prev + 1);
//     }, 1000);

//     // Stop recording after 5 minutes for example (you can adjust this)
//     setTimeout(() => {
//       clearInterval(interval);
//       stopRecording();
//     }, 5 * 60 * 1000); // Stop after 5 minutes
//   };

//   // Stop recording
//   const stopRecording = () => {
//     mediaRecorderRef.current?.stop();
//     setIsRecording(false);
//   };

//   // Handle file name input change
//   const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFileName(e.target.value);
//   };

//   const getPresignedUrl = async (fileName: string) => {
//     if (!userId) return;  // ודא ש-userId קיים

//     const uniqueFileName = `${userId}/${fileName}-${new Date().toISOString()}.mp3`;

//     try {
//       console.log(uniqueFileName);
//       console.log(`http://localhost:5092/api/upload/presigned-url?fileName=${uniqueFileName}`);


//       const response = await fetch(`http://localhost:5092/api/upload/presigned-url?fileName=${uniqueFileName}`);

//       if (!response.ok) {  // אם ה-API מחזיר שגיאה
//         throw new Error('Failed to fetch presigned URL');
//       }

//       const data = await response.json();
//       console.log("data: ",data);

//       if (data.url) {
//         setPresignedUrl(data.url);  // שמירת ה-URL המוסמך בסטייט
//       }
//     } catch (error) {
//       console.error('Error fetching presigned URL:', error);
//       alert('שגיאה בהבאת ה-URL המוסמך');
//     }
//   };

//   const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
//     // קריאה לפונקציה האסינכרונית עם שם הקובץ
//     await getPresignedUrl(fileName);  // שלח את fileName שהמשתמש הזין
//     console.log('Finished fetching presigned URL');
//   };


//   const uploadFileToS3 = async () => {
//     if (!audioBlob || !presignedUrl) {
//       alert('אין קובץ או URL מוסמך להעלאה');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', audioBlob, `${userId}/${fileName}-${new Date().toISOString()}.mp3`);

//     try {
//       const response = await fetch(presignedUrl, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'audio/mp3', // סוג תוכן של הקובץ
//         },
//         body: audioBlob, // הגוף הוא הקובץ עצמו
//       });

//       if (response.ok) {
//         alert('ההקלטה הועלתה בהצלחה!');
//       } else {
//         alert('שגיאה בהעלאת הקובץ.');
//       }
//     } catch (error) {
//       console.error('Error uploading to S3:', error);
//       alert('שגיאה בהעלאת הקובץ.');
//     }
//   };

//   return (
//     <div>
//       <h2>הקלטה ותפעול</h2>

//       <div>
//         <label>שם הקובץ:</label>
//         <input
//           type="text"
//           value={fileName}
//           onChange={handleFileNameChange}
//           placeholder="הזן שם עבור ההקלטה שלך"
//         />
//       </div>

//       <div>
//         <button onClick={startRecording} disabled={isRecording}>
//           התחל הקלטה
//         </button>
//         <button onClick={stopRecording} disabled={!isRecording}>
//           עצור הקלטה
//         </button>
//       </div>

//       <div>
//         {isRecording && <p>זמן הקלטה: {duration} שניות</p>}
//       </div>

//       <div>
//         {audioURL && (
//           <>
//             <h3>הקלטה מוכנה! להאזנה:</h3>
//             <audio ref={audioRef} controls src={audioURL}></audio>
//           </>
//         )}
//       </div>


//       <div>
//         {/* <button onClick={getPresignedUrl(fileName)} disabled={!fileName}>
//           קבל URL להעלאה ל-S3
//         </button> */}
//         <button onClick={handleClick}>Get Presigned URL</button>
//         <button onClick={uploadFileToS3} disabled={!presignedUrl || !audioBlob}>
//           העלה את הקובץ ל-S3
//         </button>
//       </div>

//       <div>
//         <button onClick={() => window.open(audioURL ?? '', '_blank')} disabled={!audioURL}>
//           הורד את הקובץ
//         </button>
//         <button onClick={() => navigator.share({ title: 'הקלטה שלי', url: audioURL ?? '' })} disabled={!audioURL}>
//           שתף את הקובץ
//         </button>

//       </div>
//     </div>
//   );
// });

// export default UploadRecording;

"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { observer } from "mobx-react-lite"
import AudioTranscriber from "./audioTranscriber"
import userStore from "../stores/userStore"
import topicStore from "../stores/topicStore"
import recordStore from "../stores/recordStore"
import {  useNavigate } from "react-router-dom"
import { Mic, Square, X, Play, Pause, Upload, Download, Share2, RefreshCw } from "lucide-react"
import '../style/record.css'
import { Record } from "../models/record";
// import { feedbackStore } from "../stores/feedbackStore"
import { toJS } from "mobx"
// import { transaction } from "mobx"

const AudioRecorder: React.FC = observer(() => {
  // User ID from store
  const userId = userStore.user?.id

  // Recording states
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [duration, setDuration] = useState(0)
  const [recordingName, setRecordingName] = useState("")
  // const [presignedUrl, setPresignedUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Topics state
  // const [topics, setTopics] = useState<Topic[]>([]);
  // const topics = topicStore.fetchTopics();
  // const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const selectedTopic = topicStore.selectedTopicId;
  const navigate = useNavigate();
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch topics on component mount
  useEffect(() => {
    topicStore.fetchTopics();
  }, [])

  // Handle audio playback state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onplay = () => setIsPlaying(true)
      audioRef.current.onpause = () => setIsPlaying(false)
      audioRef.current.onended = () => setIsPlaying(false)
    }

    return () => {
      // Clean up on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [audioRef.current])

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Fetch topics from API
  // const fetchTopics = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5092/api/Topic")
  //     if (response.ok) {
  //       const data = await response.json()
  //       setTopics(data)
  //       if (data.length > 0) {
  //         setSelectedTopic(data[0].id)
  //       }
  //     } else {
  //       console.error("Failed to fetch topics")
  //     }
  //   } catch (error) {
  //     console.error("Error fetching topics:", error)
  //   }
  // }
  // const fetchTopics = topicStore.fetchTopics;
  // Start recording
  const startRecording = async () => {
    if (!userId) {
      showNotification("לא נמצא מזהה משתמש!", "error")
      return
    }

    try {
      chunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      mediaRecorderRef.current = new MediaRecorder(stream)

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/mp3" })
        setAudioBlob(audioBlob)
        const audioURL = URL.createObjectURL(audioBlob)
        setAudioURL(audioURL)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setIsPaused(false)
      setDuration(0)

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)

      showNotification("ההקלטה התחילה", "success")
    } catch (error) {
      console.error("Error starting recording:", error)
      showNotification("שגיאה בהתחלת ההקלטה", "error")
    }
  }

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      showNotification("ההקלטה הושהתה", "info")
    }
  }

  // Resume recording
  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
      showNotification("ההקלטה ממשיכה", "info")
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      (mediaRecorderRef.current.state === "recording" || mediaRecorderRef.current.state === "paused")
    ) {
      mediaRecorderRef.current.stop()
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      setIsRecording(false)
      setIsPaused(false)
      showNotification("ההקלטה הסתיימה", "success")
    }
  }

  // Cancel recording
  const cancelRecording = () => {
    if (
      mediaRecorderRef.current &&
      (mediaRecorderRef.current.state === "recording" || mediaRecorderRef.current.state === "paused")
    ) {
      mediaRecorderRef.current.stop()
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }

    setIsRecording(false)
    setIsPaused(false)
    setAudioURL(null)
    setAudioBlob(null)
    setDuration(0)
    showNotification("ההקלטה בוטלה", "info")
  }

  // Reset recording (start new)
  const resetRecording = () => {
    setAudioURL(null)
    setAudioBlob(null)
    setDuration(0)
    // setPresignedUrl(null)
    setUploadProgress(0)
    showNotification("מוכן להקלטה חדשה", "info")
  }
  const uniqueFileName = `${userId}/${recordingName}-${new Date().toISOString()}.mp3`
  // const DownloadUrl =recordStore.getDownloadUrl(recordingName);
  // Get presigned URL for S3 upload
  // const getPresignedUrl = async () => {
  //   if (!userId || !recordingName || !selectedTopic) {
  //     showNotification("חסרים פרטים: שם הקלטה או נושא", "error")
  //     return
  //   }

  //   // const uniqueFileName = `${userId}/${recordingName}-${new Date().toISOString()}.mp3`

  //   try {
  //     const response = await fetch(`http://localhost:5092/api/upload/presigned-url?fileName=${uniqueFileName}`)

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch presigned URL")
  //     }

  //     const data = await response.json()
  //     console.log("data.url: ", data.url);

  //     if (data.url) {
  //       setPresignedUrl(data.url)
  //       showNotification("מוכן להעלאה", "success")
  //       return data.url
  //     }
  //   } catch (error) {
  //     console.error("Error fetching presigned URL:", error)
  //     showNotification("שגיאה בהבאת ה-URL המוסמך", "error")
  //   }

  //   return null
  // }


  // Upload file to S3
  const uploadFileToS3 = async () => {
    if (!audioBlob) {
      showNotification("אין קובץ להעלאה", "error")
      return
    }

    const url = await recordStore.getPresignedUrl(uniqueFileName);
    console.log("url: ", url);
    if (!url) {
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const xhr = new XMLHttpRequest()

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(progress)
        }
      }

      xhr.onload = async () => {
        if (xhr.status === 200) {
          // Save record to database
          const downloadUrl = await recordStore.getDownloadUrl(uniqueFileName);
          if (downloadUrl)
            await saveRecordToDatabase(downloadUrl)
          setIsUploading(false)
          setUploadProgress(100)
          showNotification("ההקלטה הועלתה בהצלחה!", "success")
        } else {
          setIsUploading(false)
          showNotification("שגיאה בהעלאת הקובץ", "error")
        }
      }

      xhr.onerror = () => {
        setIsUploading(false)
        showNotification("שגיאה בהעלאת הקובץ", "error")
      }

      xhr.open("PUT", url)
      xhr.setRequestHeader("Content-Type", "audio/mp3")
      xhr.send(audioBlob)
    } catch (error) {
      console.error("Error uploading to S3:", error)
      setIsUploading(false)
      showNotification("שגיאה בהעלאת הקובץ", "error")
    }
  }

  const saveRecordToDatabase = async (DownloadUrl: string) => {
    if (!userId || !selectedTopic || !recordingName) {
      showNotification("חסרים פרטים לשמירה במסד הנתונים", "error")
      return
    }

    const record: Record = {
      name: recordingName,
      date: new Date(),
      length: formatTime(duration),
      url: DownloadUrl,
      topicId: selectedTopic,
      userId: userId
    }
    // recordStore.setRecording(record);
    await recordStore.saveAndStoreRecording(record);
    console.log(toJS(recordStore.recording));
  }
  //בדיקה האם התמלול עובד-אחכ למחוק מפה
  // const r = recordStore.recording;
  // // console.log("r ", r);
  // if (r?.id !== undefined) {
  //   console.log("r.id is undefined", r.id);
  //   const transcription = feedbackStore.transcribeFromUrl(r.url, r.id);
  //   console.log(transcription);
  //   if (selectedTopic) {
  //     const feed = feedbackStore.analyzeTranscription(r.url, selectedTopic, r.id);
  //     console.log("feed: ", feed);
  //   }
  //   //בדיקה האם המשוב עובד-אחכ למחוק מפה
  // }

  // Save record to database
  // const saveRecordToDatabase = async (DownloadUrl: string) => {
  //   if (!userId || !selectedTopic || !recordingName) {
  //     // showNotification("חסרים פרטים לשמירה במסד הנתונים", "error")
  //     return
  //   }

  //   const record: Record = {
  //     userId: userId,
  //     topicId: selectedTopic,
  //     name: recordingName,
  //     length: formatTime(duration),
  //     // url: url,
  //     url: DownloadUrl,
  //     // url: uniqueFileName,
  //     date: new Date(),
  //   }

  //   try {
  //     const response = await fetch("http://localhost:5092/api/Conversation", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(record),
  //     })

  //     if (!response.ok) {
  //       throw new Error("Failed to save record to database")
  //     }

  //     showNotification("פרטי ההקלטה נשמרו במסד הנתונים", "success")
  //   } catch (error) {
  //     console.error("Error saving record to database:", error)
  //     showNotification("שגיאה בשמירת פרטי ההקלטה", "error")
  //   }
  // }
  // Download recording
  const downloadRecording = () => {
    if (!audioURL) return

    const a = document.createElement("a")
    a.href = audioURL
    a.download = `${recordingName || "recording"}.mp3`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Share recording
  const shareRecording = async () => {
    if (!audioURL) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: recordingName || "הקלטה שלי",
          url: audioURL,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      showNotification("שיתוף אינו נתמך בדפדפן זה", "error")
    }
  }

  // Toggle audio playback
  const togglePlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
  }

  // Show notification
  const showNotification = (message: string, type: "success" | "error" | "info") => {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("show")
    }, 10)

    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  //getFeedback
  const getFeedback = () => {
    // recordStore.setRecording(recordingName: any);
    navigate("/feedback");
  }
  return (
    <>
      <div className="audio-recorder-container" dir="rtl">
        <div className="recorder-header">
          <h1>הי, {userStore.userName}</h1>
          <p className="subtitle">מחכים כבר להקלטה שלך...</p>
          {/* <p className="subtitle">כל הקלטה מקרבת אותך לעבר דיבור בטוח, טבעי וזורם</p> */}

        </div>

        <div className="recorder-card">
          <div className="recorder-form">
            <div className="form-group">
              <label htmlFor="recording-name">שם ההקלטה:</label>
              <input
                id="recording-name"
                type="text"
                value={recordingName}
                onChange={(e) => setRecordingName(e.target.value)}
                placeholder="הזן שם עבור ההקלטה שלך"
                disabled={isRecording}
                className="input-field"
              />
            </div>

            {/* <div className="form-group">
            <label htmlFor="topic-select">נושא ההקלטה:</label>
            <select
              id="topic-select"
              value={selectedTopic || ""}
              // onChange={(e) => setSelectedTopic(Number(e.target.value))}
              onChange={(e) => topics(Number(e.target.value))}
              disabled={isRecording}
              className="select-field"
            >
              <option value="" disabled>
                בחר נושא
              </option>
              {topics.map((topic:any) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div> */}
            <div className="form-group">
              <label htmlFor="topic-select">נושא ההקלטה:</label>
              <select
                id="topic-select"
                value={selectedTopic ?? ""}
                onChange={(e) => topicStore.setSelectedTopic(Number(e.target.value))}
                disabled={isRecording}
                className="select-field"
              >
                <option value="" disabled>
                  בחר נושא
                </option>
                {topicStore.topics.map((topic: any) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="recorder-controls">
            {!isRecording && !audioURL && (
              <button className="control-button primary" onClick={startRecording} disabled={!userId} title="התחל הקלטה">
                <Mic size={24} />
                <span>התחל הקלטה</span>
              </button>
            )}
            <button className="control-button primary" onClick={getFeedback}
              // disabled={!isUploading} 
              title="התחל הקלטה">
              <Mic size={24} />
              <span>שלח לקבלת משוב</span>
            </button>

            {isRecording && !isPaused && (
              <>
                <button className="control-button warning" onClick={pauseRecording} title="השהה הקלטה">
                  <Pause size={24} />
                  <span>השהה</span>
                </button>

                <button className="control-button danger" onClick={stopRecording} title="סיים הקלטה">
                  <Square size={24} />
                  <span>סיים</span>
                </button>

                <button className="control-button secondary" onClick={cancelRecording} title="בטל הקלטה">
                  <X size={24} />
                  <span>בטל</span>
                </button>
              </>
            )}

            {isRecording && isPaused && (
              <>
                <button className="control-button primary" onClick={resumeRecording} title="המשך הקלטה">
                  <Mic size={24} />
                  <span>המשך</span>
                </button>

                <button className="control-button danger" onClick={stopRecording} title="סיים הקלטה">
                  <Square size={24} />
                  <span>סיים</span>
                </button>

                <button className="control-button secondary" onClick={cancelRecording} title="בטל הקלטה">
                  <X size={24} />
                  <span>בטל</span>
                </button>
              </>
            )}
          </div>

          {isRecording && (
            <div className="recording-indicator">
              <div className={`pulse ${isPaused ? "paused" : ""}`}></div>
              <span className="recording-time">{formatTime(duration)}</span>
              <span className="recording-status">{isPaused ? "מושהה" : "מקליט..."}</span>
            </div>
          )}

          {audioURL && (
            <div className="playback-section">
              <h3>הקלטה מוכנה!</h3>

              <div className="audio-player">
                <audio ref={audioRef} src={audioURL} controls></audio>

                <div className="playback-controls">
                  <button
                    className="control-button secondary"
                    onClick={togglePlayback}
                    title={isPlaying ? "השהה" : "נגן"}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>

                  <button className="control-button secondary" onClick={downloadRecording} title="הורד">
                    <Download size={20} />
                  </button>

                  <button className="control-button secondary" onClick={shareRecording} title="שתף">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button
                  className="control-button primary"
                  onClick={uploadFileToS3}
                  disabled={isUploading || !recordingName || !selectedTopic}
                  title="העלה את ההקלטה"
                >
                  <Upload size={20} />
                  <span>העלה הקלטה</span>
                </button>

                <button
                  className="control-button secondary"
                  onClick={resetRecording}
                  disabled={isUploading}
                  title="הקלטה חדשה"
                >
                  <RefreshCw size={20} />
                  <span>הקלטה חדשה</span>
                </button>
              </div>

              {isUploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div>
        {audioBlob && audioURL && (
          <AudioTranscriber fileUrl={audioURL} />
        )}


      </div>
    </>
  )
})

export default AudioRecorder