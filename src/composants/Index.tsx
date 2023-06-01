import * as React from 'react';
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './header/Header';
const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});
const Index = () => {



    return (
        <div>
            <Outlet />
        </div>
    )
};

export default Index;