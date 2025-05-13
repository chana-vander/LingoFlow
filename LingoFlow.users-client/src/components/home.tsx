// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// const Home = () => {
//     const navigate = useNavigate();
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [message, setMessage] = useState(""); // הודעה למשתמש

//     useEffect(() => {
//         // בדיקה אם יש משתמש בלוקלסטורג
//         const user = localStorage.getItem("user");
//         console.log(user);
//         setIsLoggedIn(!!user);
//     }, []);

//     const handleProtectedClick = (path: string) => {
//         console.log(isLoggedIn);

//         if (isLoggedIn) {
//             navigate(path);
//         } else {
//             setMessage("עליך להתחבר כדי לגשת לאזור זה.");
//             setTimeout(() => setMessage(""), 3000); // מוחק את ההודעה אחרי 3 שניות
//         }
//     };

//     return (
//         <>
//             <button onClick={() => navigate("/register")}>register</button>
//             <button onClick={() => navigate("/login")}>login</button>
//             <button onClick={() => handleProtectedClick("/choose-level")}>
//                 לנושאי השיחה והמילים
//             </button>
//             <button onClick={() => handleProtectedClick("/record")}>
//                 להתחלת ההקלטה
//             </button>
//             {/* הצגת הודעה אם המשתמש לא מחובר */}
//             {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}
//         </>
//     );
// };

// export default Home;

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Container, Alert } from "@mui/material";
import { motion } from "framer-motion";
import homeImage from '../images/home.jpg';

const Home = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const user = localStorage.getItem("user");
        setIsLoggedIn(!!user);
    }, []);

    const handleProtectedClick = (path: string) => {
        if (isLoggedIn) {
            navigate(path);
        } else {
            setMessage("עליך להתחבר כדי לגשת לאזור זה.");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    return (
        <Box className="home-container"
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                color: "white",
                overflow: "hidden",
                height: "100%",
                width: "100%",
            }}>
            <p style={{ color: '#d32f2f', fontSize: '25px', marginLeft: "1000px" }}>
                !ללמוד בכיף, לדבר שוטף <br />
                ...בואו ללמוד אנגלית בצורה חוויתית ועצמאית
            </p>

            <Container sx={{
                position: "relative",
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "80%",
                maxWidth: "500px",
                height: "auto",
                padding: 0,
                overflow: "hidden",
                borderRadius: "50px",
            }}>
                <motion.img
                    src={homeImage}
                    alt="LingoFlow Home"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                    }}
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1.1 }}
                    transition={{ duration: 1 }}
                />
            </Container>

            {message && (
                <Alert severity="warning" sx={{
                    position: "fixed",
                    bottom: 20,
                    left: "50%",
                    transform: "translateX(-50%)"
                }}>
                    {message}
                </Alert>
            )}
        </Box>
    );
};

export default Home;



// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { AppBar, Toolbar, Typography, Button, Box, Container, Alert } from "@mui/material";
// import { motion } from "framer-motion";
// import '../css/home.css'
// // תמונות
// import logoImage from '../images/logo-online.jpg';  // נתיב הלוגו
// import homeImage from '../images/home.jpg';  // נתיב לתמונה המרכזית

// const Home = () => {
//     const navigate = useNavigate();
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [message, setMessage] = useState(""); // הודעה למשתמש

//     useEffect(() => {
//         const user = localStorage.getItem("user");
//         setIsLoggedIn(!!user);
//     }, []);

//     const handleProtectedClick = (path: string) => {
//         if (isLoggedIn) {
//             navigate(path);
//         } else {
//             setMessage("עליך להתחבר כדי לגשת לאזור זה.");
//             setTimeout(() => setMessage(""), 3000);
//         }
//     };

//     return (
//         <Box className="home-container" sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw", overflow: "hidden" }}>
//             {/* HEADER */}
//             <AppBar position="static" sx={{ bgcolor: "#0d47a1", padding: 1, width: "100%" }}>
//                 <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
//                     {/* צד שמאל - שם האפליקציה עם לוגו וכפתורי הרשמה והתחברות */}
//                     <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
//                         <img src={logoImage} alt="LingoFlow Logo" style={{ width: 40, height: 40 }} />
//                         <Typography variant="h6" fontWeight="bold">LingoFlow</Typography>
//                         <Box sx={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 1 }}>
//                             {/* כפתורי הרשמה והתחברות */}
//                             {!isLoggedIn ? (
//                                 <>
//                                     <Button color="inherit" sx={{ color: '#d32f2f' }} onClick={() => navigate("/register")}>הרשמה</Button>
//                                     <Button color="inherit" sx={{ color: '#d32f2f' }} onClick={() => navigate("/login")}>התחברות</Button>
//                                 </>
//                             ) : (
//                                 <Button color="inherit" onClick={() => { localStorage.removeItem("user"); setIsLoggedIn(false); }}>התנתקות</Button>
//                             )}
//                         </Box>
//                     </Box>

//                     {/* צד ימין - כפתורים לפיצ'רים בשורה */}
//                     <Box sx={{ display: "flex", gap: 3 }}>
//                         <Button color="inherit" onClick={() => handleProtectedClick("/feedback")}>
//                             צפייה במשוב
//                         </Button>
//                         <Button color="inherit" onClick={() => handleProtectedClick("/record")}>
//                             התחלת הקלטה
//                         </Button>
//                         <Button color="inherit" onClick={() => handleProtectedClick("/choose-level")}>
//                             נושאי שיחה
//                         </Button>
//                         <Button color="inherit" onClick={() => handleProtectedClick("/abaut-us")}>
//                             לדיבור שוטף
//                         </Button>
//                     </Box>
//                 </Toolbar>
//             </AppBar>

//             {/* תוכן מרכזי */}
//             <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
//                 <Box sx={{ textAlign: "center", marginBottom: 4 }}> {/* הוספת מרווח מהתמונה */}
//                     <p style={{ color: '#d32f2f', fontSize: '24px', fontWeight: 'bold', margin: 0, padding: 0 }}>LingoFlow</p>
//                     <br />
//                     <p style={{ color: '#d32f2f', fontSize: '18px', margin: 0, padding: 0 }}>!ללמוד בכיף, לדבר שוטף</p>
//                     <br />
//                     <p style={{ color: '#d32f2f', fontSize: '18px', margin: 0, padding: 0 }}>בואו ללמוד אנגלית בצורה חוויתית ועצמאית</p>
//                 </Box>
//                 <Container sx={{ width: "100%", height: "auto", maxWidth: "600px", borderRadius: "50px", overflow: "hidden" }}>
//                     <motion.img
//                         src={homeImage}
//                         alt="LingoFlow Home"
//                         style={{ width: "100%", height: "auto", objectFit: "contain" }}
//                         initial={{ opacity: 0, scale: 1 }}
//                         animate={{ opacity: 1, scale: 1.1 }}
//                         transition={{ duration: 1 }}
//                     />
//                 </Container>
//             </Box>

//             {/* הודעת שגיאה */}
//             {message && (
//                 <Alert severity="warning" sx={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)" }}>
//                     {message}
//                 </Alert>
//             )}
//         </Box>
//     );
// };

// export default Home;