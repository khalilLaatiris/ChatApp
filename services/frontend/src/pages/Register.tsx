import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { register, reset } from '../app/authSlice'; // Import register and reset actions
import { AppDispatch, RootState } from '../app/store'; // Import RootState and AppDispatch

const Register = () => {
  const [formData, setFormData] = useState({
    // username: '', // Add username or name field if required by your backend
    email: '',
    password: '',
    password2: '', // Confirm password field
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { email, password, password2 } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isError) {
      // Optionally display error message
      console.error(message);
    }

    // Redirect if logged in (e.g., after successful registration and auto-login)
    if (isSuccess || user) {
      navigate('/');
    }

    // Reset auth state on component unmount or before next attempt
    // return () => {
    //   dispatch(reset());
    // };
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    // Clear password error when user types
    if (e.target.name === 'password' || e.target.name === 'password2') {
      setPasswordError(null);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(reset()); // Reset previous errors/success states

    if (password !== password2) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError(null);
      const userData = {
        // username, // Include username if needed
        email,
        password,
      };
      dispatch(register(userData));
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="mt-8">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" className="mb-4">
          Sign up
        </Typography>
        {isError && <Alert severity="error" className="w-full mb-4">{message || 'Registration failed'}</Alert>}
        {passwordError && <Alert severity="error" className="w-full mb-4">{passwordError}</Alert>}
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }} className="w-full">
          {/* Add Username field if needed */}
          {/* <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username" // Adjust label if using name instead
            name="username"
            autoComplete="username"
            autoFocus // Focus on username first
            value={username}
            onChange={onChange}
            className="mb-4"
          /> */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={onChange}
            className="mb-4"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={onChange}
            className="mb-4"
            error={!!passwordError} // Highlight field if passwords don't match
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password2"
            label="Confirm Password"
            type="password"
            id="password2"
            autoComplete="new-password"
            value={password2}
            onChange={onChange}
            className="mb-4"
            error={!!passwordError} // Highlight field if passwords don't match
            helperText={passwordError}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white"
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
          </Button>
          <Box textAlign="center">
             <Link to="/login" className="text-blue-500 hover:underline">
               {"Already have an account? Sign In"}
             </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;