import React from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Avatar,
  Button,
  Divider
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar
                src={user?.profileImage}
                sx={{ width: 100, height: 100, mr: 3 }}
              />
              <Box>
                <Typography variant="h4">{user?.name}</Typography>
                <Typography color="textSecondary">{user?.email}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Contact Information</Typography>
              <Typography>Phone: {user?.phoneNumber}</Typography>
              <Typography>Address: {user?.address}</Typography>
              <Typography>City: {user?.city}</Typography>
            </Box>

            {user?.bio && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>About Me</Typography>
                  <Typography>{user.bio}</Typography>
                </Box>
              </>
            )}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" color="primary" href="/edit-profile">
                Edit Profile
              </Button>
              <Button variant="outlined" color="primary" href="/my-items">
                My Items
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Profile; 