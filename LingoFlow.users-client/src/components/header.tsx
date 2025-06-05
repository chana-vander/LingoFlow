// // import { useNavigate } from "react-router-dom";
// // import { useState } from "react";
// // import { AppBar, Toolbar, Typography, Button, Box, Alert, Avatar } from "@mui/material";
// // import logoImage from '../images/logo-power.jpg'
// // import { observer } from "mobx-react-lite";
// // import userStore from "../stores/userStore";

// // const Header = () => {
// //     const navigate = useNavigate();
// //     const [message, setMessage] = useState("");

// //     const isLoggedIn = userStore.isLoggedIn;

// //     const handleProtectedClick = (path: string) => {
// //         if (isLoggedIn) {
// //             navigate(path);
// //         } else {
// //             setMessage("עליך להתחבר כדי לגשת לאזור זה.");
// //             setTimeout(() => setMessage(""), 3000);
// //         }
// //     };

// //     return (
// //         <>
// //             {/* AppBar נעוץ */}
// //             <AppBar position="fixed" sx={{ bgcolor: "#0d47a1", padding: 1 }}>
// //                 <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
// //                     {/* צד שמאל - לוגו, כותרת וכפתורים */}
// //                     <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
// //                         <img src={logoImage} alt="LingoFlow Logo" style={{ width: "auto", height: 40 }} />
// //                         {/* <Typography variant="h6" fontWeight="bold">LingoFlow</Typography> */}
// //                         <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
// //                             {!isLoggedIn ? (
// //                                 <>
// //                                     <Button color="inherit" sx={{ color: '#d32f2f' }} onClick={() => navigate("/register")}>הרשמה</Button>
// //                                     <Button color="inherit" sx={{ color: '#d32f2f' }} onClick={() => navigate("/login")}>התחברות</Button>
// //                                 </>
// //                             ) : (
// //                                 <Button color="inherit" onClick={() => userStore.logout()}>התנתקות</Button>
// //                             )}
// //                         </Box>
// //                     </Box>
// //                     {/* הצגת אייקון משתמש */}
// //                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
// //                         {isLoggedIn ? (
// //                             <>
// //                                 <Avatar sx={{ bgcolor: userStore.isAdmin ? '#FFD700' : '#1976d2', width: 32, height: 32, fontSize: '1rem' }}>
// //                                     {userStore.userName?.charAt(0)?.toUpperCase() || "?"}
// //                                 </Avatar>
// //                                 <Typography variant="body2" sx={{ color: 'white' }}>
// //                                     {userStore.userName}
// //                                 </Typography>
// //                             </>
// //                         ) :
// //                             (
// //                                 <Typography variant="body2" sx={{ color: 'white' }}>
// //                                     ❓ לא מחובר
// //                                 </Typography>
// //                             )
// //                         }
// //                     </Box>
// //                     {/* צד ימין - כפתורי תפריט */}
// //                     <Box sx={{ display: "flex", gap: 3, padding: "20px", marginRight: "20px" }}>
// //                         <Button color="inherit" onClick={() => handleProtectedClick("/feedback")}>צפייה במשוב</Button>
// //                         <Button color="inherit" onClick={() => handleProtectedClick("/user-recording")}>ההקלטות שלי</Button>
// //                         <Button color="inherit" onClick={() => handleProtectedClick("/record")}>התחלת הקלטה</Button>
// //                         <Button color="inherit" onClick={() => handleProtectedClick("/choose-level")}>נושאי שיחה</Button>
// //                         <Button color="inherit" onClick={() => handleProtectedClick("/about-us")}>הדרך לדיבור שוטף</Button>
// //                     </Box>
// //                 </Toolbar>
// //             </AppBar>

// //             {/* רווח מתחת ל־AppBar כדי שלא יסתיר תוכן */}
// //             <Box sx={{ height: "64px" }} />

// //             {/* הודעת שגיאה */}
// //             {message && (
// //                 <Alert severity="warning" sx={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 1300 }}>
// //                     {message}
// //                 </Alert>
// //             )}
// //         </>
// //     );
// // };

// // export default observer(Header);

// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Box,
//   Alert,
//   Avatar,
//   Menu,
//   MenuItem,
// } from "@mui/material";
// import logoImage from '../images/logo-power.jpg';
// import { observer } from "mobx-react-lite";
// import userStore from "../stores/userStore";

