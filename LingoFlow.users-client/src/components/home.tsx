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
import StepsSection from './step'
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
        <>
        <Box className="home-container"
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                color: "white",
                overflow: "hidden",
                height: "100vh",
                width: "100vw",
                padding: 0,
                margin: 0,
            }}>
            {/* תמונה משמאל */}
            <Box sx={{ width: "60%", height: "100%" }}>
                <motion.img
                    src={homeImage}
                    alt="LingoFlow Home"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                    }}
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1.05 }}
                    transition={{ duration: 1 }}
                />
            </Box>
            {/* טקסט מימין */}
            <Box sx={{ width: "40%", padding: 4,margin:4, direction: "rtl", textAlign: "right" }}>
                <p style={{ color: '#d32f2f', fontSize: '25px' }}>
                    רוצים לדבר אנגלית בביטחון? LingoFlow מציעה דרך חדשנית ללמוד אנגלית באמצעות הקלטות ומשוב חכם...
                </p>
                <p style={{ color: '#d32f2f', fontSize: '25px' }}>
                הקליטו את עצמכם, קבלו משוב מיידי מבוסס AI, ושפרו את הדיבור שלכם בקצב אישי - בלי מורים, בלי לחץ, רק התקדמות אמיתית שאתם יכולים לראות ולשמוע.
                </p>
            </Box>

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
        <StepsSection/>
        </>
    );
};

export default Home;

// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { motion } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { BookOpen, Mic, MessageSquareText, ChevronRight, LogIn, UserPlus } from "lucide-react"

// export default function Home() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [message, setMessage] = useState("")

//   useEffect(() => {
//     // Check if user exists in localStorage
//     const user = localStorage.getItem("user")
//     setIsLoggedIn(!!user)
//   }, [])

//   const handleProtectedClick = (path: string) => {
//     if (isLoggedIn) {
//       window.location.href = path
//     } else {
//       setMessage("עליך להתחבר כדי לגשת לאזור זה")
//       setTimeout(() => setMessage(""), 3000)
//     }
//   }

//   return (
//     <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 to-blue-100 rtl">
//       {/* Header */}
//       <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md">
//         <div className="container flex h-16 items-center justify-between">
//           <div className="flex items-center gap-2">
//             <motion.div
//               initial={{ rotate: -10 }}
//               animate={{ rotate: 10 }}
//               transition={{
//                 repeat: Number.POSITIVE_INFINITY,
//                 repeatType: "reverse",
//                 duration: 1.5,
//               }}
//             >
//               <Image
//                 src="/placeholder.svg?height=40&width=40"
//                 width={40}
//                 height={40}
//                 alt="LingoFlow Logo"
//                 className="rounded-full"
//               />
//             </motion.div>
//             <h1 className="text-xl font-bold text-blue-700">LingoFlow</h1>
//           </div>

//           <nav className="hidden md:flex items-center gap-6">
//             <Button
//               variant="ghost"
//               onClick={() => handleProtectedClick("/choose-level")}
//               className="text-blue-700 hover:text-blue-900 hover:bg-blue-50"
//             >
//               נושאי שיחה
//             </Button>
//             <Button
//               variant="ghost"
//               onClick={() => handleProtectedClick("/record")}
//               className="text-blue-700 hover:text-blue-900 hover:bg-blue-50"
//             >
//               התחלת הקלטה
//             </Button>
//             <Button
//               variant="ghost"
//               onClick={() => handleProtectedClick("/feedback")}
//               className="text-blue-700 hover:text-blue-900 hover:bg-blue-50"
//             >
//               צפייה במשוב
//             </Button>
//             <Button
//               variant="ghost"
//               onClick={() => handleProtectedClick("/about-us")}
//               className="text-blue-700 hover:text-blue-900 hover:bg-blue-50"
//             >
//               אודות
//             </Button>
//           </nav>

