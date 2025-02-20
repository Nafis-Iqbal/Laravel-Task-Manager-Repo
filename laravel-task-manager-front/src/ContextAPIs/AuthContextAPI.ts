import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';

// Define the initial state type
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user_id: number | null;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user_id: null,
};

// Create a slice for authentication
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user_id: number; token: string }>) => {
      state.isAuthenticated = true;
      state.user_id = action.payload.user_id;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user_id = null;
      state.token = null;
    },
  },
});

// Export actions
export const { setAuth, logout } = authSlice.actions;

// Configure the store
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

// Export the store
export default store;

// Custom hooks to use in components
export const useAuthDispatch = () => useDispatch<typeof store.dispatch>();
export const useAuthSelector = <TSelected>(selector: (state: { auth: AuthState }) => TSelected): TSelected =>
  useSelector(selector);