// const Header = () => {
//   const navigate = useNavigate();
//   const [message, setMessage] = useState("");
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

//   const isLoggedIn = userStore.isLoggedIn;
//   const open = Boolean(anchorEl);

//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleProtectedClick = (path: string) => {
//     if (isLoggedIn) {
//       navigate(path);
//     } else {
//       setMessage("עליך להתחבר כדי לגשת לאזור זה.");
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };

//   return (
//     <>
//       <AppBar position="fixed" sx={{ bgcolor: "#0d47a1", padding: 1 }}>
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
//           {/* צד שמאל - לוגו */}
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <img
//               src={logoImage}
//               alt="LingoFlow Logo"
//               style={{ width: 120, height: "auto", borderRadius: 8 }} // לוגו יותר גדול ועם פינות עגולות
//             />
//           </Box>

//           {/* צד ימין - כפתורי תפריט */}
//           <Box sx={{ display: "flex", gap: 3, padding: "0px", marginRight: "0px" }}>
//             {[
//               { label: "צפייה במשוב", path: "/feedback" },
//               { label: "ההקלטות שלי", path: "/user-recording" },
//               { label: "התחלת הקלטה", path: "/record" },
//               { label: "נושאי שיחה", path: "/choose-level" },
//               { label: "הדרך לדיבור שוטף", path: "/about-us" }
//             ].map(({ label, path }) => (
//               <Button
//                 key={path}
//                 color="inherit"
//                 onClick={() => handleProtectedClick(path)}
//                 sx={{
//                   transition: "color 0.3s",
//                   '&:hover': { color: 'red' }
//                 }}
//               >
//                 {label}
//               </Button>
//             ))}
//           </Box>

//           {/* אייקון משתמש עם dropdown */}
//           <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
//             <Avatar
//               onClick={handleMenuOpen}
//               sx={{
//                 bgcolor: isLoggedIn ? (userStore.isAdmin ? '#FFD700' : '#1976d2') : '#888',
//                 width: 36,
//                 height: 36,
//                 fontSize: '1rem',
//                 transition: "border-color 0.3s",
//                 '&:hover': { borderColor: 'red', borderStyle: 'solid', borderWidth: 1 }
//               }}
//             >
//               {isLoggedIn ? (userStore.userName?.charAt(0)?.toUpperCase() || "?") : "?"}
//             </Avatar>
//             <Typography
//               variant="body2"
//               onClick={handleMenuOpen}
//               sx={{
//                 color: 'white',
//                 marginLeft: 1,
//                 transition: "color 0.3s",
//                 '&:hover': { color: 'red' }
//                 ,paddingRight:"30px"
//               }}
//             >
//               {/* {isLoggedIn ? userStore.userName : "לא מחובר"} */}
//             </Typography>

//             <Menu
//               anchorEl={anchorEl}
//               open={open}
//               onClose={handleMenuClose}
//               anchorOrigin={{
//                 vertical: 'bottom',
//                 horizontal: 'right',
//               }}
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//               }}
//             >
//               {!isLoggedIn ? (
//                 <>
//                   <MenuItem onClick={() => { handleMenuClose(); navigate("/register"); }}>הרשמה</MenuItem>
//                   <MenuItem onClick={() => { handleMenuClose(); navigate("/login"); }}>התחברות</MenuItem>
//                 </>
//               ) : (
//                 <MenuItem onClick={() => { handleMenuClose(); userStore.logout(); }}>התנתקות</MenuItem>
//               )}
//             </Menu>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* רווח מתחת ל־AppBar כדי שלא יסתיר תוכן */}
//       <Box sx={{ height: "64px" }} />

//       {/* הודעת שגיאה */}
//       {message && (
//         <Alert
//           severity="warning"
//           sx={{
//             position: "fixed",
//             bottom: 20,
//             left: "50%",
//             transform: "translateX(-50%)",
//             zIndex: 1300
//           }}
//         >
//           {message}
//         </Alert>
//       )}
//     </>
//   );
// };

// export default observer(Header);

