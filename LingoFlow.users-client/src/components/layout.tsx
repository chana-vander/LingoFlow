import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./header";
import Footer from "./footer";
import { Bot } from "lucide-react"; // שימי לב שזה Bot מהlucide
import { useState } from "react";
import AIChat from "../components/chat";

const Layout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f5f5f5",
      }}
    >
      <Header />
      <Box component="main" sx={{ flex: 1, p: 2, paddingTop: "37px" }}>
        <Outlet />
      </Box>

      {/* כפתור פתיחת הצ'אט */}
      {!isChatOpen && (
        <button
          className="open-chat-button"
          onClick={() => setIsChatOpen(true)}
        >
          <Bot size={20} />
        </button>
      )}

      {/* רכיב הצ'אט עצמו */}
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <Footer />
    </Box>
  );
};

export default Layout;
