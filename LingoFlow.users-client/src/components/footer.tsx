import { Box, Typography, IconButton, Stack } from "@mui/material";
import { Facebook, GitHub, LinkedIn } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: "#c0e0ff",
        color: "white",
        py: 2,
        px: 4,
        mt: "auto",
        textAlign: "center",
        borderTop: "4px solid #1565c0",
        width:"100vw"
      }}
    >
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 1 }}>
        <IconButton color="inherit" href="https://facebook.com" target="_blank">
          <Facebook />
        </IconButton>
        <IconButton color="inherit" href="https://github.com" target="_blank">
          <GitHub />
        </IconButton>
        <IconButton color="inherit" href="https://linkedin.com" target="_blank">
          <LinkedIn />
        </IconButton>
      </Stack>
      <Typography variant="body2" color="blue">
        © {new Date().getFullYear()} LingoFlow. כל הזכויות שמורות.
      </Typography>
    </Box>
  );
};

export default Footer;