// import { useNavigate } from "react-router-dom";
// import { useState, useRef } from "react";
// import {
//   AppBar,
//   Toolbar,
//   // Typography,
//   Button,
//   Box,
//   Alert,
//   // Avatar,
//   Popover,
//   MenuList,
//   MenuItem,
// } from "@mui/material";
// import logoImage from "../images/logo-power2-Photoroom.png";
// import { observer } from "mobx-react-lite";
// import userStore from "../stores/userStore";

// const Header = () => {
//   const navigate = useNavigate();
//   const [message, setMessage] = useState("");

//   const isLoggedIn = userStore.isLoggedIn;
//   // const user = toJS(userStore.user);

//   // מצב ל-hover של ה-dropdown
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const avatarRef = useRef<HTMLDivElement | null>(null);

//   const handleProtectedClick = (path: string) => {
//     if (isLoggedIn) {
//       navigate(path);
//     } else {
//       setMessage("עליך להתחבר כדי לגשת לאזור זה.");
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };

//   // הפתחה וסגירה של הפופובר ב-hover
//   const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handlePopoverClose = () => {
//     setAnchorEl(null);
//   };
//   const open = Boolean(anchorEl);

//   return (
//     <>
//       <AppBar
//         position="fixed"
//         sx={{
//           //   bgcolor: "#e3f2d",
//           bgcolor: "#c0e0ff",
//           padding: 1,
//           //   width:"auto"
//         borderBottom: "4px solid #c62828",

//         }}
//       >
//         <Toolbar sx={{ justifyContent: "center" }}>
//           <Box
//             sx={{
//               width: "100%",
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 cursor: "pointer",
//                 gap: 8, // ללא רווח
//               }}
//             >
//               {/* לוגו לשמאל */}
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   cursor: "pointer",
//                 }}
//                 onClick={() => navigate("/")}
//               >
//                 <img
//                   src={logoImage}
//                   alt="LingoFlow Logo"
//                   style={{
//                     height: "100px",
//                     objectFit: "contain",
//                     display: "block",
//                   }}
//                 />
//               </Box>
//               {/* אזור המשתמש עם dropdown ב-hover */}
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   position: "relative",
//                 }}
//                 onMouseEnter={handlePopoverOpen}
//                 onMouseLeave={handlePopoverClose}
//               >
//                 {/* {isLoggedIn ? (
//                   <Avatar
//                     ref={avatarRef}
//                     sx={{
//                       bgcolor: userStore.isAdmin ? "#FFD700" : "#1976d2",
//                       width: 40,
//                       height: 40,
//                       fontSize: "1rem",
//                       cursor: "pointer",
//                       border: "2px solid red",
//                     }}
//                   >
//                     {userStore.userName?.charAt(0)?.toUpperCase()}
//                   </Avatar>
//                 ) : (
//                   <Typography variant="body2" sx={{ color: "#0d47a1" }}>
//                     ❓ לא מחובר
//                   </Typography>
//                 )} */}

//                 {/* Dropdown שמופיע ב-hover */}
//                 <Popover
//                   open={open}
//                   anchorEl={anchorEl}
//                   anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//                   transformOrigin={{ vertical: "top", horizontal: "right" }}
//                   disableRestoreFocus
//                   // sx={{ pointerEvents: "none" }} // מונע סגירה מיידית
//                   PaperProps={{
//                     onMouseEnter: () => setAnchorEl(avatarRef.current),
//                     onMouseLeave: handlePopoverClose,
//                     sx: { pointerEvents: "auto" },
//                   }}
//                 >
//                   <MenuList>
//                     {!isLoggedIn ? (
//                       <>
//                         <MenuItem
//                           onClick={() => {
//                             navigate("/register");
//                             handlePopoverClose();
//                           }}
//                         >
//                           הרשמה
//                         </MenuItem>
//                         <MenuItem
//                           onClick={() => {
//                             navigate("/login");
//                             handlePopoverClose();
//                           }}
//                         >
//                           התחברות
//                         </MenuItem>
//                       </>
//                     ) : (
//                       <MenuItem
//                         onClick={() => {
//                           userStore.logout();
//                           handlePopoverClose();
//                         }}
//                       >
//                         התנתקות
//                       </MenuItem>
//                     )}
//                   </MenuList>
//                 </Popover>
//               </Box>
//             </Box>
//             {/* כפתורי התפריט */}
//             <Box
//               sx={{
//                 display: "flex",
//                 gap: 3,
//                 padding: "20px",
//                 marginRight: "20px",
//               }}
//             >
//               {[
//                 { label: "ההקלטות שלי", path: "/my-recordings" },
//                 { label: "צפייה במשוב", path: "/feedback" },
//                 { label: "התחלת הקלטה", path: "/record" },
//                 { label: "נושאי שיחה", path: "/choose-level" },
//                 // { label: "הדרך לדיבור שוטף", path: "/about-us" },
//                 { label: "הצעדים לדיבור בטוח", path: "/about-us" },

