import * as React from 'react';
import { Outlet } from "react-router-dom";
import Header from './header/Header';

const Index = () => {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    )
  };
  
export default Index;