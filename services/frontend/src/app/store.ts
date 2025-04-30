import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chatReducer from './chatSlice'; // Import the chat reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer, // Add the chat reducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {auth: AuthState, chat: ChatState}
export type AppDispatch = typeof store.dispatch;