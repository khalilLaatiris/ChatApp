import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatPage from './pages/ChatPage'; // Import the actual ChatPage component
import { RootState, AppDispatch } from './app/store'; // Import RootState and AppDispatch
import { connectSocket, disconnectSocket, getSocket } from './services/socketService';
import { addMessage, setConnectionStatus, setChatError, clearChat } from './app/chatSlice';
import './App.css';

// Component to handle protected routes
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const token = user?.token; // Assuming the token is stored in user object

  useEffect(() => {
    let socket = getSocket();

    if (token && !socket) {
      console.log('Attempting to connect socket...');
      dispatch(setConnectionStatus('connecting'));
      socket = connectSocket(token);

      socket.on('connect', () => {
        console.log('Socket connected event received in App.tsx');
        dispatch(setConnectionStatus('connected'));
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected event received in App.tsx:', reason);
        dispatch(setConnectionStatus('disconnected'));
        // Optionally clear chat on disconnect, or handle reconnection logic
        dispatch(clearChat());
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error event received in App.tsx:', error);
        dispatch(setChatError(error.message || 'Connection failed'));
        // Maybe trigger logout or show error message
      });

      // Listen for new messages from the server
      socket.on('newMessage', (message) => {
        console.log('New message received:', message);
        // Ensure message has the correct structure before dispatching
        // You might need to adapt this based on your actual message format
        if (message && message.id && message.sender && message.text && message.timestamp) {
          dispatch(addMessage(message));
        } else {
          console.warn('Received malformed message:', message);
        }
      });

      // Add listeners for other custom events here

    } else if (!token && socket) {
      console.log('Disconnecting socket due to logout...');
      disconnectSocket();
      dispatch(clearChat()); // Clear chat state on logout
      dispatch(setConnectionStatus('disconnected'));
    }

    // Cleanup function to disconnect socket when component unmounts or token changes
    return () => {
      // Check if socket exists before trying to remove listeners or disconnect
      const currentSocket = getSocket();
      if (currentSocket) {
        console.log('Cleaning up socket listeners in App.tsx');
        // Remove specific listeners to prevent memory leaks
        // currentSocket.off('connect');
        currentSocket.off('disconnect');
        // currentSocket.off('connect_error');
        // currentSocket.off('newMessage');
        // Remove other listeners here

        // Optional: Disconnect socket on component unmount if desired,
        // but often managed by login/logout state changes.
        if (!token) { // Only disconnect if logging out
          disconnectSocket();
        }
      }
    };
  }, [token, dispatch]); // Rerun effect if token or dispatch changes

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
