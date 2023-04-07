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
import { MapContainer, TileLayer, Polyline  ,Marker,Popup} from "react-leaflet";

// État du composant
export default function Map2(props) {
  const [coordinates, setCoordinates] = useState([0,0]); // Les suggestions d'adresses
  const [coordinates2, setCoordinates2] = useState([0,0]); // Les suggestions d'adresses
  //const pointList = [pointA, pointB];

  // Référence pour la carte
  const mapRef = useRef(null);

  // Fonction pour effectuer la recherche d'adresse
  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${props.city}`);
      const suggestions = response.data.features[0].geometry.coordinates;
      setCoordinates(suggestions.reverse());
      
    } catch (error) {
      console.error(error);
    }
    try {
        const response = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${props.city2}`);
        const suggestions2 = response.data.features[0].geometry.coordinates;
        setCoordinates2(suggestions2.reverse());
        
    } catch (error) {
    console.error(error);
    }
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
    }
  }, [coordinates, coordinates2]);

  // Rendu du composant
  return (
    <div>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossOrigin="" />
      <MapContainer center={coordinates} zoom={13} style={{ height: "250px" ,border: "1px #00000054 solid" }} ref={mapRef}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={[coordinates,coordinates2]} pathOptions={{ color: 'red', weight: 3, opacity: 0.5, smoothFactor: 1 }} />
        <Marker position={coordinates}>
          <Popup>
          Point de départ
          </Popup>
        </Marker>
        <Marker position={coordinates2}>
          <Popup>
          Point d'arrivée
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
