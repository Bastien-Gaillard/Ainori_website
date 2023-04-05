import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridCellParams, GridColDef, GridRenderCellParams, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import { useForm } from "react-hook-form";
import Driver from './Driver'
import { Container, Typography, Box, CssBaseline, Grid, Link, Tooltip, Button, ButtonGroup } from '@mui/material';
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
import CustomToolBar from '../features/CustomToolbar';
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
 
    const buttons = [
        <Button key="driver" onClick={() => setShowComponent("driver")}>Je suis conducteur</Button>,
        <Button key="user" onClick={() => setShowComponent("user")}>Je suis passagé</Button>,
    ];


    useEffect(() => {
        const fetchData = async () => {
            if (showComponent == 'driver') {
                await instance.get('views/routesHistoryDriver')
                    .then(async (response) => {
                        console.log(response.data)
                        let rows = [];
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
                            console.log('the data', data)
                        });
                    }).catch((err) => {
                        console.error(err);
                    });
            } else {
                await instance.get('views/routesHistoryUser')
                    .then(async (response) => {
                        console.log(response.data)
                        let rows = [];
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
                            console.log('the data', data)
                        });
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
            headerName: 'Heure d\'arrivé',
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
            field: 'status',
            headerName: 'Statut',
            width: 140,
            hideSortIcons: true,
            hideable: false,
            cellClassName: (params: GridCellParams<string>) => {
                if (params.value == null) {
                    return '';
                }

                return clsx('super-app', {
                    end: params.value == "Fini",
                });
            },
        },
        {
            field: 'vehicles',
            headerName: 'Vehicules',
            width: 140,
            hideSortIcons: true,
            hideable: false,
        },
        // {
        //     field: 'id',
        //     headerName: 'Annuler',
        //     width: 140,
        //     hideSortIcons: true,
        //     hideable: false,
        //     renderCell: (params: GridRenderCellParams<any>) => {
        //         return (
        //             moment(params.row.departure_date).format('L') >= moment(new Date()).format('L') && (
        //                 <LeaveRoute routeId={params.value} remainingSeats={params.row}/>
        //             )
        //         )
        //     },
        // },
    ];

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer sx={{ display: 'inline-block', width: '100%' }}>
                <GridToolbarFilterButton sx={{ float: "left" }} />
                <GridToolbarQuickFilter sx={{ float: "right" }} />
            </GridToolbarContainer>
        );
    }

    const localizedTextsMap = {
        columnMenuUnsort: "Annuler le tri",
        columnMenuSortAsc: "Tri ascendant",
        columnMenuSortDesc: "Tri descendant",
        columnMenuFilter: "Filtrer",
        columnMenuShowColumns: "",

    };
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
            <h1>Historique de mes trajets</h1>
            <ButtonGroup
                sx={{
                    width: '12vw', marginLeft: '2vw', marginTop: '2vh'
                }}
                orientation="vertical"
                aria-label="vertical outlined button group"
            >
                {buttons}
            </ButtonGroup>
            {!!data &&
                <DataGrid
                    sx={{ width: '100%', height: '80vh' }}
                    rows={data}
                    columns={columns}
                    pageSize={25}
                    rowsPerPageOptions={[25]}
                    components={{ Toolbar: CustomToolBar }}
                    componentsProps={{
                        toolbar: {
                            showQuickFilter: true,
                            quickFilterProps: { debounceMs: 500 },
                        },
                    }}
                    localeText={localizedTextsMap}
                />
            }
        </Container>
    );
}
