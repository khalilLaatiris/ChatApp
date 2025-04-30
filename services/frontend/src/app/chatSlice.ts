import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the message object
interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  // Add other message properties as needed
}

// Define a type for the slice state
interface ChatState {
  messages: Message[];
  connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
  error: string | null;
}

// Define the initial state using that type
const initialState: ChatState = {
  messages: [],
  connectionStatus: 'disconnected',
  error: null,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Action to add a new message to the list
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      // Optional: Keep only the last N messages
      // const maxMessages = 100;
      // if (state.messages.length > maxMessages) {
      //   state.messages = state.messages.slice(-maxMessages);
      // }
    },
    // Action to set the connection status
    setConnectionStatus: (state, action: PayloadAction<ChatState['connectionStatus']>) => {
      state.connectionStatus = action.payload;
      console.log('Connection status changed:', action.payload);
      if (action.payload !== 'error') {
        state.error = null; // Clear error on non-error status change
      }
    },
    // Action to set an error message
    setChatError: (state, action: PayloadAction<string | null>) => {
      state.connectionStatus = 'error';
      state.error = action.payload;
    },
    // Action to load initial messages (e.g., from history)
    loadMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    // Action to clear chat messages (e.g., on logout)
    clearChat: (state) => {
      state.messages = [];
      state.connectionStatus = 'disconnected';
      state.error = null;
    },
  },
  // Add extraReducers if needed for async actions (e.g., fetching message history)
});

export const {
  addMessage,
  setConnectionStatus,
  setChatError,
  loadMessages,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;