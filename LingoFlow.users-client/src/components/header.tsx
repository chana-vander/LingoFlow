import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Alert, Avatar } from "@mui/material";
import logoImage from '../images/logo-online.jpg';
import { observer } from "mobx-react-lite";
import userStore from "../stores/userStore";

const Header = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    const isLoggedIn = userStore.isLoggedIn;

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
            {/* AppBar נעוץ */}
            <AppBar position="fixed" sx={{ bgcolor: "#0d47a1", padding: 1 }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    {/* צד שמאל - לוגו, כותרת וכפתורים */}
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
                        <img src={logoImage} alt="LingoFlow Logo" style={{ width: 40, height: 40 }} />
                        <Typography variant="h6" fontWeight="bold">LingoFlow</Typography>
                        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                            {!isLoggedIn ? (
                                <>
                                    <Button color="inherit" sx={{ color: '#d32f2f' }} onClick={() => navigate("/register")}>הרשמה</Button>
                                    <Button color="inherit" sx={{ color: '#d32f2f' }} onClick={() => navigate("/login")}>התחברות</Button>
                                </>
                            ) : (
                                <Button color="inherit" onClick={() => userStore.logout()}>התנתקות</Button>
                            )}
                        </Box>
                    </Box>
                    {/* הצגת אייקון משתמש */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        {isLoggedIn ? (
                            <>
                                <Avatar sx={{ bgcolor: userStore.isAdmin ? '#FFD700' : '#1976d2', width: 32, height: 32, fontSize: '1rem' }}>
                                    {userStore.userName?.charAt(0)?.toUpperCase() || "?"}
                                </Avatar>
                                <Typography variant="body2" sx={{ color: 'white' }}>
                                    {userStore.userName}
                                </Typography>
                            </>
                        ) :
                         (
                            <Typography variant="body2" sx={{ color: 'white' }}>
                                ❓ לא מחובר
                            </Typography>
                        )
                        }
                    </Box>
                    {/* צד ימין - כפתורי תפריט */}
                    <Box sx={{ display: "flex", gap: 3, padding: "20px", marginRight: "20px" }}>
                        <Button color="inherit" onClick={() => handleProtectedClick("/feedback")}>צפייה במשוב</Button>
                        <Button color="inherit" onClick={() => handleProtectedClick("/record")}>התחלת הקלטה</Button>
                        <Button color="inherit" onClick={() => handleProtectedClick("/choose-level")}>נושאי שיחה</Button>
                        <Button color="inherit" onClick={() => handleProtectedClick("/about-us")}>הדרך לדיבור שוטף</Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* רווח מתחת ל־AppBar כדי שלא יסתיר תוכן */}
            <Box sx={{ height: "64px" }} />

            {/* הודעת שגיאה */}
            {message && (
                <Alert severity="warning" sx={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 1300 }}>
                    {message}
                </Alert>
            )}
        </>
    );
};

export default observer(Header);
