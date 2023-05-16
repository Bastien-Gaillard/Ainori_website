import Container from '@mui/material/Container';
import { useEffect, useState } from "react";
import theme from '../cusotmization/palette';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, Typography, colors } from '@mui/material';
import axios from 'axios';
import RideCard from './RideCard';
import { Autocomplete } from "@mui/material";
import * as moment from 'moment';
import { makeStyles } from '@mui/styles';
import * as io from "socket.io-client";
import { Snackbar, Alert } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import FormTrajets from './form/FormTrajets';
import CloseIcon from '@mui/icons-material/Close';
import { Helmet } from 'react-helmet'

const instance = axios.create({
  baseURL: 'http://localhost:3001/',
});

export default function Home({ socket }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [inputDepartureCity, setinputDepartureCity] = useState([]);
  const [departureCity, setDepartureCity] = useState("");
  const [departureCityValue, setDepartureCityValue] = useState("");
  const [rides, setRides] = React.useState([]);
  const { handleSubmit, formState: { errors }, register } = useForm();
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    (async () => {
      await getDataCityDeparture();
    })();
  }, [departureCity]);

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
  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 2500);
  };
  const RideCardWrapper = ({ rides }) => {
    console.log('all rides', rides)
    if (rides.length == 0) {
      return (
        <h2 style={{ color: "red", textAlign: "center", margin: "10px", padding: "10px" }}>Pas de trajet pour l’instant ...</h2>
      )
    } else {
      return (
        <Grid container spacing={2}>
          {rides.map((ride) => (
            <Grid item xs={12} sm={6} md={4} key={ride.id}  >
              <RideCard
                title={ride.departure_city + ' - ' + ride.arrival_city + ', le ' + ride.departure_date}
                description={ride.name + ' - de ' + ride.departure_time + ' à ' + ride.arrival_time}
                city={ride.departure_city}
                date={ride.departure_date}
                departure_city={ride.departure_city}
                arrival_city={ride.arrival_city}
                departure_city_lat={ride.departure_city_lat}
                departure_city_lng={ride.departure_city_lng}
                city2={ride.arrival_city}
                arrival_city_lat={ride.arrival_city_lat}
                arrival_city_lng={ride.arrival_city_lng}
                id={ride.id}
                user_id={ride.user_id}
                onSubmitCallback={fetchData}
                handleOpen={handleOpen} // Passer la fonction de rappel
                socket={socket}
              />
            </Grid>
          ))}
        </Grid>
      );
    }


  };
  const fetchData = async () => {
    try {
      if (departureCityValue != "") {
        var Liste = departureCityValue.split(",");
        const data = {
          city: Liste[1],
          code: Liste[0]
        };
        const response = await axios.post('views/propRoutesFilter', data, { headers: { "content-type": "application/json" } });
        const rides = response.data.map((ride) => ({
          id: ride.route_id,
          name: ride.driver,
          departure_city: ride.departure_city,
          departure_city_lat: ride.departure_city_lat,
          departure_city_lng: ride.departure_city_lng,
          arrival_city: ride.arrival_city,
          arrival_city_lat: ride.arrival_city_lat,
          arrival_city_lng: ride.arrival_city_lng,
          departure_date: moment(ride.departure_date).locale('fr').format('LL'),
          departure_time: moment(ride.departure_time).locale('fr').format('LT'),
          arrival_time: moment(ride.arrival_time).locale('fr').format('LT'),
          user_id: ride.user_id
        }));
        setRides(rides.slice(0, 6)); // Limiter à 6 trajets
      } else {
        const response = await axios.get('views/propRoutes');
        const rides = response.data.map((ride) => ({
          id: ride.route_id,
          name: ride.driver,
          departure_city: ride.departure_city,
          departure_city_lat: ride.departure_city_lat,
          departure_city_lng: ride.departure_city_lng,
          arrival_city: ride.arrival_city,
          arrival_city_lat: ride.arrival_city_lat,
          arrival_city_lng: ride.arrival_city_lng,
          departure_date: moment(ride.departure_date).locale('fr').format('LL'),
          departure_time: moment(ride.departure_time).locale('fr').format('LT'),
          arrival_time: moment(ride.arrival_time).locale('fr').format('LT'),
          user_id: ride.user_id
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

  const handleClickOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };
  return (
    <>
    <Helmet>
      <title>Home</title>
    </Helmet>
      <Snackbar open={open} autoHideDuration={16000} onClose={() => setOpen(false)} sx={{ borderRadius: '8px', marginBottom: '50vh', marginLeft: '40%'}}>
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%', borderRadius: '8px' }}>
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
          <Button
            variant='contained'
            onClick={handleClickOpenAdd}
            sx={{
              my: 2, color: '#ffffff', display: 'block', '&:hover': {
                color: '#ffffff',
              }
            }}
          >
            Créer un trajet
          </Button>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            noOptionsText={'Pas de ville correspondante'}
            options={inputDepartureCity}
            sx={{ width: 300, margin: '16px 0 16px 0' }}
            onChange={(event, newValue) => {
              if (newValue != null && newValue !== undefined) {
                setDepartureCityValue(newValue.toString());
              } else {
                setDepartureCityValue("");
              }
            }}
            renderInput={(params) => <TextField
              {...params}
              label="Ville de départ"
              inputRef={inputDepartureCityRef}
              {...inputDepartureCityProps}
              onChange={(e) => setDepartureCity(e.target.value)}
            />
            }
          />
        </div>
        <RideCardWrapper rides={rides} />
        <Dialog
          open={openAdd}
          onClose={handleCloseAdd}
          sx={{ width: '100%' }}
        >
          <DialogTitle>
            <CloseIcon onClick={handleCloseAdd} sx={{ color: 'red' }} />
          </DialogTitle>
          <DialogContent>
            <FormTrajets handleCloseForm={handleCloseAdd} />
          </DialogContent>
        </Dialog>
      </Box>

    </>
  );

};