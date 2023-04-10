import Container from '@mui/material/Container';
import { useEffect, useState } from "react";
import theme from '../cusotmization/palette';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { Box, Button, Grid, Typography, colors } from '@mui/material';
import axios from 'axios';
import RideCard from './RideCard';
import { Autocomplete } from "@mui/material";
import * as moment from 'moment';
import { makeStyles } from '@mui/styles';
import * as io from "socket.io-client";
import { Snackbar, Alert } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";


const instance = axios.create({
  baseURL: 'http://localhost:3001/',
});

export default function Home() {
  const [open, setOpen] = useState(false);
  const [inputDepartureCity, setinputDepartureCity] = useState([]);
  const [departureCity, setDepartureCity] = useState("");
  const [departureCityValue, setDepartureCityValue] = useState("");
  const socket = io.connect('http://localhost:3001');
  const [rides, setRides] = React.useState([]);
  const { handleSubmit, formState: { errors }, register } = useForm();
  useEffect(() => {
    (async () => {
        await getDataCityDeparture();
    })();
  }, [departureCity]);
  const getDataCityDeparture = async () => {
    console.log(departureCity)

    if (departureCity != "") {
        await axios.get('https://vicopo.selfbuild.fr/cherche/' + departureCity)
            .then(async (response) => {
                console.log('the response', response);
                setinputDepartureCity(response.data.cities.map(elem => elem.code + "," + elem.city));
                console.log(response.data.cities);
            }).catch((err) => {
                console.error(err);
            });
    }
}
  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 2500);
  };
  const RideCardWrapper = ({ rides }) => {
    if (rides.length==0){
      return (
        <h1 style={{color: "red",textAlign: "center" ,margin: "10px",padding: "10px"}}>Pas de trajet pour l'instan ...</h1>
      )
    }else{
      return (
        <Grid container spacing={2}>
          {rides.map((ride) => (
            <Grid item xs={12} sm={6} md={4} key={ride.id}  >
              <RideCard   
                title={ride.departure_city + ' - ' + ride.arrival_city} 
                description={ride.name + ' - ' + ride.departure_date + ' ' + ride.departure_time + ' à ' + ride.arrival_time } 
                city={ride.departure_city} 
                departure_city_lat={ride.departure_city_lat}
                departure_city_lng={ride.departure_city_lng}
                city2={ride.arrival_city} 
                arrival_city_lat={ride.arrival_city_lat}
                arrival_city_lng={ride.arrival_city_lng}
                id={ride.id}
                onSubmitCallback={fetchData}
                handleOpen={handleOpen} // Passer la fonction de rappel
              />
            </Grid>
          ))}
        </Grid>
      );
    }


  };
  const fetchData = async () => {
    console.log("fetchData called");
    console.log("ttttttttttttttttttttttttttta",departureCityValue);
    try {
      if ( departureCityValue != "") {

        var Liste = departureCityValue.split(",");
        const data = {
            city: Liste[1],
            code: Liste[0]
        };
        console.log("Liste called",Liste);
        const response = await axios.post('views/propRoutesFilter', data, { headers: { "content-type": "application/json" } });
        console.log(response);
        const rides = response.data.map((ride) => ({
          id: ride.route_id,
          name: ride.driver,
          departure_city: ride.departure_city,
          departure_city_lat: ride.departure_city_lat,
          departure_city_lng: ride.departure_city_lng,
          arrival_city: ride.arrival_city,
          arrival_city_lat: ride.arrival_city_lat,
          arrival_city_lng: ride.arrival_city_lng,
          departure_date: moment(ride.departure_date).format('D MMMM'),
          departure_time: moment(ride.departure_time).locale('fr').format('LT'),
          arrival_time: moment(ride.arrival_time).locale('fr').format('LT'),
        }));
        setRides(rides.slice(0, 6)); // Limiter à 6 trajets
      } else {
        const response = await axios.get('views/propRoutes');
        console.log(response);
        const rides = response.data.map((ride) => ({
          id: ride.route_id,
          name: ride.driver,
          departure_city: ride.departure_city,
          departure_city_lat: ride.departure_city_lat,
          departure_city_lng: ride.departure_city_lng,
          arrival_city: ride.arrival_city,
          arrival_city_lat: ride.arrival_city_lat,
          arrival_city_lng: ride.arrival_city_lng,
          departure_date: moment(ride.departure_date).format('D MMMM'),
          departure_time: moment(ride.departure_time).locale('fr').format('LT'),
          arrival_time: moment(ride.arrival_time).locale('fr').format('LT'),
        }));
        setRides(rides.slice(0, 6)); // Limiter à 6 trajets
      }

    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => { 
    fetchData();
  }, [departureCityValue]);
  const { ref: inputDepartureCityRef, ...inputDepartureCityProps } = register("inputDepartureCity", {
    required: true,
  });
  return (
    <>
      <Snackbar open={open} autoHideDuration={2000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
          Vous avez rejoint le trajet, le conducteur va être informé.
        </Alert>
      </Snackbar>
      <Box sx={{ p: 2 }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', width: '100%' }}>
          <Typography variant="h4" gutterBottom sx={{ fontSize: '2rem', marginBottom: '1rem' }}>
            Bienvenue sur notre plateforme de covoiturage pour l'école Nextech
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ fontSize: '1.2rem', lineHeight: 1.5, marginBottom: '1rem' }}>
            Nous sommes heureux de vous proposer une plateforme de covoiturage gratuite pour les étudiants de Nextech. Vous pouvez réserver des trajets partagés avec d'autres étudiants pour vous rendre à l'école ou à d'autres événements. Le covoiturage est non seulement économique, mais aussi écologique, car il réduit le nombre de voitures sur la route.
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ fontSize: '1.2rem', lineHeight: 1.5, marginBottom: '1rem' }}>
            Consultez ci-dessous les dernières offres de covoiturage proposées par nos utilisateurs :
          </Typography>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={inputDepartureCity}
            sx={{ width: 300, marginTop: '16px' }}
            onChange={(event, newValue) => {
              if (newValue != null && newValue !== undefined) {
                setDepartureCityValue(newValue.toString());
              }else{
                setDepartureCityValue("");
              }
            }}
            renderInput={(params) => <TextField
                {...params}
                label="Ville de départ"
                inputRef={inputDepartureCityRef}
                {...inputDepartureCityProps}
                onChange={(e) =>  setDepartureCity(e.target.value)}
            />
            }
          />
        </div>
        <RideCardWrapper rides={rides} />
      </Box>  
    </>
  );
  
};