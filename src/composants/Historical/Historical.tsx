import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridCellParams, GridColDef, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import { useForm } from "react-hook-form";
import { Container, Typography, Box, CssBaseline, Grid, Link } from '@mui/material';
import * as moment from 'moment';
interface JSXElement extends React.ReactElement<any> { }
type Element = JSXElement | null;

//Create axios instance
const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});


export default function Historical() {

    const [routes, setRoutes] = useState<any>();
    const [data, setData] = useState<any>();

    const frFR =
        useEffect(() => {
            const fetchData = async () => {
                await instance.get('routes/id')
                    .then(async (response) => {
                        let rows = [];
                        response.data.forEach(element => {
                            const date = new Date(element.departure_date);
                            console.log(element);
                            const route = {
                                id: element.id,
                                name: element.route.lastname + ' ' + element.route.firstname,
                                departure_city: element.departure_city.name,
                                arrival_city: element.arrival_city.name,
                                departure_date: moment(date).locale("fr").format('LL'),
                                departure_time: moment(element.departure_time).locale("fr").format('LT'),
                                arrival_time: moment(element.arrival_time).locale("fr").format('LT'),
                                remaining_seats: element.remaining_seats
                            }
                            rows.push(route);
                            setData(rows);
                        });
                        setRoutes(response.data);
                    }).catch((err) => {
                        console.error(err);
                    });
            };
            fetchData();
        }, []);

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
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
        },
        {
            field: 'departure_city',
            headerName: 'Ville de départ',
            width: 150,
            hideSortIcons: true,
            hideable: false,

        },
        {
            field: 'arrival_city',
            headerName: 'Ville d\'arrivée',
            type: 'number',
            width: 150,
            hideSortIcons: true,
            hideable: false,
        },
        {
            field: 'departure_date',
            headerName: 'Date du trajet',
            type: 'date',
            width: 150,
            hideSortIcons: true,
            hideable: false,
        },
        {
            field: 'departure_time',
            headerName: 'Heure de départ',
            type: 'number',
            width: 110,
            hideSortIcons: true,
            hideable: false,
        },
        {
            field: 'arrival_time',
            headerName: 'Heure d\'arrivé',
            type: 'number',
            width: 110,
            hideSortIcons: true,
            hideable: false,
        },
        {
            field: 'remaining_seats',
            headerName: 'Places disponibles',
            type: 'number',
            width: 140,
            hideSortIcons: true,
            hideable: false,
            // cellClassName: (params: GridCellParams<number>) =>
                
            //     clsx('super-app', {
            //         positive: params.value === 0,
            //     }),
        },
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
            '& .super-app.negative': {
                backgroundColor: 'rgba(157, 255, 118, 0.49)',
                color: '#1a3e72',
                fontWeight: '600',
            },
            '& .super-app.positive': {
                backgroundColor: '#d47483',
                color: '#1a3e72',
                fontWeight: '600',
            },
        }}>
            <h1>Historique de mes trajets</h1>
            {!!data &&
                <DataGrid
                    sx={{ width: '100%', height: '80vh' }}
                    rows={data}
                    columns={columns}
                    pageSize={25}
                    rowsPerPageOptions={[25]}
                    components={{ Toolbar: CustomToolbar }}
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
