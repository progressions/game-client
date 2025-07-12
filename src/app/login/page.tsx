"use client"

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { TextField, Button, Typography, Box, Alert } from "@mui/material"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        email,
        password
      })
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("userId", response.data.user_id)
      router.push("/games")
    } catch (err: any) {
      setError(err.response?.data?.errors?.join(", ") || "Login failed")
    }
  }

  return (
    <Box sx={{ maxWidth: "400px", margin: "auto", marginTop: "80px" }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && <Alert severity="error" sx={{ marginBottom: "16px" }}>{error}</Alert>}
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: "16px" }}>
          Login
        </Button>
      </form>
    </Box>
  )
}
