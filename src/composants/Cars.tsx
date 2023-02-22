import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import CreateIcon from '@mui/icons-material/Create';
import { Avatar, InputAdornment } from "@mui/material";
import { isTemplateSpan } from "typescript";
import { ThemeProvider } from "@emotion/react";

import FormCars from './form/FormCars';
import FormUpdateVehicule from './form/FromUpdateVehicule';
import AddIcon from '@mui/icons-material/Add';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material//Dialog';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

const instance = axios.create({
    baseURL: 'http://localhost:3001/api/',
});

type ResponseData = {
    id : number;
    name: string;
    images: any;
    models: {
      mark: string;
      model: string;
    };
    color : string;
    lisence_plate: string;
    available_seats: number;
  };
  
  
  
export default function Cars() {

    const [responseData, setResponseData] = useState(null);

    

    const dataCarsSet = async () => {
        return await instance.get('cars/id/', { headers: { "content-type": "application/json" } })
        .then(response => setResponseData(response.data))
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
        console.log(luminance);
        const backgroundColor = luminance > 128  ? '#2f2f2f' : '#E8E7E7';
        return backgroundColor;
    }
//E8E7E7 c6c6c6
    const divStyle = {
        width: '100%',
        height: '88vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };
    const icon = {
        justifyContent: 'center'
    };

    
    const [open, setOpen] = useState(false);
    const [Car, setCar] = useState<ResponseData>();
    console.log("toto le rigolo2","value");
    const handleClickOpen = (voiturr) => {
        
      setOpen(true);
      setCar(voiturr);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const [openAdd, setOpenAdd] = useState(false);

    const handleClickOpenAdd = () => {
        setOpenAdd(true);
    };
  
    const handleCloseAdd = () => {
        setOpenAdd(false);
    };

    const [openDelete, setOpenDelete] = useState(false);
    const [CarIdCar, setCas] = useState(0);

    const handleClickOpenDelete = (id) => {
        setOpenDelete(true);
        setCas(id);
    };
  
    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const deleteCar=  async () => {
        const data = {id:CarIdCar}
        await instance.post('update/car/', data, { headers: { "content-type": "application/json" } })
        .then(async () => {
            dataCarsSet();
        }).catch((err) => {
            console.error(err);
        });
    };
    
    
    return (
        <div style={divStyle}>
        <>
            {responseData ? (
                <Box sx={{ 
                    minWidth: '28%',
                    minHeight: '60vh',
                    boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)'}}
                    alignItems="center"
                >    
                    <Typography variant="h3" sx={{   
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '10px'}} 
                    >
                    Vos véhicules
                    </Typography>
                    <List >
                        {responseData.vehicule.map(({id,name, images, lisence_plate, color, models,available_seats}) => (
                            <ListItem button alignItems="flex-start" key={id} onDoubleClick={() => handleClickOpen({ id, name, images, lisence_plate, color, models , available_seats })} >
                                <ListItemAvatar>
                                    <Avatar alt={name} src={images ? images : 'null'} />
                                </ListItemAvatar> 
                                <ListItemText
                                    primary={name}
                                    secondary={
                                        <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {models.mark} {models.model}
                                        </Typography>
                                        - {lisence_plate} , {available_seats} Place
                                        </React.Fragment>
                                        }
                                />
                                <ListItemIcon>
                                    <EditIcon style={{ fontSize: '30px',margin: '2px'  }} onClick={() => handleClickOpen({ id, name, images, lisence_plate, color, models , available_seats })} />
                                    <DeleteTwoToneIcon style={{ fontSize: '30px',margin: '2px'  }} onClick={() => handleClickOpenDelete(id)} />
                                    <DirectionsCarFilledIcon style={{ color: color,fontSize: '45px',margin: '2px', backgroundColor: luminance(color),borderRadius: '10px',border: '1px black' }}/>
                                </ListItemIcon>
                                
                            </ListItem>
                        ))}
                            <Box>
                                <ListItem button style={icon} key={999}  onClick={handleClickOpenAdd}>
                                    <ListItemIcon >
                                        <AddIcon style={{fontSize: '50px' }}/>
                                    </ListItemIcon>
                                </ListItem>
                                <Dialog
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    >
                                    <DialogTitle id="alert-dialog-title">{"Modifier véhicules"}</DialogTitle>
                                    {<FormUpdateVehicule cars={Car}/>}
                                    <DialogActions>
                                    <Button onClick={handleClose} color="primary">
                                        Retour
                                    </Button>
                                    </DialogActions>
                                </Dialog>
                                <Dialog
                                    open={openAdd}
                                    onClose={handleCloseAdd}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    >
                                    <DialogTitle id="alert-dialog-title">{"Ajout véhicules"}</DialogTitle>
                                    {<FormCars />}
                                    <DialogActions>
                                    <Button onClick={handleCloseAdd} color="primary">
                                        Retour
                                    </Button>
                                    </DialogActions>
                                </Dialog>
                                <Dialog
                                    open={openDelete}
                                    onClose={handleCloseDelete}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    >
                                    <DialogTitle id="alert-dialog-title">{"Suprimer véhicules"}</DialogTitle>
                                    {/* <FormLogin /> */}voitur
                                    <DialogActions>
                                    <Button 
                                    onClick={() => {
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
                            </Box>

                    </List>
                </Box>
            ) : (
                <Box sx={{ 
                    minWidth: '28%',
                    minHeight: '60vh',
                    boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',}}
                    alignItems="center"
                >    
                    <Typography variant="h3" sx={{   
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '10px'}} 
                    >
                    Vos véhicule
                    </Typography>
                    <List sx={{ 
                        minWidth: '28%',
                        minHeight: '60vh',
                        boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)'}}>
                        <Box>
                            <ListItem button style={icon} key={999} onClick={handleClickOpenAdd} >
                                <ListItemIcon >
                                    <AddIcon style={{fontSize: '50px' }}/>
                                </ListItemIcon>
                            </ListItem>
                            <Dialog
                                open={openAdd}
                                onClose={handleCloseAdd}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                >
                                <DialogTitle id="alert-dialog-title">{"Ajout véhicules"}</DialogTitle>
                                { <FormCars /> }
                                <DialogActions>
                                <Button onClick={handleCloseAdd} color="primary">
                                    Retour
                                </Button>
                                </DialogActions>
                            </Dialog>
                        </Box>
                    </List>
                </Box>
            )}
        </>
        </div>
    );

}



