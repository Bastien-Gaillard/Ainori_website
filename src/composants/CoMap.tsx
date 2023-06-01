// Importation des modules nécessaires à la construction de la carte
import Container from '@mui/material/Container';
import theme from '../cusotmization/palette';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import CoMap from './CoMap';
import * as moment from 'moment';
import { makeStyles } from '@mui/styles';
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polyline  ,Marker,Popup } from "react-leaflet";
import L from 'leaflet';


// État du composant
export default function Map2(props) {

 

  const [coordinates, setCoordinates] = useState([0,0]); // Les suggestions d'adresses
  const [coordinates2, setCoordinates2] = useState([0,0]); // Les suggestions d'adresses


  // Référence pour la carte
  const mapRef = useRef(null);

  let arrival = L.icon({
    iconUrl: "https://img.icons8.com/emoji/25/null/chequered-flag.png",
    iconAnchor: [2,25]
  });
  let departure = L.icon({
    iconUrl: "https://img.icons8.com/fluency/25/null/carpool.png",
    iconAnchor: [12.5, 12.5]
  });
  // Fonction pour effectuer la recherche d'adresse
  const handleSearch = async () => {
    setCoordinates([props.departure_city_lat,props.departure_city_lng]);
    setCoordinates2([props.arrival_city_lat,props.arrival_city_lng]);
  };
  useEffect(() => {
    const fetchData = async () => {
      await handleSearch();
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fitBounds([coordinates, coordinates2], { padding: [50, 50] });
      L.marker(coordinates, { icon: departure }).addTo(mapRef.current);
      L.marker(coordinates2, { icon: arrival }).addTo(mapRef.current);
    }
  }, [coordinates, coordinates2]);

  // Rendu du composant
  return (
    <div>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossOrigin="" />
      <MapContainer center={coordinates} zoom={13} style={{ height: "250px" ,border: "1px #00000054 solid" }} ref={mapRef} scrollWheelZoom={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={[coordinates,coordinates2]} pathOptions={{ color: 'red', weight: 3, opacity: 0.5, smoothFactor: 1 }} />
      </MapContainer>
    </div>
  );
}
