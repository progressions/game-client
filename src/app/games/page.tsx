"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Typography, Box, Select, MenuItem, Button, Alert, List, ListItem, ListItemText } from "@mui/material"

export default function Games() {
  const [games, setGames] = useState([])
  const [themes, setThemes] = useState([])
  const [selectedTheme, setSelectedTheme] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No token found")
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/games`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setGames(response.data)
      } catch (err: any) {
        setError(err.response?.data?.errors?.join(", ") || "Failed to load games")
      }
    }

    const fetchThemes = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/themes`)
        setThemes(response.data)
      } catch (err: any) {
        setError(err.response?.data?.errors?.join(", ") || "Failed to load themes")
      }
    }

    fetchGames()
    fetchThemes()
  }, [])

  const handleCreateGame = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token found")
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/games`,
        { game: { theme_id: selectedTheme } },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setGames([...games, response.data])
      setSelectedTheme("")
    } catch (err: any) {
      setError(err.response?.data?.errors?.join(", ") || "Failed to create game")
    }
  }

  return (
    <Box sx={{ maxWidth: "800px", margin: "auto", marginTop: "80px" }}>
      <Typography variant="h4" gutterBottom>
        Your Games
      </Typography>
      {error && <Alert severity="error" sx={{ marginBottom: "16px" }}>{error}</Alert>}
      <Box sx={{ marginBottom: "32px" }}>
        <Typography variant="h6">Create New Game</Typography>
        <Select
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value)}
          displayEmpty
          sx={{ marginRight: "16px", minWidth: "200px" }}
        >
          <MenuItem value="">Select Theme</MenuItem>
          {themes.map((theme: any) => (
            <MenuItem key={theme.id} value={theme.id}>
              {theme.name}
            </MenuItem>
          ))}
        </Select>
        <Button
          onClick={handleCreateGame}
          variant="contained"
          color="primary"
          disabled={!selectedTheme}
        >
          Create Game
        </Button>
      </Box>
      <Typography variant="h6">Your Games</Typography>
      {games.length === 0 ? (
        <Typography>No games yet</Typography>
      ) : (
        <List>
          {games.map((game: any) => (
            <ListItem key={game.id}>
              <ListItemText primary={`Theme: ${game.theme?.name || "Unknown"}`} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}
