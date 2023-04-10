import Container from '@mui/material/Container';
import { useEffect, useState } from "react";
import theme from '../cusotmization/palette';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import axios from 'axios';
import CoMap from './CoMap';
import * as moment from 'moment';
import { makeStyles } from '@mui/styles';
import { Snackbar, Alert } from '@mui/material';


const instance = axios.create({
  baseURL: 'http://localhost:3001/',
});
export default function RideCard(Props) {
      const onSubmit = async () => {
        var data = {
          route_id: Props.id,
          status_notice: 0
        };
        console.log(data);
        const route = await instance.post("userHasRoute/create", data, { headers: { "content-type": "application/json" } })
            .then(async (response) => {
                console.log("ok");
                Props.handleOpen();
                Props.onSubmitCallback();
            }).catch((err) => {
                console.error(err);
            });
      }
      return (
        <Box sx={{ p: 2,border: "black 1px solid",borderRadius: "10px",background: "#00bcd41c" }}>
          <Typography variant="h6" gutterBottom sx={{ mt: 1, fontWeight: 'bold', color: '#333' }}>
            {Props.title}
          </Typography>
          <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            {Props.description}
          </Typography>
          <CoMap 
            departure_city_lat={Props.departure_city_lat} 
            departure_city_lng={Props.departure_city_lng} 
            arrival_city_lat={Props.arrival_city_lat} 
            arrival_city_lng={Props.arrival_city_lng} 
          />
            <Button variant="contained" type="submit" onClick={onSubmit} sx={{ 
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