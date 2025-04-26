import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import Navbar from '../components/Navbar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // Get the return URL from location state or default to "/"
  const from = location.state?.from?.pathname || '/';

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      enqueueSnackbar('Welcome back!', { 
        variant: 'success',
        autoHideDuration: 2000
      });
      navigate(from, { replace: true });
    } catch (error) {
      enqueueSnackbar(error.message || 'Invalid email or password', { 
        variant: 'error',
        autoHideDuration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main id="loginPage">
      <Navbar />
      <section className="auth-section">
        <div className="auth-container">
          <div className="auth-header">
            <div className="auth-icon">
              <LockOutlinedIcon />
            </div>
            <h1>Welcome Back</h1>
            <p>Please enter your details to login</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-container">
                <EmailOutlinedIcon className="input-icon" />
                <input
                  type="email"
              name="email"
                  placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  autoComplete="off"
            />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="input-group">
              <div className="input-container">
                <LockOutlinedIcon className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
              name="password"
                  placeholder="Password"
              value={formData.password}
              onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="auth-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit"
              className={`auth-submit ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <div className="auth-links">
              <p>
                Don't have an account? 
                <Link to="/register" className="register-link">
                  Create an account
              </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Login; 