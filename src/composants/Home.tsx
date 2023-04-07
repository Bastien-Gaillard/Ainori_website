import Container from '@mui/material/Container';
import { useEffect, useState } from "react";
import theme from '../cusotmization/palette';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import axios from 'axios';
import * as moment from 'moment';
import * as io from "socket.io-client";


const instance = axios.create({
  baseURL: 'http://localhost:3001/',
});

export default function Home() {
  const socket = io.connect('http://localhost:3001');
  const RideCard = ({ title, description }) => {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mt: 1, fontWeight: 'bold', color: '#333' }}>
          {title}
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
          {description}
        </Typography>
        <Button variant="contained" sx={{ 
          mt: 2, 
          borderRadius: '50px', 
          transition: 'all 0.3s ease-in-out', 
          '&:hover': { 
            backgroundColor: '#FFFFFF', 
            color: '#FF5722' 
          }
        }}>
          Réserver
        </Button>
      </Box>
    );
  };
  
  const RideCardWrapper = ({ rides }) => {
    return (
      <Grid container spacing={2}>
        {rides.map((ride) => (
          <Grid item xs={12} sm={6} md={4} key={ride.id}>
            <RideCard title={ride.departure_city + ' - ' + ride.arrival_city} description={ride.name + ' - ' + ride.departure_date + ' ' + ride.departure_time + ' à ' + ride.arrival_time} />
          </Grid>
        ))}
      </Grid>
    );
  };
  
  const RideList = () => {
    const [rides, setRides] = React.useState([]);
  
    React.useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('views/existingRoutes');
          const rides = response.data.map((ride) => ({
            id: ride.id,
            name: ride.driver,
            departure_city: ride.depature_city,
            arrival_city: ride.arrival_city,
            departure_date: moment(ride.departure_date).format('D MMMM'),
            departure_time: moment(ride.departure_time).locale('fr').format('LT'),
            arrival_time: moment(ride.arrival_time).locale('fr').format('LT'),
          }));
          setRides(rides.slice(0, 6)); // Limiter à 6 trajets
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }, []);
  
    return <RideCardWrapper rides={rides} />;
  };
  return (
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
        </div>
        <RideList />
      </Box>
  );
  
};