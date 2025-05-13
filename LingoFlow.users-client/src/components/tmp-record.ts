// // import React, { useRef, useState } from "react";
// // import userStore from "../stores/userStore";

// // const Record = () => {
// //   const [isRecording, setIsRecording] = useState(false);
// //   const [seconds, setSeconds] = useState(0);
// //   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
// //   const timerRef = useRef<number | null>(null);
// //   const chunks = useRef<Blob[]>([]);

// //   const startRecording = async () => {
// //     try {
// //       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
// //       const mediaRecorder = new MediaRecorder(stream);
// //       mediaRecorderRef.current = mediaRecorder;
// //       chunks.current = [];

// //       mediaRecorder.ondataavailable = (e) => {
// //         if (e.data.size > 0) {
// //           chunks.current.push(e.data);
// //         }
// //       };

// //       mediaRecorder.onstop = () => {
// //         const audioBlob = new Blob(chunks.current, { type: 'audio/webm' });
// //         const audioUrl = URL.createObjectURL(audioBlob);
// //         console.log("הקלטה נשמרה:", audioUrl);
// //         // אפשר לשמור את הקובץ או לנגן אותו כאן
// //       };

// //       mediaRecorder.start();
// //       setIsRecording(true);
// //       setSeconds(0);

// //       timerRef.current = window.setInterval(() => {
// //         setSeconds((prev) => prev + 1);
// //       }, 1000);

// //     } catch (err) {
// //       console.error("שגיאה בגישה למיקרופון:", err);
// //     }
// //   };

// //   const stopRecording = () => {
// //     mediaRecorderRef.current?.stop();
// //     setIsRecording(false);
// //     if (timerRef.current !== null) {
// //       clearInterval(timerRef.current);
// //       timerRef.current = null;
// //     }
// //   };

// //   return (
// //     <>
// //       <button>שם ההקלטה שלך</button>
// //       {/* <button>בחר את נושא ההקלטה שלך</button> */}
// //       <button onClick={startRecording} disabled={isRecording}>התחל</button>
// //       <button onClick={stopRecording} disabled={!isRecording}>סיים</button>
// //       <button>שמור</button>
// //       <button>בטל</button>

// //       {isRecording && (
// //         <div style={{ marginTop: '10px', color: 'red', fontWeight: 'bold' }}>
// //           🔴 מקליט... {seconds} שניות
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default Record;

// import React, { useState, useRef, useEffect } from 'react';
// import { Record } from '../models/record';
// import userStore from '../stores/userStore';
// const UploadRecording: React.FC = () => {
//   // State variables
//   const userId = userStore.user?.id;
//   const [isRecording, setIsRecording] = useState(false);//delete?
//   const [audioURL, setAudioURL] = useState<string | null>(null);
//   const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
//   const [duration, setDuration] = useState(0);
//   const [fileName, setFileName] = useState('');
//   const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
//   const [topics, setTopics] = useState<String[]>([]);
//   const [timeStart, setTimeStart] = useState<any>(new Date());
//   const [timeEnd, setTimeEnd] = useState<any>(new Date());
//   const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

//   const audioRef = useRef<null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const chunksRef = useRef<Blob[]>([]);

//   useEffect(() => {
//     const fetchTopics = async () => {
//       // if (userId) { // רק אם יש userId, נטען את הנושאים
//       try {
//         const response = await fetch('http://localhost:5092/api/Topic');
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data: string[] = await response.json();
//         setTopics(data);
//         // setLoadingTopics(false);
//       } catch (e: any) {
//         // setErrorTopics(e.message);
//         // setLoadingTopics(false);
//         alert("topic not choice")
//       }
//     }

//     fetchTopics();
//   }, [userId]); // טען נושאים מחדש כאשר userId משתנה

//   // Start recording
//   const startRecording = async () => {
//     if (!userId) return alert('לא נמצא מזהה משתמש!');  // Ensure userId is available

