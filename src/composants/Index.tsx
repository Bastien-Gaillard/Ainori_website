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
        const link = window.location.pathname;
        if (link != '/forgot') {
            if (!link.startsWith('/forgot/')) {
                const check = await instance.get('check/user');
                if (check.data) {
                    setIsConnected(true);
                    const dataUser = await instance.get('/user');
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
        if(link == "/*"){
            console.log("Un lien qui n'existe pas");
        } else {
            console.log("Un lien qui existe");
        }
    }
    useEffect(() => {
        // (async () => {
        authConnexion();
        // })();
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