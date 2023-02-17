import * as React from 'react';
import { Outlet } from "react-router-dom";
import Header from './header/Header';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});
const Index = () => {

    const [isConnected, setIsConnected] = useState(false);
    const [user, setUser] = useState();
    let navigate = useNavigate();

    const authConnexion = async () => {
        const link = window.location.pathname;
        if (link != '/forgot') {
            if (!link.startsWith('/forgot/')) {
                const check = await instance.get('user/check');
                if (check.data) {
                    setIsConnected(true);
                    const dataUser = await instance.get('user/current/session');
                    setUser(dataUser.data);
                    if (link == '/login' || link == '/') {
                        navigate('/home');
                        return;
                    }
                } else {
                    setIsConnected(false);
                    navigate('/');
                    return;
                }
            }
        }
    }
    useEffect(() => {
        authConnexion();
    }, []);

    return (
        <div>
            <Header />
            <Outlet />
        </div>
    )
};

export default Index;