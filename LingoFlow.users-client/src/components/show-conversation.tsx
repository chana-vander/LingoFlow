// // import { useEffect, useState } from 'react';
// // import { useParams } from 'react-router-dom';
// // import axios from 'axios';
// // import { Container, Typography, Box, Card, CardActionArea, CardMedia } from '@mui/material';

// // // הגדרת סוג הנתונים של Song
// // interface Song {
// //     id: number;
// //     name: string | null;
// //     musicStyle: string;
// //     songLength: string;
// //     releaseDate: string;
// //     imageUrl: string;

// // }

// // const Songs = () => {
// //     const { creatorId } = useParams<{ creatorId: string }>();
// //     const [songs, setSongs] = useState<Song[]>([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState<string | null>(null);

// //     useEffect(() => {
// //         const fetchSongs = async () => {
// //             try {
// //                 const response = await axios.get(`https://localhost:7058/api/Song/byCreator/${creatorId}`);
// //                 console.log(response.data.name);

// //                 const songsWithImages = response.data.map((song: Song) => ({
// //                     ...song,
// //                     imageUrl: song.imageUrl || 'https://backet/region name/logo.jpg' // הוספת URL ברירת מחדל
// //                 }));

// //                 setSongs(songsWithImages);
// //             } catch (err) {
// //                 if (axios.isAxiosError(err) && err.message) {
// //                     setError(err.message);
// //                 } else {
// //                     setError("An unexpected error occurred.");
// //                 }
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         fetchSongs();
// //     }, [creatorId]);

// //     if (loading) return <div>Loading...</div>;
// //     if (error) return <div>Error: {error}</div>;
// //     const playSong = async (name: string | null) => {
// //         if (!name) {
// //             console.error("name is undefined");
// //             return;
// //         }
// //         try {
// //             const encodedName = encodeURIComponent(name); // קידוד השם של השיר
// //             const response = await axios.get(`https://localhost:7058/api/UploadFile/presigned-url?fileName=${encodedName}`, {
// //                 responseType: 'blob'
// //             });

// //             const url = window.URL.createObjectURL(new Blob([response.data]));
// //             const audio = new Audio(url);
// //             audio.play();
// //         } catch (error) {
// //             console.error("Error fetching audio:", error);
// //         }
// //     };



// //         return (
// //             <Container>
// //                 <Typography variant="h4" gutterBottom>
// //                     Songs by Creator ID: {creatorId}
// //                 </Typography>
// // <Box display="flex" flexDirection="row" flexWrap="wrap">
// //     {songs.map((song) => (
// //         <Card key={song.id} style={{ margin: '10px', width: '200px' }}>
// //             <CardActionArea onClick={() => {
// //                 if (song.name) { // בדיקה אם name קיים
// //                     playSong(song.name);
// //                 } else {
// //                     console.warn(`Song with ID ${song.id} has no name.`);
// //                 }
// //             }}>
// //                 <CardMedia
// //                     component="img"
// //                     alt={song.name}
// //                     height="140"
// //                     image={song.imageUrl}
// //                     title={song.name}
// //                     style={{ objectFit: 'cover' }} // שיפור הצגת התמונה
// //                     onError={(e) => {
// //                         e.currentTarget.onerror = null; // כדי למנוע לולאה אינסופית
// //                         e.currentTarget.src = 'https://your_name.com/logo.jpg'; // תמונה ברירת מחדל
// //                     }}
// //                 />
// //                 <Typography variant="h6" component="div">
// //                     {song.name}
// //                 </Typography>
// //             </CardActionArea>
// //         </Card>
// //     ))}
// // </Box>
// //             </Container>
// //         );
// //     };

// //     export default Songs;
// import { useEffect, useState, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Container, Typography, Box, Card, CardActionArea, CardMedia } from '@mui/material';

// // הגדרת סוג הנתונים של Song
// interface Song {
//     id: number;
//     name: string | null;
//     musicStyle: string;
//     songLength: string;
//     releaseDate: string;
//     imageUrl: string;
// }

// const Songs = () => {
//     const { creatorId } = useParams<{ creatorId: string }>();
//     const [songs, setSongs] = useState<Song[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchSongs = async () => {
//             try {
//                 const response = await axios.get<Song[]>(`https://localhost:7058/api/Song/byCreator/${creatorId}`);
//                 const songsWithImages = response.data.map((song) => ({
//                     ...song,
//                     imageUrl: song.imageUrl || 'https://blabla.com/logo.jpg' // הוספת URL ברירת מחדל
//                 }));
//                 setSongs(songsWithImages);
//             } catch (err) {
//                 if (axios.isAxiosError(err) && err.response) {
//                     setError(err.response.data.message || err.message);
//                 } else {
//                     setError("An unexpected error occurred.");
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSongs();
//     }, [creatorId]);

//     const playSong = useCallback(async (name: string | null) => {
//         if (!name) {
//             console.error("name is undefined");
//             return;
//         }
//         try {
//             const encodedName = encodeURIComponent(name); // קידוד השם של השיר
//             console.log(encodedName);
//             //mine:
//             const response = await axios.get(`https://localhost:5092/api/UploadFile/presigned-url?fileName=${encodedName}`, {
//                 responseType: 'blob'
//             });

//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const audio = new Audio(url);
//             audio.play();
//         } catch (error) {
//             console.error("Error fetching audio:", error);
//         }
//     }, []);

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;

//     return (
//         <Container>
//             <Typography variant="h4" gutterBottom>
//                 Songs by Creator ID: {creatorId}
//             </Typography>
//             <Box display="flex" flexDirection="row" flexWrap="wrap">
//                 {songs.map((song) => (
//                     <Card key={song.id} style={{ margin: '10px', width: '200px' }}>
//                         <CardActionArea onClick={() => {
//                             if (song.name) { // בדיקה אם name קיים
//                                 playSong(song.name);
//                             } else {
//                                 console.warn(`Song with ID ${song.id} has no name.`);
//                             }
//                         }}>
//                             <CardMedia
//                                 component="img"
//                                 alt={song.name || 'Song image'} // הוספת טקסט חלופי במקרה של null
//                                 height="140"
//                                 image={song.imageUrl}
//                                 title={song.name || undefined} // המרה ל-undefined במקרה של null
//                                 style={{ objectFit: 'cover' }} // שיפור הצגת התמונה
//                                 onError={(e) => {
//                                     e.currentTarget.onerror = null; // כדי למנוע לולאה אינסופית
//                                     e.currentTarget.src = 'https:/blabla/logo.jpg'; // תמונה ברירת מחדל
//                                 }}
//                             />

//                             <Typography variant="h6" component="div">
//                                 {song.name}
//                             </Typography>
//                         </CardActionArea>
//                     </Card>
//                 ))}
//             </Box>
//         </Container>
//     );
// };

// export default Songs;
