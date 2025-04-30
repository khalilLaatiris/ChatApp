import { io, Socket } from 'socket.io-client';

// Replace with your chat service URL
const SOCKET_URL = 'http://localhost:3001'; // Example URL, adjust as needed

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket => {
  if (socket) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    // auth: {
    //   token: token,
    // },
    reconnection: true,
    // Add other options if needed, e.g., transports: ['websocket']
  });
  socket.on('connect',() => {
    console.log('Socket connected:', socket?.id);
    
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    socket = null; // Reset socket on disconnect
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    // Handle connection error, maybe try to reconnect or logout user
  });

  // Add listeners for custom events from the server here
  // e.g., socket.on('newMessage', (message) => { ... });
  if (socket) {
    console.log('Socket is connected. Listening for new messages.');
    socket.on('wit', (message) => {
      console.log('frontEnd : Received newMessage defusion:', message.text);
      
      // This needs to be handled in the component, so we'll emit an event
      if (socket) {
        console.log('frontEnd : Emitting dispatchNewMessage:', message.text);
        socket.emit('dispatchNewMessage', message);
      }
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected manually.');
  }
};

export const getSocket = (): Socket | null => {
  return socket;
};

// Example function to emit an event
export const sendMessage = (messageData: any) => {
  
  if (socket) {
    // console.debug('Socket is connected. Emitting sendMessage event.');
    console.log('Socket Service : Sending message:', messageData.text,'of sender :',messageData.sender,' socket on ', socket?.id);
    socket.emit('newMessage', messageData);
  } else {
    console.error('Socket not connected. Cannot send message.');
  }
};

// export const getChatHistory = (): Promise<any[]> => {
//   return new Promise((resolve, reject) => {
//     if (socket) {
//       socket.emit('getChatHistory');
//       socket.on('chatHistory', (history: any[]) => {
//         resolve(history);
//       });
//       socket.on('chatHistoryError', (error: any) => {
//         reject(error);
//       });
//     } else {
//       reject(new Error('Socket not connected'));
//     }
//   });
// };

// Add other functions to emit different events as needed