//           <div className="flex items-center gap-2">
//             {!isLoggedIn ? (
//               <>
//                 <Button
//                   variant="outline"
//                   onClick={() => (window.location.href = "/login")}
//                   className="text-blue-700 border-blue-700 hover:bg-blue-50"
//                 >
//                   <LogIn className="h-4 w-4 ml-2" />
//                   התחברות
//                 </Button>
//                 <Button
//                   variant="default"
//                   onClick={() => (window.location.href = "/register")}
//                   className="bg-blue-700 hover:bg-blue-800"
//                 >
//                   <UserPlus className="h-4 w-4 ml-2" />
//                   הרשמה
//                 </Button>
//               </>
//             ) : (
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   localStorage.removeItem("user")
//                   setIsLoggedIn(false)
//                 }}
//                 className="text-red-600 border-red-600 hover:bg-red-50"
//               >
//                 התנתקות
//               </Button>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="container py-12 md:py-24 flex flex-col items-center text-center">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="max-w-3xl mx-auto"
//         >
//           <h1 className="text-4xl md:text-6xl font-bold text-blue-700 mb-6">LingoFlow</h1>
//           <p className="text-2xl md:text-3xl font-semibold text-blue-600 mb-4">!ללמוד בכיף, לדבר שוטף</p>
//           <p className="text-xl text-blue-600 mb-8">
//             למדו אנגלית בצורה חוויתית, אינטראקטיבית ועצמאית עם משוב חכם בזמן אמת
//           </p>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{
//             duration: 1,
//             delay: 0.3,
//           }}
//           className="relative w-full max-w-2xl h-64 md:h-96 my-8 rounded-2xl overflow-hidden"
//         >
//           <motion.div
//             animate={{
//               scale: [1, 1.05, 1],
//               rotate: [0, 1, 0],
//             }}
//             transition={{
//               repeat: Number.POSITIVE_INFINITY,
//               repeatType: "reverse",
//               duration: 5,
//             }}
//             className="w-full h-full"
//           >
//             <Image
//               src="/placeholder.svg?height=600&width=800"
//               fill
//               alt="LingoFlow Learning Experience"
//               className="object-cover rounded-2xl"
//               priority
//             />
//           </motion.div>
//         </motion.div>
//       </section>

