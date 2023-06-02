import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { DataGrid, frFR, GridCellParams, GridColDef, GridRenderCellParams, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import { useForm } from "react-hook-form";
import Driver from './Driver'
import { Container, Typography, Box, CssBaseline, Grid, Link, Tooltip, Button, ButtonGroup, FormControlLabel, Switch } from '@mui/material';
import * as moment from 'moment';
import FormTrajets from "../../form/FormTrajets";
import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material//Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar, DialogContent, InputAdornment } from "@mui/material";
import MapIcon from '@mui/icons-material/Map';
import LogoutIcon from '@mui/icons-material/Logout';
import LeaveRoute from '../features/LeaveRoute';
interface JSXElement extends React.ReactElement<any> { }
type Element = JSXElement | null;

//Create axios instance
const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});


export default function Historical() {

    const [data, setData] = useState<any>();
    const [result, setResult] = useState();
    const [showComponent, setShowComponent] = useState("driver")


    const handleChange = (event) => {
        if (event.target.checked) {
            setShowComponent('driver');
        } else {
            setShowComponent('user');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (showComponent == 'driver') {
                await instance.get('views/routesHistoryDriver')
                    .then(async (response) => {
                        let rows = [];
                        if (response.data[0]) {

                            response.data.forEach(element => {
                                const date = new Date(element.departure_date);
                                const today = new Date();
                                const route = {
                                    id: element.user_has_route_id,
                                    name: element.driver,
                                    departure_city: element.departure_city_code + ', ' + element.departure_city,
                                    arrival_city: element.arrival_city_code + ', ' + element.arrival_city,
                                    departure_date: date,
                                    departure_time: moment(element.departure_time).locale("fr").format('LT'),
                                    arrival_time: moment(element.arrival_time).locale("fr").format('LT'),
                                    remaining_seats: element.remaining_seats,
                                    vehicles: element.vehicles,
                                    driver_id: element.driver_id,
                                    route_id: element.route_id
                                }
                                rows.push(route);
                                setData(rows);
                            });
                        }
                    }).catch((err) => {
                        console.error(err);
                    });
            } else {
                await instance.get('views/routesHistoryUser')
                    .then(async (response) => {
                        let rows = [];
                        if (response.data[0]) {
                            response.data.forEach(element => {
                                const date = new Date(element.departure_date);
                                const today = new Date();
                                const route = {
                                    id: element.user_has_route_id,
                                    name: element.driver,
                                    departure_city: element.departure_city_code + ', ' + element.departure_city,
                                    arrival_city: element.arrival_city_code + ', ' + element.arrival_city,
                                    departure_date: date,
                                    departure_time: moment(element.departure_time).locale("fr").format('LT'),
                                    arrival_time: moment(element.arrival_time).locale("fr").format('LT'),
                                    remaining_seats: element.remaining_seats,
                                    status: "Fini",
                                    vehicles: element.vehicles,
                                    driver_id: element.driver_id,
                                    route_id: element.route_id
                                }
                                rows.push(route);
                                setData(rows);
                            });
                        }
                    }).catch((err) => {
                        console.error(err);
                    });
            }

        };
        fetchData();
    }, [result, showComponent]);

    const columns: GridColDef[] = [
        {
            field: 'route_id',
            headerName: 'Id route',
            width: 80,
            hideSortIcons: true,
            hide: true,
            filterable: false
        },
        {
            field: 'driver_id',
            headerName: 'Id conducteur',
            width: 80,
            hideSortIcons: true,
            hide: true,
            filterable: false
        },
        {
            field: 'name',
            headerName: 'Conducteur',
            width: 150,
            hideSortIcons: true,
            hideable: false,

            renderCell: (params: GridRenderCellParams<any>) => {
                return (
                    <Tooltip title={<Driver id={params.row.driver_id} />} placement="top-start" arrow>
                        <p>{params.value}</p>
                    </Tooltip>
                )
            }

        },
        {
            field: 'departure_city',
            headerName: 'Ville de départ',
            width: 300,
            hideSortIcons: true,
            hideable: false,
            renderCell: (params: GridRenderCellParams<any>) => {
                const departureZipCode = params.value.split(', ')[0];
                const departureCity = params.value.split(', ')[1];
                const arrivalZipCode = params.row.arrival_city.split(', ')[0];
                const arrivalCity = params.row.arrival_city.split(', ')[1];

                return (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Tooltip title={params.value}>
                            <p>{params.value}</p>
                        </Tooltip>
                        <Tooltip title="Voir sur Maps">
                            <Button href={'https://www.google.com/maps/dir/' + departureZipCode + "+" + departureCity + '/' + arrivalZipCode + '+' + arrivalCity} target='_blank'><MapIcon /></Button>
                        </Tooltip>
                    </ Box>

                )
            },
        },
        {
            field: 'arrival_city',
            headerName: 'Ville d\'arrivée',
            width: 300,
            hideSortIcons: true,
            hideable: false,
            renderCell: (params: GridRenderCellParams<any>) => {

                const departureZipCode = params.row.departure_city.split(', ')[0];
                const departureCity = params.row.departure_city.split(', ')[1];
                const arrivalZipCode = params.value.split(',')[0];
                const arrivalCity = params.value.split(',')[1];
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Tooltip title={params.value}>
                            <p>{params.value}</p>
                        </Tooltip>
                        <Tooltip title="Voir sur Maps">
                            <Button href={'https://www.google.com/maps/dir/' + departureZipCode + "+" + departureCity + '/' + arrivalZipCode + '+' + arrivalCity} about='_blank'><MapIcon /></Button>
                        </Tooltip>
                    </ Box>

                )
            },
        },
        {
            field: 'departure_date',
            headerName: 'Date du trajet',
            width: 150,
            hideSortIcons: true,
            hideable: false,
            renderCell: (params: GridRenderCellParams<any>) => {
                const departureDate = moment(params.value);
                const today = moment(new Date());
                const diffInDays = today.diff(departureDate, 'days');

                let texte = ""
                moment(departureDate).format('L') == moment(today).format('L')
                    ? texte = 'Le trajet est aujourd\'hui'
                    : moment(departureDate).format('L') > moment(today).format('L')
                        ? texte = 'Le trajet est dans ' + diffInDays + " jours"
                        : texte = 'Le trajet était il y a ' + diffInDays + " jours"
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Tooltip title={texte}>
                            <p>{moment(params.value).locale("fr").format('LL')}</p>
                        </Tooltip>
                    </ Box>

                )
            },
        },
        {
            field: 'departure_time',
            headerName: 'Heure de départ',
            width: 110,
            hideSortIcons: true,
            hideable: false,
            renderCell: (params: GridRenderCellParams<any>) => {
                return (
                    <Tooltip title={params.value}>
                        <p>{params.value}</p>
                    </Tooltip>
                )
            },
        },
        {
            field: 'arrival_time',
            headerName: 'Heure d\'arrivée',
            width: 110,
            hideSortIcons: true,
            hideable: false,
        },
        {
            field: 'remaining_seats',
            headerName: 'Places',
            width: 70,
            hideSortIcons: true,
            hideable: false,
        },
        {
            field: 'vehicles',
            headerName: 'Vehicule',
            width: 140,
            hideSortIcons: true,
            hideable: false,
        },
    ];

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer sx={{ display: 'inline-block', width: '100%' }}>
                <GridToolbarFilterButton sx={{ float: "left", marginRight: '1vw' }} />
                <FormControlLabel control={showComponent == 'driver' ? <Switch onClick={handleChange} defaultChecked /> : <Switch onClick={handleChange} />} label="Je conduis" />
                <GridToolbarQuickFilter sx={{ float: "right" }} />
            </GridToolbarContainer>
        );
    }
    return (
        <Container sx={{
            height: '93vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            '@media (min-width: 1200px)': {
                maxWidth: '100%',
            },
            '& .super-app.end': {
                backgroundColor: '#b8f2b2',
                color: '#212121',
                fontWeight: '600',
            },
            '& .super-app.today': {
                backgroundColor: '#b2ebf2',
                color: '#212121',
                fontWeight: '600',
            },
            '& .super-app.after': {
                backgroundColor: '#f2d2b2',
                color: '#212121',
                fontWeight: '600',
            },
        }}>
            <h1 style={{ margin: '1vh 0 2vh 0' }}>Historique de mes trajets</h1>
            <DataGrid
                sx={{ width: '100%', height: '80vh' }}
                rows={data || { id: 1 }}
                columns={columns || [{
                    field: 'remaining_seats',
                    headerName: 'Places',
                    width: 70,
                    hideSortIcons: true,
                    hideable: false,
                }]}
                pageSize={25}
                rowsPerPageOptions={[25]}
                components={{ Toolbar: CustomToolbar }}
                componentsProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    },
                }}
                localeText={frFR.components.MuiDataGrid.defaultProps.localeText}

            />
        </Container>
    );
}
