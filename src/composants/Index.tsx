import * as React from 'react';
import { Outlet } from "react-router-dom";
import Header from './header/Header';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
const instance = axios.create({
    baseURL: 'http://localhost:3001/api/',
});
const Index = () => {

    const [isConnected, setIsConnected] = useState(false);
    const [user, setUser] = useState();

    let navigate = useNavigate();

    const authConnexion = async () => {
        if(window.location.pathname != '/forgot'){
            const check = await instance.get('check/user');
            if (!check?.data) {
                navigate('/login');
                return;
            } else if ((window.location.pathname == '/login') || (window.location.pathname == '/')) {
                console.log(window.location.pathname);
                navigate('/home');
                return;
            }
            const dataUser = await instance.get('/user');
            setUser(dataUser.data);
            setIsConnected(true);
        }
     
    }
    useEffect(() => {
        authConnexion();
    }, []);

    return (
        <div>
            <Header isConnected={isConnected}
                user={user} />
            <Outlet />
        </div>
    )
};

export default Index;