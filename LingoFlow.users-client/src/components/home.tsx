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

//זה הטוב- מוצשק ו אלול
// import { Box } from "@mui/material";
// import { motion } from "framer-motion";
// import homeImage from "../images/home.jpg";
// const Home = () => {

//   return (
//     <>
//       <Box
//         className="home-container"
//         sx={{
//           display: "flex",
//           flexDirection: "row",
//           justifyContent: "space-between",
//           alignItems: "flex-start",
//           color: "white",
//           overflow: "hidden",
//           height: "100vh",
//           width: "100vw",
//           padding: 0,
//           margin: 0,
//         }}
//       >
//         {/* תמונה משמאל */}
//         <Box sx={{ width: "60%", height: "100%" }}>
//           <motion.img
//             src={homeImage}
//             alt="LingoFlow Home"
//             style={{
//               width: "100%",
//               height: "100%",
//               objectFit: "cover",
//               display: "block",
//             }}
//             initial={{ opacity: 0, scale: 1 }}
//             animate={{ opacity: 1, scale: 1.05 }}
//             transition={{ duration: 1 }}
//           />
//         </Box>
//         {/* טקסט מימין */}
//         <Box
//           sx={{
//             width: "40%",
//             padding: 4,
//             margin: 4,
//             direction: "rtl",
//             textAlign: "right",
//           }}
//         >
//           <p style={{ color: "#d32f2f", fontSize: "25px" }}>
//             רוצים לדבר אנגלית בביטחון? LingoFlow מציעה דרך חדשנית ללמוד אנגלית
//             באמצעות הקלטות ומשוב חכם...
//           </p>
//           <p style={{ color: "#d32f2f", fontSize: "25px" }}>
//             הקליטו את עצמכם, קבלו משוב מיידי מבוסס AI, ושפרו את הדיבור שלכם בקצב
//             אישי - בלי מורים, בלי לחץ, רק התקדמות אמיתית שאתם יכולים לראות
//             ולשמוע.
//           </p>
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default Home;

//עד לפה!



import { Box, Typography, Card, CardContent, Avatar, Rating } from "@mui/material";
import { motion } from "framer-motion";
import {  Mic, TrendingUp, Users, Quote } from "lucide-react";
import st1 from "../images/student1.png"
import st2 from "../images/student2.png"
import st3 from "../images/student3.png"
// import st4 from "../images/student4.png"
// Mock image - replace with your actual image
const homeImage = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

