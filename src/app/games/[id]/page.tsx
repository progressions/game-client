"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useParams, useRouter, Link } from "next/navigation"
import { Typography, Box, List, ListItem, ListItemText, Alert, Button, Select, MenuItem } from "@mui/material"

export default function GameDetails() {
  const [game, setGame] = useState(null)
  const [player, setPlayer] = useState(null)
  const [selectedConnection, setSelectedConnection] = useState("")
  const [nextRoom, setNextRoom] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const router = useRouter()

  useEffect(() => {
    console.log("useEffect triggered with ID:", id)
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL)
    const fetchGame = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        console.log("Token:", token)
        if (!token) {
          setError("Please log in to view this game")
          setTimeout(() => router.push("/login"), 2000)
          return
        }
        if (!id) {
          setError("Invalid game ID")
          setTimeout(() => router.push("/games"), 2000)
          return
        }
        if (!process.env.NEXT_PUBLIC_API_URL) {
          setError("API URL not configured")
          setTimeout(() => router.push("/games"), 2000)
          return
        }
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/games/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log("Game response:", response.data)
        setGame(response.data)
        if (response.data.starting_room) {
          const playerResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/players`,
            { player: { current_room_id: response.data.starting_room.id, game_id: id } },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          console.log("Player response:", playerResponse.data)
          setPlayer(playerResponse.data)
        } else {
          setError("No starting room defined for this game")
        }
      } catch (err: any) {
        console.error("Fetch error:", err.message, err.response?.data)
        setError(err.response?.data?.errors?.join(", ") || "Failed to load game")
        if (err.response?.status === 401 || err.response?.status === 404) {
          setTimeout(() => router.push("/games"), 2000)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchGame()
  }, [id, router])

  const handleConnectionSelect = async (connectionId: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token found")
      const connection = game.starting_room.connections.find((conn: any) => conn.id === connectionId)
      if (!connection) throw new Error("Connection not found")
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/players/${player.id}/move`,
        { action_text: connection.label },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      console.log("Move response:", response.data)
      setNextRoom(response.data.player.current_room)
      setSelectedConnection(connectionId)
    } catch (err: any) {
      console.error("Move error:", err.message, err.response?.data)
      setError(err.response?.data?.errors?.join(", ") || "Failed to preview room")
    }
  }

  if (loading) {
    return <Typography sx={{ textAlign: "center", marginTop: "80px" }}>Loading...</Typography>
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: "800px", margin: "auto", marginTop: "80px" }}>
        <Alert severity="error">{error}</Alert>
        <Button component={Link} href="/games" variant="outlined" color="secondary" sx={{ marginTop: "16px" }}>
          Back to Games
        </Button>
      </Box>
    )
  }

  if (!game) {
    return (
      <Box sx={{ maxWidth: "800px", margin: "auto", marginTop: "80px" }}>
        <Typography sx={{ textAlign: "center" }}>Game not found</Typography>
        <Button component={Link} href="/games" variant="outlined" color="secondary" sx={{ marginTop: "16px" }}>
          Back to Games
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: "800px", margin: "auto", marginTop: "80px" }}>
      <Typography variant="h4" gutterBottom>
        {game.title}
      </Typography>
      <Typography variant="h6">Starting Room</Typography>
      {game.starting_room ? (
        <Box sx={{ border: "1px solid", borderColor: "grey.300", padding: "16px", borderRadius: "4px", marginBottom: "16px" }}>
          <Typography variant="h6">{game.starting_room.title}</Typography>
          <Typography>{game.starting_room.description}</Typography>
          <Typography variant="subtitle1" sx={{ marginTop: "8px" }}>Exits:</Typography>
          {game.starting_room.connections?.length === 0 ? (
            <Typography>No exits available</Typography>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "8px" }}>
              <Select
                value={selectedConnection}
                onChange={(e) => handleConnectionSelect(e.target.value)}
                displayEmpty
                sx={{ minWidth: "200px" }}
              >
                <MenuItem value="">Select a path</MenuItem>
                {game.starting_room.connections?.map((conn: any) => (
                  <MenuItem key={conn.id} value={conn.id}>
                    {conn.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}
        </Box>
      ) : (
        <Typography>No starting room defined</Typography>
      )}
      {nextRoom && (
        <Box sx={{ border: "1px solid", borderColor: "grey.300", padding: "16px", borderRadius: "4px", marginBottom: "16px" }}>
          <Typography variant="h6">Next Room: {nextRoom.title}</Typography>
          <Typography>{nextRoom.description}</Typography>
        </Box>
      )}
      <Button component={Link} href="/games" variant="outlined" color="secondary">
        Back to Games
      </Button>
    </Box>
  )
}
