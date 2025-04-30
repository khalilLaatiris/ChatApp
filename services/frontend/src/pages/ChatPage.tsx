import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Container, Paper, List, ListItem, ListItemText, TextField, Button, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import LogoutIcon from '@mui/icons-material/Logout';
import { RootState, AppDispatch } from '../app/store';
import { sendMessage, getSocket } from '../services/socketService';
import { logout } from '../app/authSlice'; // Import logout action
import { addMessage } from '../app/chatSlice';

const ChatPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, connectionStatus } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null); // Ref for scrolling

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom when messages change
  }, [messages]);

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     try {
  //       const socketInstance = getSocket();
  //       if (socketInstance) {
  //         const chatHistory = await (socketInstance as any).getChatHistory();
  //         // Dispatch an action to update the messages in the chatSlice
  //         // Assuming you have a 'loadMessages' action in chatSlice
  //         dispatch(loadMessages(chatHistory));
  //       } else {
  //         console.error("Socket not connected");
  //       }
  //     } catch (error) {
  //       console.error("Failed to load chat history:", error);
  //     }
  //   };

  //   fetchMessages();
  // }, [dispatch]);

  useEffect(() => {
    const socketInstance = getSocket();
    if (socketInstance) {
      socketInstance.on('defusion', (message: any) => {
        console.log('Dispatching addMessage:', message);
        dispatch(addMessage(message));
        console.log('Message added to Redux store:', message);
      });
      socketInstance.once('welcome', (message) => {
        dispatch(addMessage(message));
        console.log('chat Page :Welcome message received:', message);
        }
      );

    }
  }, [dispatch]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      const messageData = {
        id: 0, // Generate ID client-side or let backend handle it
        sender: 'Anonymos', // Use username or email
        text: newMessage,
        timestamp: Date.now(),
      };
      sendMessage(messageData); // Send message via socket service
      console.log('chatpage: Sending message:', messageData.sender, messageData.text);
      setNewMessage(''); // Clear input field
      
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    // Socket disconnection is handled in App.tsx useEffect based on token presence
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Chat App (User: {  user?.username || 'Anonymous'})
          </Typography>
          <Typography variant="caption" sx={{ mr: 2 }}>
            Status: {connectionStatus}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', py: 2 }}>
        <Paper elevation={3} sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, p: 2 }}>
          <List>
            {messages.map((msg, index) => (
              <ListItem key={index} alignItems="flex-start">
                <ListItemText
                  primary={msg.text}
                  secondary={
                    <>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {msg.sender}
                      </Typography>
                      {` — ${new Date(msg.timestamp).toLocaleTimeString()}`}
                    </>
                  }
                />
              </ListItem>
            ))}
            {/* Dummy div to help scroll to bottom */}
            <div ref={messagesEndRef} />
          </List>
        </Paper>
        <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', mt: 'auto' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            sx={{ mr: 1 }}
            disabled={connectionStatus !== 'connected'}
          />
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            disabled={!newMessage.trim() || connectionStatus !== 'connected'}
          >
            Send
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ChatPage;