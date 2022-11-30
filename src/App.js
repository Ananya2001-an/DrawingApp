import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'

import HomePage from "./components/HomePage";
import NotFound from "./components/NotFound";
import SignUp from './components/SignUp';
import LogIn from './components/LogIn'
import ForgotPassword from './components/ForgotPassword';

function App() {
  return (
  <>
    <Routes>
      <Route path="/home" element = {<HomePage />} />
      <Route path="/" element={<SignUp/>} />
      <Route path="/login" element={<LogIn/>} />
      <Route path="/forgotpassword" element={<ForgotPassword/>} />
      <Route path="*" element = {< NotFound />}/>
    </Routes>
  </>
  
      
  )
}

export default App;
