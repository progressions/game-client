"use client"

import { CssVarsProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import theme from "@/lib/theme"

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      {children}
    </CssVarsProvider>
  )
}

