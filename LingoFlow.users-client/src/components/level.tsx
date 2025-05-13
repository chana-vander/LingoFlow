// import { useNavigate } from "react-router-dom";

// const Levels = () => {
//     const navigate = useNavigate();

//     function handleClick(level: number) {
//         navigate(`/${level}/topics`);
//     }

//     return (
//         <>
//             <h2>Choose Level</h2>
//             <button onClick={() => handleClick(1)}>1</button>
//             <button onClick={() => handleClick(2)}>2</button>
//             <button onClick={() => handleClick(3)}>3</button>
//         </>
//     );
// };

// export default Levels;

//2
// import { useNavigate } from "react-router-dom";
// import { Box, Button, Typography, Card, CardContent } from "@mui/material";
// import { motion } from "framer-motion";
// import { Star, RocketLaunch, FlashOn } from "@mui/icons-material";

// const Levels = () => {
//     const navigate = useNavigate();

//     function handleClick(level: number) {
//         navigate(`/${level}/topics`);
//     }

//     const levelIcons = [
//         <Star sx={{ color: "#FFD700", fontSize: "2.5rem", marginRight: 2 }} />, 
//         <RocketLaunch sx={{ color: "#FF4500", fontSize: "2.5rem", marginRight: 2 }} />, 
//         <FlashOn sx={{ color: "#00FF00", fontSize: "2.5rem", marginRight: 2 }} />
//     ];

//     return (
//         <Box 
//             display="flex" 
//             flexDirection="column" 
//             alignItems="center" 
//             justifyContent="center" 
//             height="100vh" 
//             gap={3} 
//             sx={{
//                 backgroundImage: "url('https://source.unsplash.com/1600x900/?language,learning')",
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//                 color: "white",
//                 textAlign: "center",
//                 backdropFilter: "blur(5px)",
//                 padding: 3,
//                 width: "100%"
//             }}
//         >
//             <Typography variant="h4" gutterBottom fontWeight="bold" color="white">
//                 בחר את רמת האתגר שלך
//             </Typography>
//             <Typography variant="h6" color="white" sx={{ maxWidth: "60%", opacity: 0.9 }}>
//                 🚀 קח את הלמידה שלך לשלב הבא! כל צעד קדימה פותח מיומנויות וביטחון חדשים. בחר את האתגר שלך והתחל לשלוט היום!
//             </Typography>
            
//             {/* קופסא עוטפת שתמרכז את הכפתורים באופן מושלם */}
//             <Box 
//                 display="flex" 
//                 justifyContent="center" 
//                 alignItems="center"
//                 gap={3} // מרווח בין הכרטיסים
//                 sx={{ 
//                     width: "100%", 
//                     flexWrap: "wrap", 
//                     justifyContent: "center",
//                     marginTop: "20px" 
//                 }} 
//             >
//                 {[1, 2, 3].map((level, index) => (
//                     <motion.div 
//                         key={level} 
//                         whileHover={{ scale: 1.08 }} 
//                         whileTap={{ scale: 0.95 }}
//                         transition={{ type: "spring", stiffness: 200, damping: 10 }} // מעדן את האנימציה
//                     >
//                         <Card 
//                             elevation={8} 
//                             sx={{ 
//                                 borderRadius: "8px", 
//                                 backgroundColor: "rgba(255, 255, 255, 0.2)", 
//                                 backdropFilter: "blur(10px)", 
//                                 textAlign: "center", 
//                                 outline: 'none', 
//                                 padding: "20px",
//                                 width: "180px", // צורת מלבן קטנה יותר
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 alignItems: "center", // אייקונים לצד הכפתור
//                                 justifyContent: "center",
//                                 gap: 2
//                             }}
//                         >
//                             <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                 {/* אייקון צבעוני לכל רמה */}
//                                 {levelIcons[index]}
//                                 <Button 
//                                     variant="contained" 
//                                     color="primary" 
//                                     onClick={() => handleClick(level)}
//                                     sx={{ 
//                                         fontSize: "1.3rem", 
//                                         padding: "12px 24px", 
//                                         color: "white", 
//                                         marginTop: 1, 
//                                         outline: 'none',
//                                         textTransform: "none" // מבטל שינוי אוטומטי של הטקסט
//                                     }}
//                                 >
//                                     Level {level}
//                                 </Button>
//                             </CardContent>
//                         </Card>
//                     </motion.div>
//                 ))}
//             </Box>
//         </Box>
//     );
// };

// export default Levels;

//3
import { useNavigate } from "react-router-dom";
import { Container, Typography, Grid, Card, CardActionArea, CardContent } from "@mui/material";
import { EmojiObjects, ThumbUpAlt, AccountBalance } from "@mui/icons-material"; // אייקונים חדשים
import { useState } from "react";

const levels = [
    { id: 3, label: "מתקדמים", icon: <EmojiObjects fontSize="large" />, color: "#FF5722" },
    { id: 2, label: "בינוניים", icon: <ThumbUpAlt fontSize="large" />, color: "#FFC107" },
    { id: 1, label: "מתחילים", icon: <AccountBalance fontSize="large" />, color: "#4CAF50" },
];

const Levels = () => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState<number | null>(null);

    function handleClick(level: number) {
        navigate(`/${level}/topics`);
    }

    return (
        <Container 
            maxWidth="md" 
            style={{ 
                textAlign: "center", 
                marginTop: "50px", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center", 
                height: "100vh", 
                direction: "rtl" 
            }}
        >
            <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", color: "#2C3E50" }}>
                 LingoFlow - לדבר שוטף, ללמוד בכיף! 
            </Typography>
            <Typography variant="h5" color="textSecondary" gutterBottom>
                בחר את הרמה שמתאימה לך והתחל ללמוד עכשיו!
            </Typography>
            <Grid 
                container 
                spacing={3} 
                justifyContent="center" 
                alignItems="center" 
                direction="row-reverse"
                style={{ marginTop: "20px" }}
            >
                {levels.map((level) => (
                    <Grid item xs={12} sm={4} md={3} key={level.id}>
                        <Card
                            style={{
                                backgroundColor: level.color,
                                color: "white",
                                borderRadius: "10px", // שינוי לעיגול קל יותר
                                boxShadow: hovered === level.id 
                                    ? "0px 8px 20px rgba(0, 0, 0, 0.3)" 
                                    : "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                transform: hovered === level.id ? "scale(1.05)" : "scale(1)",
                                transition: "all 0.3s ease-in-out",
                                height: "150px", // קביעת גובה אחיד לכל הכרטיסים
                                display: "flex", 
                                flexDirection: "column", 
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            onMouseEnter={() => setHovered(level.id)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <CardActionArea onClick={() => handleClick(level.id)} style={{ height: "100%" }}>
                                <CardContent style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    {level.icon}
                                    <Typography variant="h6" style={{ marginTop: "10px", fontWeight: "bold" }}>
                                        {level.label}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Levels;