//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     mediaRecorderRef.current = new MediaRecorder(stream);
//     setTimeStart(new Date());
//     mediaRecorderRef.current.ondataavailable = (e) => {
//       chunksRef.current.push(e.data);
//     };

//     mediaRecorderRef.current.onstop = () => {
//       const audioBlob = new Blob(chunksRef.current, { type: 'audio/mp4' });
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
//     setTimeEnd(new Date());
//     const len = `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`;
//     const formatData = {
//       userName: userStore.user?.name,
//       topicId: 2,
//       name: userStore.user?.name,
//       url: presignedUrl ?? '',
//       date: new Date()
//     }
//     // const len = `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`;
//     // const formatData: Record = {
//     //   userId: Number(userId),
//     //   topicId: Number(selectedTopic), // ודא ש-selectedTopic הוא ID ולא שם
//     //   name: fileName,
//     //   length: len,
//     //   url: presignedUrl ?? '',
//     //   date: new Date(),
//     // };

//     // const response = fetch("http://localhost:5092/api/conversation", {
//     //   method: 'POST', // או 'GET' בהתאם לסוג הבקשה שלך
//     //   headers: {
//     //     'Content-Type': 'application/json' // הגדרת סוג התוכן
//     //   },
//     //   body: JSON.stringify(formatData) // המרת הנתונים לאובייקט JSON
//     // })
//     //   .then(res => res.json()) // המרת התגובה לאובייקט JSON
//     //   .then(data => console.log(data)) // טיפול בתגובה
//     //   .catch(error => console.error('Error:', error)); // טיפול בשגיאות
//     // console.log("response; ", response);

//   };

//   // Handle file name input change
//   const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFileName(e.target.value);
//   };

//   const getPresignedUrl = async (fileName: string) => {
//     if (!userId)
//       return;  // ודא ש-`userId` קיים
//     console.log("userId ", userId);

//     const uniqueFileName = `userId:${userId}/${fileName}-${new Date().toISOString()}.mp4`;

//     try {
//       console.log(uniqueFileName);
//       console.log(`http://localhost:5092/api/upload/presigned-url?fileName=${uniqueFileName}`);

//       const response = await fetch(`http://localhost:5092/api/upload/presigned-url?fileName=${uniqueFileName}`);

//       if (!response.ok) {  // אם ה-API מחזיר שגיאה
//         throw new Error('Failed to fetch presigned URL');
//       }

//       const data = await response.json();
//       console.log("data: ", data);

//       if (data.url) {
//         setPresignedUrl(data.url);  // שמירת ה-URL המוסמך בסטייט
//       }
//     } catch (error) {
//       console.error('Error fetching presigned URL:', error);
//       alert('שגיאה בהבאת ה-URL המוסמך');
//     }
//   };

//   const uploadFileToS3 = async () => {
//     if (!audioBlob || !presignedUrl) {
//       alert('אין קובץ או URL מוסמך להעלאה');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', audioBlob, `${userId}/${fileName}-${new Date().toISOString()}.mp4`);

//     try {
//       const response = await fetch(presignedUrl, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'audio/mp4', // סוג תוכן של הקובץ
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
//         <label>שם ההקלטה:</label>
//         <input
//           type="text"
//           value={fileName}
//           onChange={handleFileNameChange}
//           placeholder="הזן שם עבור ההקלטה שלך"
//         />
//       </div>

//       <div>
//         <select onChange={(e) => setSelectedTopic(e.target.value)} value={selectedTopic ?? ''}>
//           <option value="">בחר נושא</option>
//           {topics.map((topic: any) => (
//             <option key={topic.id} value={topic.id}>
//               {topic.name}
//             </option>
//           ))}
//         </select>
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
//         <button onClick={() => getPresignedUrl(fileName)} disabled={!fileName}>Get Presigned URL</button>
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
// };

// export default UploadRecording;

