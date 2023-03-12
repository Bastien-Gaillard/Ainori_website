import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import { Autocomplete } from "@mui/material";
const cryptoJs = require('crypto-js');
import 'dayjs/locale/fr';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
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



const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

export default function FormTrajets(props) {

    const { handleSubmit, formState: { errors }, register } = useForm();
    // set value of input time
    const [departureTime, setDepartureTime] = useState<Date | null>(null);
    const [arrivalTime, setArrivalTime] = useState<Date | null>(null);
    // set value of input city 
    const [departureCity, setDepartureCity] = useState("");
    const [arrivalCity, setArrivalCity] = useState("");
    // liste date for travel
    const [datesList, setdatesList] = useState([]);
    // liste city in input obtion
    const [inputDepartureCity, setinputDepartureCity] = useState([]);
    const [inputArrivalCity, setInputArrivalCity] = useState([]);
    // liste cars in input obtion
    const [inputCar, setInputCar] = useState([]);
    // Alert value
    const [showAlert, setShowAlert] = useState(false);
    const [varAlert, setvarAlert] = useState("");
    // open input date
    const [open, setOpen] = useState(false)

    const handleClick = () => {
        props.handleCloseForm(); // Call the handleCloseAdd function here
    }

    const onSubmit = async (data) => {

        const car_split = data.inputCar.split(":");
        const idCar = parseInt(car_split[0]);
        const dataCar = { id: idCar }
        const resultGetCar = await instance.post("vehicules/id", dataCar, { headers: { "content-type": "application/json" } });

        const departureCitySplit = data.inputDepartureCity.split(",");
        const codeDepartureCity = departureCitySplit[0];
        const nameDepartureCity = departureCitySplit[1];
        const dataInputDepartureCity = { code: codeDepartureCity, name: nameDepartureCity }
        const resultGetDepartureCity = await instance.post("city/zip_code/name", dataInputDepartureCity, { headers: { "content-type": "application/json" } });


        const arrivalCitySplit= data.inputArrivalCity.split(",");
        const codeArrivalCity = arrivalCitySplit[0];
        const nameArrivalCity = arrivalCitySplit[1];
        const dataInputArrivalCity = { code: codeArrivalCity , name : nameArrivalCity}
        const resultGetArrivalCity = await instance.post("city/zip_code/name", dataInputArrivalCity, { headers: { "content-type": "application/json" } });
        if (departureTime  && arrivalTime && resultGetDepartureCity.data.id && resultGetArrivalCity.data.id && resultGetCar.data.id &&  resultGetCar.data.available_seats) {      
            for (let i = 0; i < datesList.length; i++) {
                const dataSend = {
                    arrival_city_id: resultGetArrivalCity.data.id,
                    departure_city_id: resultGetDepartureCity.data.id,
                    departure_time: new Date(departureTime),
                    arrival_time: new Date(arrivalTime),
                    departure_date: new Date(datesList[i]),
                    vehicules_id: resultGetCar.data.id,
                    available_seats: resultGetCar.data.available_seats,
                    remaining_seats: resultGetCar.data.available_seats,
                    statuts: true
                };
                console.log("dataSend", dataSend);
                const result = await instance.post("route/create", dataSend, { headers: { "content-type": "application/json" } })
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
            setvarAlert("remplir le formulaire");
        }

    }

    const divStyle = {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    useEffect(() => {
        (async () => {
            await getDataCityDeparture();
        })();
    }, [departureCity]);

    useEffect(() => {
        (async () => {
            await getDataCityArrival();
        })();
    }, [arrivalCity]);

    useEffect(() => {
        (async () => {
            await getCar();
        })();
    }, []);


    function ListeDesDates({ datesList }) {
        return (
            <List>
                {datesList.map((date, index) => (
                    <ListItem key={index}>
                        <ListItemIcon>
                            <CalendarTodayTwoToneIcon />
                        </ListItemIcon>
                        <ListItemText primary={format(date, "EEEE d MMMM ' 'yyyy", { locale: fr })} />
                    </ListItem>
                ))}
            </List>
        );
    }
    
      

    const getCar = async () => {
        await instance.get('vehicules/user', { headers: { "content-type": "application/json" } })
            .then(async (response) => {
                setInputCar(response.data.vehicule.map(elem => elem.id + ": " + elem.name + ", " + elem.available_seats + " Places"));

            }).catch((err) => {
                console.error(err);
            });
    }
    const getDataCityDeparture = async () => {
        if (departureCity != "") {
            await axios.get('https://vicopo.selfbuild.fr/cherche/' + departureCity)
                .then(async (response) => {
                    setinputDepartureCity(response.data.cities.map(elem => elem.code + "," + elem.city));

                }).catch((err) => {
                    console.error(err);
                });
        }
    }
    const getDataCityArrival = async () => {
        if (arrivalCity != "") {
            await axios.get('https://vicopo.selfbuild.fr/cherche/' + arrivalCity)
                .then(async (response) => {
                    setInputArrivalCity(response.data.cities.map(elem => elem.code + "," + elem.city));

                }).catch((err) => {
                    console.error(err);
                });
        }
    }

    const { ref: inputCarRef, ...inputCarProps } = register("inputCar", {
        required: true,
    });
    const { ref: inputDepartureCityRef, ...inputDepartureCityProps } = register("inputDepartureCity", {
        required: true,
    });
    const { ref: inputArrivalCityRef, ...inputArrivalCityProps } = register("inputArrivalCity", {
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
                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '16px', marginBottom: '16px', marginLeft: '256px', marginRight: '256px', alignItems: 'baseline' }}>
                    <Box sx={{ display: 'flex' }}>
                        <h2>Ajouter un Trajet</h2>
                    </Box>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={inputCar}
                        sx={{ width: 300, marginTop: '16px' }}
                        renderInput={(params) => <TextField
                            {...params}
                            label="vehicule du Trajet"
                            inputRef={inputCarRef}
                            {...inputCarProps}
                            onChange={(e) => console.log(e.target.value)}
                        />
                        }
                    />
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={inputDepartureCity}
                        sx={{ width: 300, marginTop: '16px' }}
                        renderInput={(params) => <TextField
                            {...params}
                            label="Departure City"
                            inputRef={inputDepartureCityRef}
                            {...inputDepartureCityProps}
                            onChange={(e) => setDepartureCity(e.target.value)}
                        />
                        }
                    />
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={inputArrivalCity}
                        sx={{ width: 300, marginTop: '16px' }}
                        renderInput={(params) => <TextField
                            {...params}
                            label="Arrival City"
                            inputRef={inputArrivalCityRef}
                            {...inputArrivalCityProps}
                            onChange={(e) => setArrivalCity(e.target.value)}
                        />
                        }
                    />
                    <LocalizationProvider locale={fr} dateAdapter={AdapterDayjs}>
                        <Button
                            onClick={() => setOpen(!open)}
                            sx={{
                                width: '100%',
                                marginTop: '10px',
                                marginBottom: '10px',
                                height: '50px',
                                backgroundColor: '#e4c926',
                                color: 'black',
                                '&:hover': {
                                    backgroundColor: '#c5a522',
                                    color: 'white',
                                    cursor: 'pointer'
                                }
                            }}
                        >
                            Select Dates
                        </Button>
                        <MultipleDatesPicker
                            open={open}
                            selectedDates={datesList}
                            onCancel={() => setOpen(false)}
                            onSubmit={dates => { setdatesList(dates), setOpen(false) }}
                        />
                        {datesList.length > 0 && (
                            <Box
                                sx={{
                                    marginTop: '15px',
                                    marginBottom: '30px'
                                }}
                            >
                                <h3>Liste de dates selectioner :</h3>
                                <ListeDesDates datesList={datesList} />
                            </Box>
                        )}
                        <DemoItem label="Departure time">
                            <MobileTimePicker
                                label="Departure time"
                                value={departureTime}
                                onChange={(newValue) => setDepartureTime(newValue)}
                            />
                        </DemoItem>
                        <DemoItem label="Arrival time">
                            <MobileTimePicker
                                label="Arrival time"
                                value={arrivalTime}
                                onChange={(newValue) => setArrivalTime(newValue)}
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



