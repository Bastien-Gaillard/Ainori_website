import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './Header';
import Index from "./Index";
import SignIn from './SingIn';
import Forgot from './Forgot';
import Home from './Home';
export default function App() {

  //new Route for test page Home.js by thomas
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />}>
          <Route index element={<SignIn />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="forgot" element={<Forgot />} />
          <Route path="home" element={<Home />} />
          <Route path="forgot/:token" element={<ForgotPassword />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}