// // import React, { useState, useRef, useEffect } from 'react';
// // import { Record } from '../models/record';
// // const UploadRecording: React.FC = () => {
// //   // State variables
// //   const [userId, setUserId] = useState<string | null>(null);  // Added state for userId
// //   const [isRecording, setIsRecording] = useState(false);
// //   const [audioURL, setAudioURL] = useState<string | null>(null);
// //   const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
// //   const [duration, setDuration] = useState(0);
// //   const [fileName, setFileName] = useState('');
// //   const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
// //   const [topics, setTopics] = useState<String[]>([]);
// //   const [timeStart, setTimeStart] = useState<any>(new Date());
// //   const [timeEnd, setTimeEnd] = useState<any>(new Date());
// //   const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

// //   const audioRef = useRef<null>(null);
// //   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
// //   const chunksRef = useRef<Blob[]>([]);

// //   // Fetch userId from localStorage if it exists
// //   useEffect(() => {
// //     const storedUserId = localStorage.getItem('userId');
// //     if (storedUserId) {
// //       setUserId(storedUserId);  // Set userId from localStorage
// //     }
// //     else {
// //       alert("לא נמצא מזהה משתמש  עליך להתחבר למערכת כדי להקליט")
// //     }
// //   }, []);
// //   useEffect(() => {
// //     const fetchTopics = async () => {
// //       // if (userId) { // רק אם יש userId, נטען את הנושאים
// //       try {
// //         const response = await fetch('http://localhost:5092/api/Topic');
// //         if (!response.ok) {
// //           throw new Error(`HTTP error! status: ${response.status}`);
// //         }
// //         const data: string[] = await response.json();
// //         setTopics(data);
// //         // setLoadingTopics(false);
// //       } catch (e: any) {
// //         // setErrorTopics(e.message);
// //         // setLoadingTopics(false);
// //         alert("topic not choice")
// //       }
// //     }
// //     // else {
// //     //   // אם אין userId, אל תנסה לטעון נושאים ועדכן את מצב הטעינה
// //     //   setLoadingTopics(false);
// //     // }
// //     // };

// //     fetchTopics();
// //   }, [userId]); // טען נושאים מחדש כאשר userId משתנה

// //   // const handleTopicChange = (event: ChangeEvent<HTMLSelectElement>) => {
// //   //   setSelectedTopic(event.target.value);
// //   // };

// //   // Start recording
// //   const startRecording = async () => {
// //     if (!userId) return alert('לא נמצא מזהה משתמש!');  // Ensure userId is available

// //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
// //     mediaRecorderRef.current = new MediaRecorder(stream);
// //     setTimeStart(new Date());
// //     mediaRecorderRef.current.ondataavailable = (e) => {
// //       chunksRef.current.push(e.data);
// //     };

// //     mediaRecorderRef.current.onstop = () => {
// //       const audioBlob = new Blob(chunksRef.current, { type: 'audio/mp4' });
// //       setAudioBlob(audioBlob);
// //       const audioURL = URL.createObjectURL(audioBlob);
// //       setAudioURL(audioURL);
// //     };

// //     mediaRecorderRef.current.start();
// //     setIsRecording(true);
// //     setDuration(0);

// //     const interval = setInterval(() => {
// //       setDuration(prev => prev + 1);
// //     }, 1000);

// //     // Stop recording after 5 minutes for example (you can adjust this)
// //     setTimeout(() => {
// //       clearInterval(interval);
// //       stopRecording();
// //     }, 5 * 60 * 1000); // Stop after 5 minutes
// //   };

// //   // Stop recording
// //   const stopRecording = () => {
// //     mediaRecorderRef.current?.stop();
// //     setIsRecording(false);
// //     setTimeEnd(new Date());
// //     const timeStart = new Date('2025-05-08T10:00:00'); // דוגמה לזמן התחלה
// //     const timeEnd = new Date(); // זמן סיום נוכחי

