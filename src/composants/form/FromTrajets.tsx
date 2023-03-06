import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import { Autocomplete, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
const cryptoJs = require('crypto-js');

import * as React from 'react';
import * as moment from 'moment';
import { TimePicker } from '@mui/lab';
import { DemoContainer , DemoItem } from '@mui/x-date-pickers/internals/demo';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import fr from 'date-fns/locale/fr';


const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

export default function FormTrajets(props) {
    const { handleSubmit, formState: { errors }, register, setValue, getValues } = useForm();
    const [selectedDate , setSelectedDate] = useState(new Date());
    const [selectedDate2, setSelectedDate2] = useState(new Date());
    const [selectedTime,  setSelectedTime] = useState(new Date());
    const [selectedTime2,  setSelectedTime2] = useState(new Date());
    const [inputCity , setInputCityCitys ] = useState("");
    const [inputCity2, setInputCityCitys2] = useState("");
    const [City , setCitys ] = useState([]);
    const [City2, setCitys2] = useState([]);
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    var now = moment().locale("fr");

    var tomorrow = moment().add(1, 'day').locale("fr");

    const handleClick = () => {
        props.handleCloseForm(); // Call the handleCloseAdd function here
    }


    const onSubmit = async (data) => {
        const result = await instance.post("lll", data, { headers: { "content-type": "application/json" } })
            .then(async (response) => {
                console.log('the response', response);
            }).catch((err) => {
                console.error(err);
            });
        handleClick();
    }

    const divStyle = {
        width: '100%',
        height: '72vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    useEffect(() => {
        (async () => {
            await getDataCitys();
        })();
    }, [inputCity]);

    useEffect(() => {
        (async () => {
            await getDataCitys2();
        })();
    }, [inputCity2]);

    const getDataCitys = async () => {
        console.log("toto le rigolo",'https://vicopo.selfbuild.fr/cherche/'+inputCity) ;
        if(inputCity != ""){
            await axios.get('https://vicopo.selfbuild.fr/cherche/'+inputCity)
                .then(async (response) => {
                    setCitys(response.data.cities.map(elem => elem.code +", "+ elem.city ));
                    
                }).catch((err) => {
                    console.error(err);
                });
        }
    }
    const getDataCitys2 = async () => {
        console.log("toto le rigolo",'https://vicopo.selfbuild.fr/cherche/'+inputCity2) ;
        if(inputCity2 != ""){
            await axios.get('https://vicopo.selfbuild.fr/cherche/'+inputCity2)
                .then(async (response) => {
                    setCitys2(response.data.cities.map(elem => elem.code +", "+ elem.city ));
                    
                }).catch((err) => {
                    console.error(err);
                });
        }
    }

    const { ref: NameRef, ...NameProps } = register("Name", {
        required: true,
    });
    const { ref: City1Ref, ...City1Props } = register("City1", {
        required: true,
    });
    const { ref: City2Ref, ...City2Props } = register("City2", {
        required: true,
    });

    return (
        <div style={divStyle}>
            <Box
                component="form"
                sx={{
                    width: '100%',
                    '& .MuiTextField-root': { m: 1, width: '42ch' },
                    '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': { width: '100%' },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                    boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)'
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Box sx={{ display: 'flex' }}>
                    <h2>Ajouter un Trajets</h2>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '16px', marginBottom: '16px', marginLeft: '256px', marginRight: '256px', alignItems: 'baseline' }}>
                    <TextField
                        label="Nom"
                        name="name"
                        size="medium"
                        inputRef={NameRef}
                        {...NameProps}
                    />
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={City}
                            sx={{ width: 300, marginTop: '16px' }}
                            renderInput={(params) => <TextField
                                {...params}
                                label="City1"
                                inputRef={City1Ref}
                                {...City1Props}
                                onChange={(e) => setInputCityCitys(e.target.value)}
                            />
                            }
                        />
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={City2}
                            sx={{ width: 300, marginTop: '16px' }}
                            renderInput={(params) => <TextField
                                {...params}
                                label="City2"
                                inputRef={City2Ref}
                                {...City2Props}
                                onChange={(e) => setInputCityCitys2(e.target.value)}
                            />
                            }
                        />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker', 'DatePicker']}>
                            <DatePicker 
                                label="Date du trajet"
                                defaultValue={now}
                            />
                        </DemoContainer>
                        <label>
                            <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
                            trajet recurent ?
                        </label>
                        {isChecked &&
                            <DemoContainer components={['DatePicker', 'DatePicker']}>
                                <DatePicker 
                                    label="Date du trajet"
                                    defaultValue={tomorrow}
                                />
                            </DemoContainer>
                        }
                    
                        <DemoItem label="Mobile variant">
                            <MobileTimePicker defaultValue={now} />
                        </DemoItem>
                        <DemoItem label="Mobile variant">
                            <MobileTimePicker defaultValue={now} />
                        </DemoItem>
                    </LocalizationProvider>
                    <Box sx={{ display: 'flex', marginTop: '16px' }}>
                        <Button variant="contained" sx={{ width: 'auto' }} type="submit">Enregistrer</Button>
                    </Box>
                </Box>
            </Box>
        </div >
    );
}



