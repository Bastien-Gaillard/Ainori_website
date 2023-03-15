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
import { format, isBefore } from "date-fns";
import fr from 'date-fns/locale/fr';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MultipleDatesPicker from '@ambiot/material-ui-multiple-dates-picker'
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import CalendarTodayTwoToneIcon from '@mui/icons-material/CalendarTodayTwoTone';
import FormCars from '../form/FormCars';
import { Alert, AlertTitle } from '@mui/material/';



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

    const [getDepartureCity, setGetDepartureCity] = useState();
    const [getArrivalCity, setGetArrivalCity] = useState();
    // liste date for travel
    const [datesList, setdatesList] = useState([]);
    // liste city in input obtion
    const [inputDepartureCity, setinputDepartureCity] = useState([]);
    const [inputArrivalCity, setInputArrivalCity] = useState([]);
    // liste cars in input obtion
    const [inputCar, setInputCar] = useState([]);
    
    const [getCarId, setGetCarId] = useState();
    // Alert value
    const [showAlert, setShowAlert] = useState(false);
    // open input date
    const [open, setOpen] = useState(false);
    // Loading
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
        props.handleCloseForm(); // Call the handleCloseAdd function here
    }

    const onSubmit = async (data) => {

        const car_split = data.inputCar.split(":");
        const idCar = parseInt(car_split[0]);
        const dataCar = { id: idCar }
        const resultGetCar = await instance.post("vehicules/id", dataCar, { headers: { "content-type": "application/json" } });
        setGetCarId(resultGetCar.data.id);

        const departureCitySplit = data.inputDepartureCity.split(",");
        const codeDepartureCity = departureCitySplit[0];
        const nameDepartureCity = departureCitySplit[1];
        const dataInputDepartureCity = { code: codeDepartureCity, name: nameDepartureCity }
        const resultGetDepartureCity = await instance.post("city/zip_code/name", dataInputDepartureCity, { headers: { "content-type": "application/json" } });
        setGetDepartureCity(resultGetDepartureCity.data.id);

        const arrivalCitySplit= data.inputArrivalCity.split(",");
        const codeArrivalCity = arrivalCitySplit[0];
        const nameArrivalCity = arrivalCitySplit[1];
        const dataInputArrivalCity = { code: codeArrivalCity , name : nameArrivalCity}
        const resultGetArrivalCity = await instance.post("city/zip_code/name", dataInputArrivalCity, { headers: { "content-type": "application/json" } });
        setGetArrivalCity(resultGetArrivalCity.data.id);

        if (departureTime  && arrivalTime && resultGetDepartureCity.data.id && resultGetArrivalCity.data.id && resultGetCar.data.id &&  resultGetCar.data.available_seats && datesList.length > 0) {      
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
            setIsLoading(true);
            await getCar();
            setIsLoading(false);
        })();
    }, []);

    const handleCloseAdd = () => {
        getCar();
    };


    function ListeDesDates({ datesList }) {
        const today = new Date();
        return (
          <List>
            {datesList.map((date, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CalendarTodayTwoToneIcon />
                </ListItemIcon>
                <ListItemText
                  primary={format(date, "EEEE d MMMM ' 'yyyy", { locale: fr })}
                  secondary={
                    isBefore(date, today) ? (
                      <span style={{ 
                        color: "#ff7000",
                        fontSize: "smaller",
                        border: "1px solid #ff7000",
                        padding: "2px",
                        borderRadius: "6px"
                        }}>Warning: This date is earlier than today's date.</span>
                    ) : null
                  }
                />
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
    if (isLoading){
        return (<Box><h3>Loading...</h3></Box>);
    } else if (inputCar.length <= 0){
        return (
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <h3 style={{
                    marginBottom: "75px",
                    color: "#ff7000",
                    border: "1px solid #ff7000",
                    textAlign: "center",
                    padding: "5px",
                    borderRadius: "15px"
                }}>Il faut d'abord ajouter un véhicule.</h3>
                <FormCars handleCloseForm={handleCloseAdd} />
            </Box>
        );
    }else{
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
                                    backgroundColor: '#f6c343',
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
                            {departureTime > arrivalTime && departureTime && arrivalTime &&(
                                <div 
                                style={{ 
                                    color: "#ff7000",
                                    fontSize: "small",
                                    border: "1px solid #ff7000",
                                    width: "100%",
                                    padding: "5px",
                                    textAlign: "center",
                                    borderRadius: "15px"
                                }}
                                >Warning: Departure time should be before arrival time.</div>
                            )}
                        </LocalizationProvider>
                        {showAlert && (
                        <Alert severity={departureTime && arrivalTime && getDepartureCity && getArrivalCity && getCarId && datesList.length > 0 ? "success" : "error"} >
                            <AlertTitle>{departureTime && arrivalTime && getDepartureCity && getArrivalCity && getCarId && datesList.length > 0 ? "Tous les champs sont remplis" : "Remplir le formulaire"}</AlertTitle>
                            <ul style={{fontSize: "small"}}>
                            {!departureTime && <li>Il faut remplir correctement le champ departure Time.</li>}
                            {!arrivalTime && <li>Il faut remplir correctement le champ arrival Time.</li>}
                            {datesList.length <= 0 && <li>Il faut sélectionner une date.</li>}
                            {!getDepartureCity && <li>Il y a un problème avec Departure City.</li>}
                            {!getArrivalCity && <li>Il y a un problème avec Arrival City.</li>}
                            {!getCarId && <li>Il y a un problème avec la veicule sélectionnée.</li>}
                            </ul>
                        </Alert>
                        )}
                        <Box sx={{ display: 'flex', marginTop: '16px' }}>
                            <Button variant="contained" sx={{ width: 'auto' }} type="submit">Enregistrer</Button>
                        </Box>
                    </Box>
                </Box>
            </div >
        );
    }
}