// //     // const diffInMilliseconds = timeEnd - timeStart;
// //     const formatData = { userId: 12, topicId: 1, url: "www", Name: "tmp", at: new Date(), s: new Date(), e: new Date(), len: "12:05" }

// //     const response = fetch("http://localhost:5092/api/conversation", {
// //       method: 'POST', // או 'GET' בהתאם לסוג הבקשה שלך
// //       headers: {
// //         'Content-Type': 'application/json' // הגדרת סוג התוכן
// //       },
// //       body: JSON.stringify(formatData) // המרת הנתונים לאובייקט JSON
// //     })
// //       .then(res => res.json()) // המרת התגובה לאובייקט JSON
// //       .then(data => console.log(data)) // טיפול בתגובה
// //       .catch(error => console.error('Error:', error)); // טיפול בשגיאות
// //     console.log("response; ", response);

// //   };

// //   // Handle file name input change
// //   const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setFileName(e.target.value);
// //   };

// //   // // Get presigned URL from backend (API)
// //   // const getPresignedUrl = async () => {
// //   //   if (!fileName || !userId)
// //   //     return;

// //   //   try {
// //   //     const response = await fetch(`/api/upload/presigned-url?fileName=${userId}/${fileName}-${new Date().toISOString()}.mp4`);
// //   //     const data = await response.json();
// //   //     setPresignedUrl(data.url);
// //   //   } catch (error) {
// //   //     console.error('Error getting presigned URL:', error);
// //   //   }
// //   // };
// //   // const getPresignedUrl = async (fileName: string) => {
// //   //   if (!userId) return;  // ודא ש-`userId` קיים

// //   //   // יצירת שם קובץ ייחודי בשילוב עם מזהה המשתמש
// //   //   const uniqueFileName = `${userId}/${fileName}-${new Date().toISOString()}.mp4`;

// //   //   try {
// //   //     const response = await fetch(`/api/upload/presigned-url?fileName=${uniqueFileName}`);
// //   //     const data = await response.json();
// //   //     if (data.url) {
// //   //       setPresignedUrl(data.url);  // שמירת ה-URL המוסמך בסטייט
// //   //     }
// //   //   } catch (error) {
// //   //     console.error('Error fetching presigned URL:', error);
// //   //   }
// //   // };
// //   const getPresignedUrl = async (fileName: string) => {
// //     if (!userId)
// //       return;  // ודא ש-`userId` קיים
// //     console.log("userId ", userId);

// //     const uniqueFileName = `userId:${userId}/${fileName}-${new Date().toISOString()}.mp4`;

// //     try {
// //       console.log(uniqueFileName);
// //       console.log(`http://localhost:5092/api/upload/presigned-url?fileName=${uniqueFileName}`);

// //       const response = await fetch(`http://localhost:5092/api/upload/presigned-url?fileName=${uniqueFileName}`);

// //       if (!response.ok) {  // אם ה-API מחזיר שגיאה
// //         throw new Error('Failed to fetch presigned URL');
// //       }

// //       const data = await response.json();
// //       console.log("data: ", data);

// //       if (data.url) {
// //         setPresignedUrl(data.url);  // שמירת ה-URL המוסמך בסטייט
// //       }
// //     } catch (error) {
// //       console.error('Error fetching presigned URL:', error);
// //       alert('שגיאה בהבאת ה-URL המוסמך');
// //     }
// //   };

// //   const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
// //     // קריאה לפונקציה האסינכרונית עם שם הקובץ
// //     await getPresignedUrl(fileName);  // שלח את `fileName` שהמשתמש הזין
// //     console.log('Finished fetching presigned URL');
// //   };

// //   // const getPresignedUrl = async () => {
// //   //   console.log("userId ", userId);
// //   //   if (!fileName || !userId) return;
// //   //   try {
// //   //     const response = await fetch(`/api/upload/presigned-url?fileName=${userId}/${fileName}-${new Date().toISOString()}.mp4`);

