import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        py: 4,
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mx: 4 }}>
        © 2024 Hugging Face - Open LLM Leaderboard - Made with 🤗 by the HF team
        -{" "}
        <Link
          href="https://huggingface.co"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
        >
          huggingface.co
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
