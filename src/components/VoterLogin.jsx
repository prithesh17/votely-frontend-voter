import React, { useState } from "react";
import { Container, Typography, TextField, Button, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_API_URL;  

const VoterLogin = () => {
  const [electionId, setElectionId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/vote/login`, {
        electionId,
        email,
        password,
      });

      if (response.data.success) {
        const { accessToken } = response.data.data;
        Cookies.set("accessToken", accessToken);

        navigate("/castVote");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Invalid Election ID, Email, or Password.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Voter Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Election ID"
          variant="outlined"
          fullWidth
          required
          value={electionId}
          onChange={(e) => setElectionId(e.target.value)}
          style={{ marginBottom: "16px" }}
        />
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: "16px" }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: "16px" }}
        />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Login
        </Button>
      </form>

      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
      />
    </Container>
  );
};

export default VoterLogin;