const Home = () => {
  const whyLingoFlowFeatures = [
    {
      icon: <Mic className="w-8 h-8" />,
      title: "טכנולוגיית AI מתקדמת",
      description: "משוב מיידי ומדויק על הגייה, דקדוק ורהיטות בדיבור"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "התקדמות מדידה",
      description: "מעקב אחר השיפור שלכם עם מדדים ברורים וגרפים מפורטים"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "למידה אישית",
      description: "התאמה אישית לקצב שלכם ולרמת האנגלית שלכם"
    }
  ];

  const testimonials = [
    {
      name: "שרה כהן",
      role: "מנהלת שיווק",
      rating: 5,
      text: "LingoFlow שינה לי את החיים! תוך שלושה חודשים הצלחתי להקליט פרזנטציות באנגלית בביטחון מלא.",
      avator:st2
    },
    {
      name: "דן לוי",
      role: "מפתח תוכנה",
      rating: 5,
      text: "המשוב המיידי והמדויק עזר לי לשפר את ההגייה שלי בצורה משמעותית. ממליץ בחום!",
      avatar:st3
     },
    {
      name: "מיכל רוזן",
      role: "יועצת עסקית",
      rating: 5,
      text: "הדרך הכי נוחה וחכמה ללמוד אנגלית! אני מרגישה הרבה יותר בטוחה בפגישות עבודה.",
      avator:st1    }
  ];

  return (
    <>
      {/* Hero Section */}
      <Box
        className="home-container"
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
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%)",
            zIndex: 1,
          }
        }}
      >
        {/* תמונה משמאל */}
        <Box sx={{ width: "60%", height: "100%", position: "relative" }}>
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
            transition={{ duration: 1.5 }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(45deg, rgba(0,0,0,0.3), rgba(211, 47, 47, 0.2))",
            }}
          />
        </Box>

        {/* טקסט מימין */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ width: "40%", padding: "2rem", margin: "2rem", direction: "rtl", textAlign: "right", zIndex: 2, position: "relative" }}
        >
          <Typography
            variant="h2"
            sx={{
              background: "linear-gradient(45deg, #d32f2f, #3f51b5)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              fontWeight: "bold",
              mb: 3,
              fontSize: { xs: "2rem", md: "3rem" }
            }}
          >
            LingoFlow
          </Typography>
          
          <Typography
            sx={{
              color: "#2c3e50",
              fontSize: { xs: "1.2rem", md: "1.5rem" },
              lineHeight: 1.6,
              mb: 3,
              fontWeight: "500",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            רוצים לדבר אנגלית בביטחון? LingoFlow מציעה דרך חדשנית ללמוד אנגלית
            באמצעות הקלטות ומשוב חכם מבוסס AI.
          </Typography>
          
          <Typography
            sx={{
              color: "#34495e",
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              lineHeight: 1.6,
              fontWeight: "400",
              textShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            הקליטו את עצמכם, קבלו משוב מיידי מבוסס AI, ושפרו את הדיבור שלכם בקצב
            אישי - בלי מורים, בלי לחץ, רק התקדמות אמיתית שאתם יכולים לראות
            ולשמוע.
          </Typography>
        </motion.div>
      </Box>

      {/* Why LingoFlow Section */}
      <Box
        sx={{
          py: 8,
          px: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          direction: "rtl"
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              color: "white",
              fontWeight: "bold",
              mb: 6,
              textShadow: "0 4px 8px rgba(0,0,0,0.3)"
            }}
          >
            למה דווקא LingoFlow?
          </Typography>
          
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 4,
              maxWidth: "1200px",
              mx: "auto"
            }}
          >
            {whyLingoFlowFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "20px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.2)",
                      transform: "translateY(-10px)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 3,
                        color: "#ffd700",
                        background: "rgba(255, 215, 0, 0.1)",
                        borderRadius: "50%",
                        width: "80px",
                        height: "80px",
                        alignItems: "center",
                        mx: "auto"
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        mb: 2,
                        textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: "rgba(255, 255, 255, 0.9)",
                        lineHeight: 1.6,
                        fontSize: "1.1rem"
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Box>

      {/* Testimonials Section */}
      <Box
        sx={{
          py: 8,
          px: 4,
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          direction: "rtl"
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              color: "white",
              fontWeight: "bold",
              mb: 2,
              textShadow: "0 4px 8px rgba(0,0,0,0.3)"
            }}
          >
            מנוסות ממליצות
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.9)",
              mb: 6,
              fontStyle: "italic"
            }}
          >
            מה לומדים אחרים אומרים על LingoFlow
          </Typography>
          
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 4,
              maxWidth: "1200px",
              mx: "auto"
            }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "20px",
                    position: "relative",
                    overflow: "visible",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                    }
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: -20,
                      right: 20,
                      background: "linear-gradient(45deg, #f093fb, #f5576c)",
                      borderRadius: "50%",
                      p: 2,
                      color: "white"
                    }}
                  >
                    <Quote className="w-6 h-6" />
                  </Box>
                  
                  <CardContent sx={{ p: 4, pt: 5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Avatar
                        src={testimonial.avatar}
                        sx={{ width: 60, height: 60, mr: 2 }}
                      />
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ color: "#2c3e50", fontWeight: "bold" }}
                        >
                          {testimonial.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#7f8c8d" }}
                        >
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Rating
                      value={testimonial.rating}
                      readOnly
                      sx={{
                        mb: 2,
                        "& .MuiRating-iconFilled": {
                          color: "#ffd700"
                        }
                      }}
                    />
                    
                    <Typography
                      sx={{
                        color: "#34495e",
                        lineHeight: 1.6,
                        fontStyle: "italic",
                        fontSize: "1.1rem"
                      }}
                    >
                      "{testimonial.text}"
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Box>

      {/* StepsSection placeholder - replace with your actual component */}
      <Box sx={{ py: 4 }}>
        {/* <StepsSection /> */}
        <Typography variant="h4" sx={{ textAlign: "center", color: "#2c3e50" }}>
          StepsSection יופיע כאן
        </Typography>
      </Box>
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
