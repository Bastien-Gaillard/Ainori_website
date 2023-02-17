import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});


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
                const dataUser = await instance.get('/user');
                setUser(dataUser.data);
                if (link == '/') {
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

export default authConnexion; // expose the HelloWorld component to other modules