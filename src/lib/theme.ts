import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#d1d5db",
    },
    primary: {
      main: "#3b82f6",
    },
    secondary: {
      main: "#22c55e",
    },
    error: {
      main: "#ef4444",
    },
    action: {
      disabledBackground: "#4b5563",
      disabled: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Inter", Arial, sans-serif',
    h1: {
      fontSize: "28px",
      fontWeight: 700,
    },
    h2: {
      fontSize: "20px",
      fontWeight: 600,
    },
    body1: {
      fontSize: "16px",
    },
  },
  shape: {
    borderRadius: 6,
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(0, 0, 0, 0.3)",
    ...Array(23).fill("0px 2px 4px rgba(0, 0, 0, 0.3)"),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          padding: "10px 16px",
          fontWeight: 600,
          "&:hover": {
            transform: "translateY(-1px)",
            transition: "transform 0.1s",
          },
          "&.Mui-disabled": {
            backgroundColor: "#4b5563",
            color: "#ffffff",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#2a2a2a",
            "&:hover fieldset": {
              borderColor: "#3b82f6",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#3b82f6",
            },
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: "#d1d5db",
        },
      },
    },
  },
})

export default theme