// //   //     // Check if the response is valid
// //   //     const textResponse = await response.text();  // Read the raw response as text
// //   //     console.log('Raw response:', textResponse);

// //   //     // If the response is in JSON format, parse it
// //   //     const data = JSON.parse(textResponse); // Try to parse it as JSON
// //   //     setPresignedUrl(data.url);
// //   //   } catch (error) {
// //   //     console.error('Error getting presigned URL:', error);
// //   //   }
// //   // };


// //   const uploadFileToS3 = async () => {
// //     if (!audioBlob || !presignedUrl) {
// //       alert('אין קובץ או URL מוסמך להעלאה');
// //       return;
// //     }

// //     const formData = new FormData();
// //     formData.append('file', audioBlob, `${userId}/${fileName}-${new Date().toISOString()}.mp4`);

// //     try {
// //       const response = await fetch(presignedUrl, {
// //         method: 'PUT',
// //         headers: {
// //           'Content-Type': 'audio/mp4', // סוג תוכן של הקובץ
// //         },
// //         body: audioBlob, // הגוף הוא הקובץ עצמו
// //       });
// //       console.log("response: ", response);

// //       if (response.ok) {
// //         alert('ההקלטה הועלתה בהצלחה!');
// //       } else {
// //         alert('שגיאה בהעלאת הקובץ.');
// //       }
// //     } catch (error) {
// //       console.error('Error uploading to S3:', error);
// //       alert('שגיאה בהעלאת הקובץ.');
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>הקלטה ותפעול</h2>

// //       <div>
// //         <label>שם ההקלטה:</label>
// //         <input
// //           type="text"
// //           value={fileName}
// //           onChange={handleFileNameChange}
// //           placeholder="הזן שם עבור ההקלטה שלך"
// //         />
// //       </div>

// //       <div>
// //         <button onClick={startRecording} disabled={isRecording}>
// //           התחל הקלטה
// //         </button>
// //         <button onClick={stopRecording} disabled={!isRecording}>
// //           עצור הקלטה
// //         </button>
// //       </div>

// //       <div>
// //         {isRecording && <p>זמן הקלטה: {duration} שניות</p>}
// //       </div>

// //       <div>
// //         {audioURL && (
// //           <>
// //             <h3>הקלטה מוכנה! להאזנה:</h3>
// //             <audio ref={audioRef} controls src={audioURL}></audio>
// //           </>
// //         )}
// //       </div>


// //       <div>
// //         {/* <button onClick={getPresignedUrl(fileName)} disabled={!fileName}>
// //           קבל URL להעלאה ל-S3
// //         </button> */}
// //         <button onClick={handleClick}>Get Presigned URL</button>
// //         <button onClick={uploadFileToS3} disabled={!presignedUrl || !audioBlob}>
// //           העלה את הקובץ ל-S3
// //         </button>
// //       </div>

// //       <div>
// //         <button onClick={() => window.open(audioURL ?? '', '_blank')} disabled={!audioURL}>
// //           הורד את הקובץ
// //         </button>
// //         <button onClick={() => navigator.share({ title: 'הקלטה שלי', url: audioURL ?? '' })} disabled={!audioURL}>
// //           שתף את הקובץ
// //         </button>

// //       </div>
// //     </div>
// //   );
// // };

// // export default UploadRecording;


// // // // // import { ReactMediaRecorder } from "react-media-recorder";
// // // // // import axios from "axios";
// // // // // import React from "react";

// // // // // const AudioRecorder = () => {
// // // // //   const handleStop = async (blobUrl: string, blob: Blob) => {
// // // // //     try {
// // // // //       const formData = new FormData();

// // // // //       // מוסיפה את קובץ ההקלטה ל־formData
// // // // //       formData.append("file", blob, "recording.wav");

