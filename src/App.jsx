import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VoterLogin from './components/VoterLogin';
import CastVote from './components/CastVote';
import { Box } from '@mui/material';

function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f0f0', 
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<VoterLogin />} />
          <Route path="/castVote" element={<CastVote />} />
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
