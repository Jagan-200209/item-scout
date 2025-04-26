import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Link,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Registration Data
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Profile Data
    phoneNumber: '',
    address: '',
    city: '',
    bio: '',
    profileImage: null
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const steps = ['Account Details', 'Profile Information', 'Review'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
    }
  };

  const validateBasicInfo = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateProfileInfo = () => {
    const newErrors = {};

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    
    if (activeStep === 0) {
      isValid = validateBasicInfo();
    } else if (activeStep === 1) {
      isValid = validateProfileInfo();
    }

    if (isValid) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    try {
      // Create FormData object to handle file upload
      const profileData = new FormData();
      Object.keys(formData).forEach(key => {
        profileData.append(key, formData[key]);
      });

      // Register user and create profile
      const result = await register(profileData);
      
    if (result.success) {
        navigate('/profile');
      } else {
        setSubmitError(result.error);
      }
    } catch (error) {
      setSubmitError('Registration failed. Please try again.');
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
  return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              name="name"
              label="Full Name"
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              name="phoneNumber"
              label="Phone Number"
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="address"
              label="Address"
              type="text"
              id="address"
              value={formData.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="city"
              label="City"
              type="text"
              id="city"
              value={formData.city}
              onChange={handleChange}
              error={!!errors.city}
              helperText={errors.city}
            />
            <TextField
              margin="normal"
              fullWidth
              name="bio"
              label="Bio"
              multiline
              rows={4}
              value={formData.bio}
              onChange={handleChange}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-image"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="profile-image">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                sx={{ mt: 2 }}
              >
                Upload Profile Picture
              </Button>
            </label>
            {formData.profileImage && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {formData.profileImage.name}
              </Typography>
            )}
          </>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            <Typography>Name: {formData.name}</Typography>
            <Typography>Email: {formData.email}</Typography>
            <Typography>Phone: {formData.phoneNumber}</Typography>
            <Typography>Address: {formData.address}</Typography>
            <Typography>City: {formData.city}</Typography>
            {formData.bio && <Typography>Bio: {formData.bio}</Typography>}
            {formData.profileImage && (
              <Typography>Profile Picture: {formData.profileImage.name}</Typography>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Create Account
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}

            {submitError && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {submitError}
              </Typography>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
            <Button
                  variant="contained"
              type="submit"
                >
                  Create Account
                </Button>
              ) : (
                <Button
              variant="contained"
                  onClick={handleNext}
            >
                  Next
            </Button>
              )}
            </Box>

            {activeStep === 0 && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link href="/login" variant="body2">
                  Already have an account? Sign In
              </Link>
            </Box>
            )}
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 