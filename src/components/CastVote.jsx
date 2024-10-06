import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Radio, RadioGroup, FormControlLabel, Snackbar, Box, Paper } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;  

const CastVote = () => {
  const { electionId } = useParams(); 
  const [election, setElection] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const jwt = Cookies.get("accessToken");
        const response = await axios.get(`${apiUrl}/vote/fetchElection`, {
          headers: {
            Authorization: jwt,
          },
        });

        if (response.data.success) {
          setElection(response.data.data); 
        } else {
          setErrorMessage("Failed to fetch election details.");
        }
      } catch (error) {
        console.error("Error fetching election:", error);
        setErrorMessage("An error occurred while fetching the election.");
      }
    };

    fetchElection();
  }, [electionId]);

  const handleVoteSubmit = async () => {
    if (!selectedCandidate) {
      setErrorMessage("Please select a candidate to vote.");
      return;
    }

    try {
      const jwt = Cookies.get("accessToken");
      const response = await axios.post(
        `${apiUrl}/vote/castVote`,
        {
          candidate: selectedCandidate,
        },
        {
          headers: {
            Authorization: jwt,
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage("Vote submitted successfully!");
      } else {
        setErrorMessage("Failed to submit vote.");
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      setErrorMessage("An error occurred while submitting your vote.");
    }

    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
  };

  if (!election) {
    return <Typography>Loading election details...</Typography>;
  }

  const styles = {
    container: {
      padding: "32px",
      backgroundColor: "#f0f4f8",
      borderRadius: "8px",
    },
    heading: {
      textAlign: "center",
      fontWeight: "bold",
      color: "#3f51b5",
      marginBottom: "24px",
    },
    subText: {
      textAlign: "center",
      fontSize: "16px",
      marginBottom: "24px",
    },
    paper: {
      padding: "24px",
      marginBottom: "16px",
      backgroundColor: "#fff",
      borderRadius: "8px",
    },
    candidatesHeading: {
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "20px",
      marginBottom: "16px",
    },
    submitButton: {
      display: "block",
      margin: "0 auto",
      marginTop: "24px",
      padding: "12px 24px",
      fontWeight: "bold",
      backgroundColor: "#3f51b5",
      color: "#fff",
      borderRadius: "8px",
    },
  };

  return (
    <Container maxWidth="sm" style={styles.container}>
      <Typography variant="h4" style={styles.heading}>
        Cast Your Vote for {election.electionTitle}
      </Typography>

      <Typography style={styles.subText}>
        Start Time: {new Date(election.startTime).toLocaleString()}
      </Typography>
      <Typography style={styles.subText}>
        End Time: {new Date(election.endTime).toLocaleString()}
      </Typography>

      <Paper elevation={3} style={styles.paper}>
        <Typography variant="h5" style={styles.candidatesHeading}>
          Candidates:
        </Typography>

        <RadioGroup
          value={selectedCandidate}
          onChange={(e) => setSelectedCandidate(e.target.value)}
        >
          {election.candidates.map((candidate, index) => (
            <FormControlLabel
              key={index}
              value={candidate.name}
              control={<Radio />}
              label={`${candidate.name} (${candidate.party})`}
            />
          ))}
        </RadioGroup>
      </Paper>

      <Button
        variant="contained"
        style={styles.submitButton}
        onClick={handleVoteSubmit}
      >
        Submit Vote
      </Button>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
      />
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
      />
    </Container>
  );
};

export default CastVote;
