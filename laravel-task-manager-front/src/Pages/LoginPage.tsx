import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated to useNavigate for React Router v6
import { AxiosResponse } from 'axios';

import {createUser, loginUser} from '../Services/API/UserApi';
import { setAuth} from '../ContextAPIs/AuthSlice';
import { useAuthDispatch } from '../Hooks/StateHooks';



const LoginPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and registration forms
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [name, setName] = useState('Guest'); // For registration
  const navigate = useNavigate(); // Updated to useNavigate

  const dispatch = useAuthDispatch();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await loginUser(email, password);

    if (response.data?.auth_token) {
      sessionStorage.setItem('auth_token', response.data?.auth_token);
      sessionStorage.setItem('isAuthenticated', "true");
      dispatch(setAuth({ token: response.data.auth_token, user_id: response.data.user_id }));
    }

    navigate('/dashboard');
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await createUser(name, email, password, passwordConfirmation);

    if (response.data?.auth_token) {     
      dispatch(setAuth({ token: response.data.auth_token, user_id: response.data.user_id }));
    }

    navigate('/dashboard');
  };

  useEffect(() => {
    // Let React capture browser autofill
    setEmail((document.getElementById("email") as HTMLInputElement)?.value || "guest@example.com");
    setPassword((document.getElementById("password") as HTMLInputElement)?.value || "guest1234");
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-md mx-auto p-6 bg-black rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          {isRegistering ? 'Create an Account' : 'Login to Your Account'}
        </h2>

        <form
          onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit}
          className="space-y-6"
        >
          {isRegistering && (
            <div>
              <label htmlFor="name" className="block text-white">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-maroon-600 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-white">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-maroon-600 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-white">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-maroon-600 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
              required
            />
          </div>
          {isRegistering && (
            <div>
              <label htmlFor="password" className="block text-white">Confirm Password</label>
              <input
                type="password"
                id="password confirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full p-3 border border-maroon-600 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
                required
              />
            </div>
          )}
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-maroon-600 text-white rounded-md hover:bg-maroon-700 focus:outline-none focus:ring-2 focus:ring-maroon-500"
            >
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-maroon-600 text-white hover:underline focus:outline-none"
          >
            {isRegistering ? 'Already have an account? Login' : 'Don’t have an account? Register'}
          </button>
        </div>
        <div className='bg-white h-full flex flex-grow'></div>
      </div>
    </div>
  );
};

export default LoginPage;
