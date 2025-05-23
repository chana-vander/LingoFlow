import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./header";
import Footer from "./footer";

const Layout = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f5f5f5" // רקע עדין לאיזון
      }}
    >
      <Header />
      <Box component="main" sx={{ flex: 1, p: 2 ,paddingTop:'37px'}}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
