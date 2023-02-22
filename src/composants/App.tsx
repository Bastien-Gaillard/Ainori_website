import * as React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './Header/Header';
import Login from './Login';
import Forgot from './Forgot';
import ForgotPassword from './ForgotPassword';
import Index404 from './404/Index';
import { ThemeProvider } from '@emotion/react';
import theme from '../cusotmization/palette';
import AddCars from './MyCars';

import Home from './Home';
import Profil from './Profil';
import RoutesElement from './RoutesElement';
import { RouteSharp } from '@mui/icons-material';

export default function App() {

  //new Route for test page Home.js by thomas
  return (
    <ThemeProvider theme={theme} >

      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="forgot" element={<Forgot />} />
          <Route path="forgot/:token" element={<ForgotPassword />} />
          <Route path="mycars" element={<Home />} />
          <Route path="addcars" element={<AddCars />} />
          <Route path="route" element={<RoutesElement />} />

          {/* // <Route path="logout" element={<Home />} />
          // <Route path="messages" element={<Home />} /> */}
          <Route path="home" element={<Home />} />
          <Route path="profil" element={<Profil />} />
          <Route path="/*" element={<Index404 />} />
        </Routes>
      </BrowserRouter>

    </ThemeProvider >

  );
}