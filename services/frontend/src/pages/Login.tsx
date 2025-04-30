import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { login, reset } from '../app/authSlice'; // Import login and reset actions
import { AppDispatch, RootState } from '../app/store'; // Import RootState and AppDispatch

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isError) {
      // Optionally display error message using a toast or alert
      console.error(message);
    }

    if (isSuccess || user) {
      navigate('/'); // Redirect to chat page on successful login
    }

    // Reset auth state on component unmount or before next attempt
    // return () => {
    //   dispatch(reset());
    // };
    // We might want to reset only on specific conditions or manually
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(reset()); // Reset previous errors/success states
    const userData = {
      email,
      password,
    };
    dispatch(login(userData));
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
          Sign in
        </Typography>
        {isError && <Alert severity="error" className="w-full mb-4">{message || 'Login failed'}</Alert>}
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }} className="w-full">
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={onChange}
            className="mb-4" // Tailwind margin
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={onChange}
            className="mb-4" // Tailwind margin
          />
          {/* Add Remember me checkbox if needed */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white" // Tailwind styling
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
          <Box textAlign="center">
             <Link to="/register" className="text-blue-500 hover:underline">
               {"Don't have an account? Sign Up"}
             </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;