// // // // //       // מזהה המשתמש מה־localStorage (בהנחה שהוא שמור שם)
// // // // //       const userId = localStorage.getItem("userId");
// // // // //       if (userId) {
// // // // //         formData.append("userId", userId);
// // // // //       }

// // // // //       // שליחת ההקלטה לשרת
// // // // //       const response = await axios.post("http://localhost:5092/api/Conversation", formData, {
// // // // //         headers: {
// // // // //           "Content-Type": "multipart/form-data"
// // // // //         }
// // // // //       });

// // // // //       console.log("ההקלטה נשלחה בהצלחה:", response.data);
// // // // //     } catch (error) {
// // // // //       console.error("שגיאה בשליחת ההקלטה:", error);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <ReactMediaRecorder
// // // // //       audio
// // // // //       onStop={handleStop}
// // // // //       render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
// // // // //         <div>
// // // // //           <p>סטטוס: {status}</p>
// // // // //           <button onClick={startRecording}>🎙️ התחל הקלטה</button>
// // // // //           <button onClick={stopRecording}>🛑 עצור ושלח</button>
// // // // //           {mediaBlobUrl && (
// // // // //             <audio src={mediaBlobUrl} controls />
// // // // //           )}
// // // // //         </div>
// // // // //       )}
// // // // //     />
// // // // //   );
// // // // // };

// // // // // export default AudioRecorder;

// // import { useState, useEffect } from 'react';
// // import { ReactMediaRecorder } from "react-media-recorder";

// // const AudioUpload = () => {
// //   const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

// //   // שליפת ה-ID מה-LocalStorage
// //   // const userId = localStorage.getItem('userId');
// //   const userId=3;

// //   useEffect(() => {
// //     if (!userId) {
// //       console.error('User ID not found in localStorage');
// //     }
// //   }, [userId]);

// //   // פונקציה להעלאת הקובץ ל-S3
// //   const uploadToS3 = (audioFile: Blob) => {
// //     if (!userId) {
// //       console.error('User ID not found');
// //       return;
// //     }

// //     const fileName = `${userId}/audio-${new Date().toISOString()}.mp4`; // ייחודיות לכל משתמש ולקובץ
// //     const params = {
// //       Bucket: bucketName,
// //       Key: fileName,
// //       Body: audioFile,
// //       ContentType: 'audio/mp4', // תאם לסוג הקובץ שלך
// //       ACL: 'private', // שמירה על ההקלטה פרטית
// //     };

// //     const command = new PutObjectCommand(params);

// //     // העלאת הקובץ ל-S3
// //     s3.send(command)
// //       .then((data) => {
// //         console.log('Successfully uploaded:', data);
// //         alert('ההקלטה הועלתה בהצלחה!');
// //       })
// //       .catch((err) => {
// //         console.error('Error uploading file:', err);
// //       });
// //   };

// //   // פונקציה לקבלת blob אחרי סיום ההקלטה
// //   const handleAudioStop = (blobUrl: string, blob: Blob) => {
// //     setAudioBlob(blob); // עדכון הסטייט של ה-blob
// //   };

// //   // כשיש הקלטה (לא ריקה), נוכל להעלות את הקובץ
// //   const handleUpload = () => {
// //     if (audioBlob) {
// //       uploadToS3(audioBlob);
// //     } else {
// //       alert('אין הקלטה להעלות');
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>הקלטה והעלאה ל-S3</h2>

// //       {/* השימוש ב-ReactMediaRecorder */}
// //       <ReactMediaRecorder
// //         audio
// //         onStop={handleAudioStop} // הפונקציה לקבלת ה-blob
// //         render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
// //           <div>
// //             <p>סטטוס: {status}</p>
// //             <button onClick={startRecording} disabled={status === "recording"}>
// //               התחל להקליט
// //             </button>
// //             <button onClick={stopRecording} disabled={status !== "recording"}>
// //               סיים להקליט
// //             </button>

