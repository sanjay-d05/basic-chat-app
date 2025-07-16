import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

// Pages and components
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import MessageViewer from './components/custom/MessageViewer';
import MessageAreaDefault from './components/custom/MessageAreaDefault';
import { connectSocket } from './services/socketService';

function App() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if(user?._id){
      connectSocket(user._id,dispatch);
    }
  },[user])

  return (
    <>
      <ToastContainer position="top-center" />
      <BrowserRouter>
        <Routes>
          {/* Home route with nested routes */}
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/login" replace />}
          >
            <Route index element={<MessageAreaDefault />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="message/:id" element={<MessageViewer />} />
          </Route>

          {/* Signup route */}
          <Route
            path="/signup"
            element={!user ? <SignUpPage buttonText="Sign Up" /> : <Navigate to="/" replace />}
          />

          {/* Login route */}
          <Route
            path="/login"
            element={!user ? <LoginPage buttonText="Login" /> : <Navigate to="/" replace />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
