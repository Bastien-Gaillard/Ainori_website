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
import Alert from '@mui/material/Alert';
import MultipleDatesPicker from '@ambiot/material-ui-multiple-dates-picker'



const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

export default function FormTrajets(props) {

    const { handleSubmit, formState: { errors }, register, setValue, getValues } = useForm();
    const [inputTime,  setInputTime]       = useState<Date | null>(null);
    const [inputTime2,  setInputTime2]     = useState<Date | null>(null);
    const [inputCity , setInputCityCitys ] = useState("");
    const [inputCity2, setInputCityCitys2] = useState("");
    const [inputcars, setinputCars]        = useState("");

    const [datesList, setdatesList] = useState([]);

    const [City , setCitys ] = useState([]);
    const [City2, setCitys2] = useState([]);


    const [car, setCar] = useState([]);
    const [isChecked, setIsChecked] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [varAlert, setvarAlert] = useState("");

    const [open, setOpen] = useState(false)

    

    var now = moment();

    const handleClick = () => {
        props.handleCloseForm(); // Call the handleCloseAdd function here
    }


    const onSubmit = async (data) => {

        const myInputCar = data.Car.split(":");
        const myIdCar = parseInt(myInputCar[0]);

        const dataCar = { id: myIdCar}
        const result3 = await instance.post("vehicules/id", dataCar, { headers: { "content-type": "application/json" } });

        const myInputCity1 = data.City1.split(",");
        const myIdCity1 = myInputCity1[0];
        const myNameCity1 = myInputCity1[1];
         
        const dataCity1 = { code: myIdCity1 , name : myNameCity1}
        const result2 = await instance.post("city/zip_code/name", dataCity1, { headers: { "content-type": "application/json" } });

        const myInputCity2= data.City2.split(",");
        const myIdCity2 = myInputCity2[0];
        const myNameCity2 = myInputCity2[1];

        const dataCity2 = { code: myIdCity2 , name : myNameCity2}
        const result1 = await instance.post("city/zip_code/name", dataCity2, { headers: { "content-type": "application/json" } });

        if (inputTime  && inputTime2 && result2.data.id && result1.data.id && result3.data.id &&  result3.data.available_seats) {      
            for (let i = 0; i < datesList.length; i++) {
                const datatest = { arrival_city_id: result2.data.id , departure_city_id : result1.data.id , departure_time: new Date(inputTime2), arrival_time: new Date(inputTime) , departure_date: new Date(datesList[i]) , vehicules_id: result3.data.id , available_seats: result3.data.available_seats , remaining_seats: result3.data.available_seats , statuts: true};
                console.log("data",datatest);
                const result = await instance.post("route/create", datatest, { headers: { "content-type": "application/json" } })
                .then(async (response) => {
                    console.log('the response', response);
                }).catch((err) => {
                    console.error(err);
                });
            }
            setShowAlert(false);
            handleClick();
        } else {
            setShowAlert(true);
            setvarAlert("probleme de form ");
        }

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

    useEffect(() => {
        (async () => {
            await getCars();
        })();
    }, []);


    const getCars = async () => {
        await instance.get('vehicules/user', { headers: { "content-type": "application/json" } })
            .then(async (response) => {
                setCar(response.data.vehicule.map(elem => elem.id+": "+elem.name+", "+ elem.available_seats+" Places" ));
                
            }).catch((err) => {
                console.error(err);
            });
    }
    const getDataCitys = async () => {
        if(inputCity != ""){
            await axios.get('https://vicopo.selfbuild.fr/cherche/'+inputCity)
                .then(async (response) => {
                    setCitys(response.data.cities.map(elem => elem.code +","+ elem.city ));
                    
                }).catch((err) => {
                    console.error(err);
                });
        }
    }
    const getDataCitys2 = async () => {
        if(inputCity2 != ""){
            await axios.get('https://vicopo.selfbuild.fr/cherche/'+inputCity2)
                .then(async (response) => {
                    setCitys2(response.data.cities.map(elem => elem.code +","+ elem.city ));
                    
                }).catch((err) => {
                    console.error(err);
                });
        }
    }

    const { ref: CarRef, ...CarProps } = register("Car", {
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
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={car}
                        sx={{ width: 300, marginTop: '16px' }}
                        renderInput={(params) => <TextField
                            {...params}
                            label="Car"
                            inputRef={CarRef}
                            {...CarProps}
                            onChange={(e) => setinputCars(e.target.value)}
                        />
                        }
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
                    <div>
                        <Button onClick={() => setOpen(!open)}>
                            Select Dates
                        </Button>
                        <MultipleDatesPicker
                            open={open}
                            selectedDates={datesList}
                            onCancel={() => setOpen(false)}
                            onSubmit={dates => {setdatesList(dates),setOpen(false)}}
                        />
                    </div>
                    <LocalizationProvider  dateAdapter={AdapterDayjs}>
                        <DemoItem label="Mobile variant">
                            <MobileTimePicker 
                                label="Date au "
                                value={inputTime}
                                onChange={(newValue) => setInputTime(newValue)}
                            />
                        </DemoItem>
                        <DemoItem label="Mobile variant">
                        <MobileTimePicker 
                                label="Date au "
                                value={inputTime2}
                                onChange={(newValue) => setInputTime2(newValue)}
                            />
                        </DemoItem>
                    </LocalizationProvider>
                    <Box sx={{ display: 'flex', marginTop: '16px' }}>
                        <Button variant="contained" sx={{ width: 'auto' }} type="submit">Enregistrer</Button>
                    </Box>
                    {showAlert && (
                        <Alert severity="error">
                        {varAlert}
                        </Alert>
                    )}
                </Box>
            </Box>
        </div >
    );
}