// //             {/* השמעה לאחר ההקלטה */}
// //             {mediaBlobUrl && <audio controls src={mediaBlobUrl} />}

// //             {/* לחצן להעלאת הקובץ ל-S3 */}
// //             {mediaBlobUrl && (
// //               <button onClick={handleUpload}>העלה את ההקלטה ל-S3</button>
// //             )}
// //           </div>
// //         )}
// //       />
// //     </div>
// //   );
// // };

// // export default AudioUpload;


// // // // // import  { useState, useEffect } from 'react';
// // // // // import { ReactMediaRecorder } from "react-media-recorder";

// // // // // const AudioUpload = () => {
// // // // //   const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

// // // // //   // שליפת ה-ID מה-LocalStorage
// // // // //   const userId = localStorage.getItem('userId');

// // // // //   useEffect(() => {
// // // // //     if (!userId) {
// // // // //       console.error('User ID not found in localStorage');
// // // // //     }
// // // // //   }, [userId]);

// // // // //   // פונקציה להעלאת הקובץ ל-S3
// // // // //   const uploadToS3 = (audioFile: Blob) => {
// // // // //     if (!userId) {
// // // // //       console.error('User ID not found');
// // // // //       return;
// // // // //     }

// // // // //     const fileName = `${userId}/audio-${new Date().toISOString()}.mp4`; // ייחודיות לכל משתמש ולקובץ
// // // // //     const params = {
// // // // //       Bucket: bucketName,
// // // // //       Key: fileName,
// // // // //       Body: audioFile,
// // // // //       ContentType: 'audio/mp4', // תאם לסוג הקובץ שלך
// // // // //       ACL: 'private', // שמירה על ההקלטה פרטית
// // // // //     };

// // // // //     // העלאת הקובץ ל-S3
// // // // //     s3.upload(params, (err:any, data:any) => {
// // // // //       if (err) {
// // // // //         console.error('Error uploading file:', err);
// // // // //       } else {
// // // // //         console.log('Successfully uploaded:', data.Location);
// // // // //         alert('ההקלטה הועלתה בהצלחה!');
// // // // //       }
// // // // //     });
// // // // //   };

// // // // //   // פונקציה לקבלת blob אחרי סיום ההקלטה
// // // // //   const handleAudioStop = (blobUrl: string, blob: Blob) => {
// // // // //     setAudioBlob(blob); // עדכון הסטייט של ה-blob
// // // // //   };

// // // // //   // כשיש הקלטה (לא ריקה), נוכל להעלות את הקובץ
// // // // //   const handleUpload = () => {
// // // // //     if (audioBlob) {
// // // // //       uploadToS3(audioBlob);
// // // // //     } else {
// // // // //       alert('אין הקלטה להעלות');
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div>
// // // // //       <h2>הקלטה והעלאה ל-S3</h2>

// // // // //       {/* השימוש ב-ReactMediaRecorder */}
// // // // //       <ReactMediaRecorder
// // // // //         audio
// // // // //         onStop={handleAudioStop} // הפונקציה לקבלת ה-blob
// // // // //         render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
// // // // //           <div>
// // // // //             <p>סטטוס: {status}</p>
// // // // //             <button onClick={startRecording} disabled={status === "recording"}>
// // // // //               התחל להקליט
// // // // //             </button>
// // // // //             <button onClick={stopRecording} disabled={status !== "recording"}>
// // // // //               סיים להקליט
// // // // //             </button>

// // // // //             {/* השמעה לאחר ההקלטה */}
// // // // //             {mediaBlobUrl && <audio controls src={mediaBlobUrl} />}

// // // // //             {/* לחצן להעלאת הקובץ ל-S3 */}
// // // // //             {mediaBlobUrl && (
// // // // //               <button onClick={handleUpload}>העלה את ההקלטה ל-S3</button>
// // // // //             )}
// // // // //           </div>
// // // // //         )}
// // // // //       />
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default AudioUpload;

