import * as React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './Header/Header';
import Login from './Login';
import Forgot from './Forgot';
import ForgotPassword from './ForgotPassword';
import Index404 from './404/Index';
import { ThemeProvider } from '@emotion/react';
import theme from '../cusotmization/palette';

import Historical from './Routes/Historical/Historical'
import Carpool from './Carpool'
import Home from './Home';
import Profil from './Profil/Profil';
import { RouteSharp } from '@mui/icons-material';
import RoutesList from './Routes/RoutesList'
import Messages from './Messages/Index';
import * as io from "socket.io-client";
const socket = io.connect('http://localhost:3001');
// import socketIO from 'socket.io-client';
// const socket2 = socketIO.connect('http://localhost:4000');
export default function App() {

  const [image, setImage] = React.useState();

  React.useEffect(() => {
    console.log('image in app ', image);
  }, [image]);

  //new Route for test page Home.js by thomas
  return (
    <ThemeProvider theme={theme} >

      <BrowserRouter>
        <Header socket={socket} updateImage={image}/>

        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="forgot" element={<Forgot />} />
          <Route path="forgot/:token" element={<ForgotPassword />} />
          <Route path="mycars" element={<Home socket={socket}/>} />
          <Route path="myroutes" element={<RoutesList socket={socket}/>} />
          <Route path="carpool" element={<Carpool socket={socket}/>} />
          <Route path="messages" element={<Messages socket={socket}/>} />
          {/* // <Route path="logout" element={<Home />} />
          // <Route path="messages" element={<Home />} /> */}
          <Route path="home" element={<Home socket={socket}/>} />
          <Route path="profil"        element={<Profil updateImage={setImage} obtion={"profil"}/>}    />
          <Route path="profilVoiturs" element={<Profil updateImage={setImage} obtion={"vehiclues"}/>} />
          <Route path="profilAvis"    element={<Profil updateImage={setImage} obtion={"Avis"}/>} />
          <Route path="/*" element={<Index404 />} />
        </Routes>
      </BrowserRouter>

    </ThemeProvider >

  );
}