import './index.css';

import React, { Suspense } from 'react';
import { useRoutes} from 'react-router-dom';

import { useAuthSelector } from './ContextAPIs/AuthContextAPI';
import appRoutes from './Routes/AppRoutes';

import Navbar from './Components/Navbar';

function App() {
  //const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'; // Ensure it returns a boolean
  const isAuthenticated = useAuthSelector((state) => state.auth.isAuthenticated);

  return (
    <Suspense>
      <Navbar />
      {useRoutes(appRoutes)}
    </Suspense>
  );
}

export default App;