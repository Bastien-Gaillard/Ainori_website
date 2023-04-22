import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import CreateIcon from '@mui/icons-material/Create';
import { Avatar, DialogContent, InputAdornment, Tooltip } from "@mui/material";
import { isTemplateSpan } from "typescript";
import { ThemeProvider } from "@emotion/react";

import FormCars from '../form/FormCars';
import FormUpdateVehicule from '../form/FromUpdateVehicule';
import AddIcon from '@mui/icons-material/Add';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material//Dialog';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import CloseIcon from '@mui/icons-material/Close';

const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

type ResponseData = {
    id: number;
    name: string;
    images: any;
    models: {
        mark: string;
        model: string;
    };
    color: string;
    lisence_plate: string;
    available_seats: number;
};



export default function Cars() {

    const [responseData, setResponseData] = useState(null);
    const [open, setOpen] = useState(false);
    const [Car, setCar] = useState<ResponseData>();
    const [openDelete, setOpenDelete] = useState(false);
    const [carId, setCarId] = useState(0);
    const [openAdd, setOpenAdd] = useState(false);

    const dataCarsSet = async () => {
        return await instance.get('vehicles/user', { headers: { "content-type": "application/json" } })
            .then(response => {
                setResponseData(response.data)
            })
            .catch((err) => {
                console.error(err);
                return err;
            });
    };
    useEffect(() => {
        dataCarsSet();
    }, []);

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    function luminance(hex) {
        const color = hexToRgb(hex);
        const luminance = (0.2126 * color.r) + (0.7152 * color.g) + (0.0722 * color.b);
        const backgroundColor = luminance > 128 ? '#2f2f2f' : '#E8E7E7';
        return backgroundColor;
    }
    //E8E7E7 c6c6c6
    const divStyle = {
        width: '100%',
        height: '68vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline'
    };
    const icon = {
        justifyContent: 'center'
    };


    const handleClickOpen = (car) => {
        setOpen(true);
        setCar(car);
    };

    const handleClose = () => {
        dataCarsSet();
        setOpen(false);
    };

    const handleClickOpenAdd = () => {
        setOpenAdd(true);
    };

    const handleCloseAdd = () => {
        dataCarsSet();
        setOpenAdd(false);
    };

    const handleClickOpenDelete = (id) => {
        setOpenDelete(true);
        setCarId(id);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const deleteCar = async () => {
        const data = { id: carId, status: 0 }
        await instance.post('vehicles/update/status', data, { headers: { "content-type": "application/json" } })
            .then(async () => {
                dataCarsSet();
            }).catch((err) => {
                console.error(err);
            });
    };

    return (
        <div style={divStyle}>
            <>
                {!!responseData && (
                    <Box sx={{
                        width: '42vw',
                        height: '60vh',
                        boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
                        alignItems: "baseline",
                        minWidth: '400px'
                    }}
                    >
                        <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px' }}>
                            Vos véhicules
                        </Typography>
                        <List sx={{ overflow: 'auto', maxHeight: '50vh' }} >
                            {responseData.vehicule.map(({ id, name, images, lisence_plate, color, models, available_seats }) => (
                                <ListItem alignItems="flex-start" sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }} key={id} onDoubleClick={() => handleClickOpen({ id, name, images, lisence_plate, color, models, available_seats })} >
                                    <ListItemAvatar>
                                        <Tooltip title={<img alt={name} src={images && images.path}  />} placement='top'>
                                            <Avatar alt={name} src={images && images.path} />
                                        </Tooltip>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={name}
                                        secondary={
                                            <React.Fragment>
                                                <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                                                    {models.mark} {models.model}
                                                </Typography>
                                                - {lisence_plate} , {available_seats} {available_seats == 1 ? 'place' : 'places'}
                                            </React.Fragment>
                                        }
                                    />
                                    <ListItemIcon>
                                        <EditIcon sx={{ fontSize: '30px', margin: '2px', '&:hover': { cursor: 'pointer', backgroundColor: 'rgba(0, 0, 0, 0.04)', borderRadius: '20%' } }}
                                            color="primary"
                                            onClick={() => handleClickOpen({ id, name, images, lisence_plate, color, models, available_seats })}
                                        />
                                        <DeleteTwoToneIcon sx={{ fontSize: '30px', margin: '2px', '&:hover': { cursor: 'pointer', backgroundColor: 'rgba(0, 0, 0, 0.04)', borderRadius: '20%' } }}
                                            color="secondary"
                                            onClick={() => handleClickOpenDelete(id)} />
                                        <DirectionsCarFilledIcon style={{ color: color, fontSize: '45px', margin: '2px', backgroundColor: luminance(color), borderRadius: '10px', border: '1px black' }} />
                                    </ListItemIcon>
                                </ListItem>
                            ))}
                            <ListItem button style={icon} key={999} onClick={handleClickOpenAdd}>
                                <ListItemIcon >
                                    <AddIcon style={{ fontSize: '50px' }} />
                                </ListItemIcon>
                            </ListItem>
                        </List>
                    </Box>
                )}
                {openAdd &&
                    <Dialog
                        open={openAdd}
                        onClose={handleCloseAdd}
                        sx={{ width: '100%' }}
                    >
                        <DialogTitle>
                            <CloseIcon onClick={handleCloseAdd} sx={{ color: 'red' }} />
                        </DialogTitle>
                        <DialogContent>
                            <FormCars handleCloseForm={handleCloseAdd} />
                        </DialogContent>
                    </Dialog>
                }
                {openDelete &&
                    <Dialog
                        open={openDelete}
                        onClose={handleCloseDelete}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">Suprimer le véhicule</DialogTitle>
                        <DialogActions>
                            <Button onClick={() => {
                                deleteCar();
                                handleCloseDelete();
                            }}
                                color="primary">
                                Oui
                            </Button>
                            <Button onClick={handleCloseDelete} color="primary">
                                Non
                            </Button>
                        </DialogActions>
                    </Dialog>
                }
                {open &&
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        sx={{ width: '100%' }}
                    >
                        <DialogTitle>
                            <CloseIcon onClick={handleCloseAdd} sx={{ color: 'red' }} />
                        </DialogTitle>
                        {<FormUpdateVehicule cars={Car} handleCloseForm={handleClose} />}
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Retour
                            </Button>
                        </DialogActions>
                    </Dialog>
                }

            </>
        </div>
    );

}



