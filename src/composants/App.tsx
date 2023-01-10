import * as React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './header/Header';
import Index from "./Index";
import Login from './Login';
import Forgot from './Forgot';
import Home from './Home';
import Profil from './Profil';
export default function App() {

  //new Route for test page Home.js by thomas
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot" element={<Forgot />} />
          <Route path="mycars" element={<Home />} />
          <Route path="logout" element={<Home />} />
          <Route path="messages" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="profil" element={<Profil />} />

          {/* <Route path="forgot/:token" element={<ForgotPassword />} /> */}

        </Route>
      </Routes>
    </BrowserRouter>
  );
}