//               ].map((item) => (
//                 <Button
//                   key={item.path}
//                   color="inherit"
//                   onClick={() => handleProtectedClick(item.path)}
//                   sx={{
//                     fontSize: "1.1rem",
//                     fontFamily: '"Fredoka", sans-serif',
//                     color: "#0d47a1",
//                   }}
//                 >
//                   {item.label}
//                 </Button>
//               ))}
//             </Box>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* רווח מתחת ל־AppBar */}
//       <Box sx={{ height: "64px" }} />

//       {/* הודעת שגיאה */}
//       {message && (
//         <Alert
//           severity="warning"
//           sx={{
//             position: "fixed",
//             bottom: 20,
//             left: "50%",
//             transform: "translateX(-50%)",
//             zIndex: 1300,
//           }}
//         >
//           {message}
//         </Alert>
//       )}
//     </>
//   );
// };

// export default observer(Header);


import { useNavigate } from "react-router-dom";
import { useState } from "react";
// useRef
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Alert,
  Popover,
  MenuList,
  MenuItem,
  IconButton,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // סימן שאלה
import logoImage from "../images/logo-power2-Photoroom.png";
import { observer } from "mobx-react-lite";
import userStore from "../stores/userStore";

const Header = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const isLoggedIn = userStore.isLoggedIn;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProtectedClick = (path: string) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      setMessage("עליך להתחבר כדי לגשת לאזור זה.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleClickIcon = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#c0e0ff",
          padding: 1,
          borderBottom: "4px solid #c62828",
        }}
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                gap: 8,
              }}
            >
              {/* לוגו לשמאל */}
              <Box
                sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                <img
                  src={logoImage}
                  alt="LingoFlow Logo"
                  style={{
                    height: "100px",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </Box>

              {/* כפתור הסימן שאלה לפתיחת הדרופדאון */}
              <IconButton onClick={handleClickIcon} sx={{ color: "#0d47a1" }}>
                <HelpOutlineIcon fontSize="large" />
              </IconButton>

              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuList>
                  {!isLoggedIn ? (
                    <>
                      <MenuItem
                        onClick={() => {
                          navigate("/register");
                          handleClosePopover();
                        }}
                      >
                        הרשמה
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          navigate("/login");
                          handleClosePopover();
                        }}
                      >
                        התחברות
                      </MenuItem>
                    </>
                  ) : (
                    <MenuItem
                      onClick={() => {
                        userStore.logout();
                        handleClosePopover();
                      }}
                    >
                      התנתקות
                    </MenuItem>
                  )}
                </MenuList>
              </Popover>
            </Box>

            {/* כפתורי התפריט */}
            <Box
              sx={{
                display: "flex",
                gap: 3,
                padding: "20px",
                marginRight: "20px",
              }}
            >
              {[
                { label: "ההקלטות שלי", path: "/my-recordings" },
                { label: "צפייה במשוב", path: "/feedback" },
                { label: "התחלת הקלטה", path: "/record" },
                { label: "נושאי שיחה", path: "/choose-level" },
                { label: "הצעדים לדיבור בטוח", path: "/about-us" },
              ].map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  onClick={() => handleProtectedClick(item.path)}
                  sx={{
                    fontSize: "1.1rem",
                    fontFamily: '"Fredoka", sans-serif',
                    color: "#0d47a1",
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* רווח מתחת ל־AppBar */}
      <Box sx={{ height: "64px" }} />

      {/* הודעת שגיאה */}
      {message && (
        <Alert
          severity="warning"
          sx={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1300,
          }}
        >
          {message}
        </Alert>
      )}
    </>
  );
};

export default observer(Header);
