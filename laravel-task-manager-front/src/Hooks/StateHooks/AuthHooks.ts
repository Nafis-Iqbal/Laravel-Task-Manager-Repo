import { useDispatch, useSelector } from 'react-redux';
import store  from '../../ContextAPIs/GlobalStateStore';
import type {AuthState} from '../../ContextAPIs/AuthSlice';

// Custom hooks to use in components
export const useAuthDispatch = () => useDispatch<typeof store.dispatch>();
export const useAuthSelector = <TSelected>(selector: (state: { auth: AuthState }) => TSelected): TSelected =>
  useSelector(selector);