//       {/* How It Works Section */}
//       <section className="container py-16 bg-white rounded-t-3xl">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-blue-700 mb-4">איך זה עובד?</h2>
//           <p className="text-lg text-blue-600 max-w-2xl mx-auto">
//             שיטת הלימוד שלנו מבוססת על ארבעה שלבים פשוטים שיעזרו לך לשפר את האנגלית המדוברת שלך
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
//           {[
//             {
//               icon: <BookOpen className="h-10 w-10 text-blue-600" />,
//               title: "בחירת נושא",
//               description: "בחרו נושא שמעניין אתכם מתוך מגוון רחב של נושאי שיחה יומיומיים",
//               action: "לבחירת נושא",
//               path: "/choose-level",
//             },
//             {
//               icon: <BookOpen className="h-10 w-10 text-blue-600" />,
//               title: "למידת אוצר מילים",
//               description: "למדו מילים ומשפטים חשובים הקשורים לנושא שבחרתם",
//               action: "ללמידת מילים",
//               path: "/choose-level",
//             },
//             {
//               icon: <Mic className="h-10 w-10 text-blue-600" />,
//               title: "תרגול הדיבור",
//               description: "הקליטו את עצמכם מדברים אנגלית תוך שימוש במילים ובמשפטים שלמדתם",
//               action: "להתחלת הקלטה",
//               path: "/record",
//             },
//             {
//               icon: <MessageSquareText className="h-10 w-10 text-blue-600" />,
//               title: "קבלת משוב",
//               description: "קבלו משוב חכם ומפורט על הדיבור שלכם לשיפור מתמיד",
//               action: "לצפייה במשוב",
//               path: "/feedback",
//             },
//           ].map((step, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               viewport={{ once: true }}
//             >
//               <Card className="h-full border-2 border-blue-100 hover:border-blue-300 transition-all duration-300">
//                 <CardContent className="p-6 flex flex-col items-center text-center h-full">
//                   <div className="mb-4 p-3 bg-blue-50 rounded-full">{step.icon}</div>
//                   <h3 className="text-xl font-bold text-blue-700 mb-2">{step.title}</h3>
//                   <p className="text-blue-600 mb-6 flex-grow">{step.description}</p>
//                   <Button
//                     variant="outline"
//                     onClick={() => handleProtectedClick(step.path)}
//                     className="mt-auto group border-blue-600 text-blue-600 hover:bg-blue-50"
//                   >
//                     {step.action}
//                     <ChevronRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
//                   </Button>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* Benefits Section */}
//       <section className="container py-16 bg-white">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-blue-700 mb-4">למה LingoFlow?</h2>
//           <p className="text-lg text-blue-600 max-w-2xl mx-auto">
//             הפלטפורמה שלנו מציעה יתרונות ייחודיים שיעזרו לכם לשפר את האנגלית המדוברת שלכם
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {[
//             {
//               title: "למידה מותאמת אישית",
//               description: "המערכת מתאימה את עצמה לרמה ולקצב שלכם, כך שתוכלו להתקדם בדרך המתאימה לכם",
//             },
//             {
//               title: "משוב מפורט ומדויק",
//               description: "קבלו ניתוח מעמיק של הדיבור שלכם, כולל הצעות לשיפור ההגייה, הדקדוק והשימוש במילים",
//             },
//             {
//               title: "נושאים מגוונים ורלוונטיים",
//               description: "בחרו מתוך מגוון רחב של נושאים יומיומיים שיעזרו לכם לתקשר בביטחון במצבים אמיתיים",
//             },
//             {
//               title: "גמישות ונוחות",
//               description: "למדו בכל זמן ומקום, בקצב שלכם וללא תלות במורה או בכיתה",
//             },
//           ].map((benefit, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5 }}
//               viewport={{ once: true }}
//               className="flex gap-4 items-start"
//             >
//               <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
//                 <span className="text-blue-700 font-bold text-xl">{index + 1}</span>
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-blue-700 mb-2">{benefit.title}</h3>
//                 <p className="text-blue-600">{benefit.description}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="container py-16 bg-white rounded-b-3xl mb-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           viewport={{ once: true }}
//           className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-center text-white"
//         >
//           <h2 className="text-3xl font-bold mb-4">מוכנים להתחיל לדבר אנגלית בביטחון?</h2>
//           <p className="text-xl mb-8 max-w-2xl mx-auto">
//             הצטרפו ל-LingoFlow עוד היום והתחילו את המסע שלכם לשליטה מלאה בשפה האנגלית
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button
//               size="lg"
//               onClick={() => (window.location.href = "/register")}
//               className="bg-white text-blue-700 hover:bg-blue-50"
//             >
//               הרשמה עכשיו
//             </Button>
//             <Button
//               variant="outline"
//               size="lg"
//               onClick={() => (window.location.href = "/about-us")}
//               className="border-white text-white hover:bg-blue-700"
//             >
//               למידע נוסף
//             </Button>
//           </div>
//         </motion.div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-white py-8 border-t">
//         <div className="container flex flex-col md:flex-row justify-between items-center">
//           <div className="flex items-center gap-2 mb-4 md:mb-0">
//             <Image
//               src="/placeholder.svg?height=30&width=30"
//               width={30}
//               height={30}
//               alt="LingoFlow Logo"
//               className="rounded-full"
//             />
//             <span className="text-blue-700 font-bold">LingoFlow</span>
//           </div>
//           <div className="flex gap-6">
//             <Link href="/terms" className="text-blue-600 hover:text-blue-800">
//               תנאי שימוש
//             </Link>
//             <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
//               מדיניות פרטיות
//             </Link>
//             <Link href="/contact" className="text-blue-600 hover:text-blue-800">
//               צור קשר
//             </Link>
//           </div>
//           <div className="text-blue-600 mt-4 md:mt-0">© {new Date().getFullYear()} LingoFlow. כל הזכויות שמורות.</div>
//         </div>
//       </footer>

//       {/* Alert Message */}
//       {message && (
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 50 }}
//           className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
//         >
//           <Alert className="bg-red-50 border-red-200">
//             <AlertDescription className="text-red-600">{message}</AlertDescription>
//           </Alert>
//         </motion.div>
//       )}
//     </div>
//   )
// }


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