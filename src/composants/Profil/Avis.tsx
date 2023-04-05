import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import CreateIcon from '@mui/icons-material/Create';
import { Avatar, InputAdornment } from "@mui/material";
import { isTemplateSpan } from "typescript";
import { ThemeProvider } from "@emotion/react";
import { Autocomplete } from "@mui/material";
const cryptoJs = require('crypto-js');
import 'dayjs/locale/fr';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { DemoContainer , DemoItem } from '@mui/x-date-pickers/internals/demo';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Alert from '@mui/material/Alert';
import MultipleDatesPicker from '@ambiot/material-ui-multiple-dates-picker'
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import CalendarTodayTwoToneIcon from '@mui/icons-material/CalendarTodayTwoTone';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

export default function Avis() {
    const [responseData, setResponseData] = useState(null);
    const [note, setNote] = useState(null);

    useEffect(() => {
        dataNote();
        dataAvis();
    }, []);

    const dataAvis = async () => {
        return await instance.get('notices/user', { headers: { "content-type": "application/json" } })
            .then(response => {
                setResponseData(response.data)
            })
            .catch((err) => {
                console.error(err);
                return err;
            });
    };

    const dataNote = async () => {
        return await instance.get('notices/user/moyen', { headers: { "content-type": "application/json" } })
            .then(response => {
                setNote(response.data)
            })
            .catch((err) => {
                console.error(err);
                return err;
            });
    };

   console.log(responseData);
   console.log(note);

    const divStyle = {
        width: '100%',
        height: '88vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };
    return (
        <div style={divStyle}>
            <Box sx={{
                        width: '42vw',
                        height: '60vh',
                        boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',

                    }}
            >
                <Typography variant="h2" sx={{textAlign: "center",marginBottom: "20px"}} >
                        Vos avis
                </Typography>
               
                    {!!responseData && !!note && (
                     <Box sx={{                        
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '10px'
                        }}
                     >
                        {responseData.length > 0 && (
                            <Box>
                                <Box sx={{  height: "50px",
                                            borderBottom: "1px solid black",
                                            marginBottom: "20px"
                                        }}>
                                    <Typography variant="h4" >
                                                Moyenne :
                                                <Rating name="read-only" value={note?.[0].moyenne} readOnly />
                                    </Typography>
                                </Box>
                                <Typography variant="h3" >
                                            Vos avis :
                                </Typography>                 
                                <List sx={{ overflow: 'auto', maxHeight: '35vh' }}>
                                    {responseData.map((data, index) => (
                                        <ListItem key={index} sx={{ borderBottom: '1px #ffc107 solid'}}>
                                            <Rating name="read-only" value={data.note} readOnly />
                                            <ListItemText primary={" : "+data.comantaire} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                        {responseData.length <= 0 && (
                            <Box><Typography variant="h4" >Pas encor d'avis</Typography></Box>
                        )}
                    </Box>
                    )}
            </Box>
        </div >
    );
}



