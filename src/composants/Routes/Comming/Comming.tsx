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
import DeleteRoutes from '../features/DeleteRoutes';
import Alert from "../../features/Alert"
import { useSnackbar } from 'notistack';
import RideCard from '../../RideCard';
interface JSXElement extends React.ReactElement<any> { }
type Element = JSXElement | null;

//Create axios instance
const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});


export default function Comming({ socket }) {

    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<any>();
    const [openAdd, setOpenAdd] = useState(false);
    const [result, setResult] = useState();
    const [deleteRoutes, setDeleteRoutes] = useState(false);
    const [leaveRoutes, setLeaveRoutes] = useState(false);
    const [ride, setRide] = useState<any>({});
    const [openRoutes, setOpenRoutes] = useState(false);
    const handleChange = (event) => {
        setData({});
    };
    const handleDeleteRoutesdValue = (value) => {
        setDeleteRoutes(value);
    };

    const handleLeaveRoutesdValue = (value) => {
        setLeaveRoutes(value);
    };

    const handleOpen = () => {
        setOpen(true);
        setTimeout(() => {
            setOpen(false);
        }, 2500);
    };


    const handleClickOpenAdd = () => {
        setOpenAdd(true);
    };

    const handleCloseAdd = () => {
        setOpenAdd(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            console.log('rows')
            await instance.get('views/routesCommingUser')
                .then(async (response) => {
                    console.log('the response user', response.data)
                    let rows = [];
                    if (response.data[0]) {
                        response.data.forEach(element => {
                            const date = new Date(element.departure_date);
                            const today = new Date();
                            const route = {
                                id: element.user_has_route_id,
                                name: element.driver,
                                user_has_route_id: element.user_has_route_id,
                                departure_code: element.departure_city_code,
                                arrival_code: element.arrival_city_code,
                                departure_city: element.departure_city,
                                arrival_city: element.arrival_city,
                                departure_date: date,
                                departure_time: moment(element.departure_time).locale("fr").format('LT'),
                                arrival_time: moment(element.arrival_time).locale("fr").format('LT'),
                                remaining_seats: element.remaining_seats,
                                status: moment(date).format('L') == moment(today).format('L') ? "Aujourd\'hui" : moment(date).format('L') > moment(today).format('L') ? "À venir" : "Fini",
                                vehicles: element.vehicles,
                                driver_id: element.driver_id,
                                route_id: element.route_id,
                                is_driver: false
                            }
                            rows.push(route);

                            console.log('rows', rows)
                            setData(rows);
                        });
                    }
                }).catch((err) => {
                    console.error(err);
                });
        }
        fetchData();
    }, [result, deleteRoutes, leaveRoutes]);

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
            field: 'user_has_route_id',
            headerName: 'Id participant',
            width: 80,
            hideSortIcons: true,
            hide: true,
            filterable: false
        },
        {
            field: 'is_driver',
            headerName: 'Je suis conducteur',
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
                const departureZipCode = params.row.departure_code;
                const departureCity = params.value;
                const arrivalZipCode = params.row.arrival_code;
                const arrivalCity = params.row.arrival_city;

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

                return (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <p>{moment(params.value).locale("fr").format('LL')}</p>
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
        {
            field: 'id',
            headerName: 'Annuler',
            width: 80,
            hideSortIcons: true,
            filterable: false,
            hideable: false,
            renderCell: (params: GridRenderCellParams<any>) => {
                if (params.row.is_driver) {
                    return (
                        <Box>
                            <DeleteRoutes onDeleteRoutesValue={handleDeleteRoutesdValue} routeId={params.row.route_id} socket={socket} />
                        </Box>

                    )
                } else {
                    return (
                        <LeaveRoute onDeleteRoutesValue={handleLeaveRoutesdValue} routeId={params.row.route_id} userHasRouteId={params.row.user_has_route_id} userId={params.row.driver_id} socket={socket} />
                    )
                }
            }
        },
    ];

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer sx={{ display: 'inline-block', width: '100%' }}>
                <GridToolbarFilterButton sx={{ float: "left", marginRight: '1vw' }} />

                <GridToolbarQuickFilter sx={{ float: "right" }} />
            </GridToolbarContainer>
        );
    }

    const getRowClassName = (params) => {
        if (params.row.is_driver) {
            return 'MuiDataGrid-row-red';
        } else {

        }
    };

    const fetchData = () => {
        console.log('fetchData')
    }
    return (
        <Container sx={{
            height: '93vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            '@media (min-width: 1200px)': {
                maxWidth: '100%',
            }
        }}>
            <h1 style={{ margin: '1vh 0 2vh 0' }}>Trajet à venir (je conduis)</h1>
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
