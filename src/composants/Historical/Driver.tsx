import axios from 'axios';
import { useEffect, useRef, useState } from "react";
import MailIcon from '@mui/icons-material/Mail';
import { Container, Typography, Box, CssBaseline, Grid, Link, Tooltip, Button, Avatar } from '@mui/material';
import * as moment from 'moment';
interface JSXElement extends React.ReactElement<any> { }
type Element = JSXElement | null;


//Create axios instance
const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});


export default function Driver(id) {

    const [driver, setDriver] = useState<any>();
    const emailRef = useRef(null);
    const [driverId, setDriverId] = useState<number>(id)
    console.log('the id in Driver', id)
    useEffect(() => {
        const fetchData = async () => {
            console.log('qdozjjpoqpjkqdspqdspoqsd', driverId)
            await instance.post('user/id', id, { headers: { "content-type": "application/json" } })
                .then(async (response) => {
                    console.log('driver response', response.data);
                    setDriver(response.data);
                }).catch((err) => {
                    console.error(err);
                });
        };
        fetchData();
    }, []);


    const handleMouseEnter = () => {
        emailRef.current.style.color = '#00bcd4';
    };

    const handleMouseLeave = () => {
        emailRef.current.style.color = '#ffffff';
    };

    return (

        <Container >
            {!!driver &&
                <Box>
                    <h2>{driver.firstname + ' ' + driver.lastname}</h2>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar alt={driver.firstname} src={!!driver?.image?.path ? driver.image.path : ''} />
                        <Button><MailIcon /></Button>
                    </Box>
                    <br />
                    {!!driver.description && <p>{driver.description}</p>}
                    <br />
                    <p><b>Email :</b></p>
                    <a ref={emailRef}
                        style={{ color: '#ffffff', textDecoration: 'none' }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        href={'mailto:' + driver.email}>
                        {driver.email}
                    </a>
                </Box>
            }
        </Container>
    );
}
