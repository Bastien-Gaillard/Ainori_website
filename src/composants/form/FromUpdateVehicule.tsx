import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import { Autocomplete, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { CompactPicker } from 'react-color';
import { PhotoCamera } from "@mui/icons-material";
import { getValue } from "@mui/system";
import Alert from "@composants/features/Alert";
const cryptoJs = require('crypto-js');

const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

export default function FormCars(props) {

    console.log(props.cars);

    const { handleSubmit, formState: { errors }, register, setValue, getValues } = useForm();
    const [name, setName] = useState(props.cars.name);
    const [licencePlate, setLicencePlate] = useState(props.cars.lisence_plate);
    const [color, setColor] = useState({ hex: props.cars.color });
    const [seats, setSeats] = useState(props.cars.available_seats.toString());
    const [selectedFile, setSelectedFile] = useState(!!props?.cars?.images?.path ? props.cars.images.path : null);
    const [open, setOpen] = useState(false);
    const [displayImage, setDisplayImage] = useState(false);


    useEffect(() => {
        if (!!props?.cars?.images?.path) {
            setDisplayImage(true);
        }
    }, []);

    const handleClick = () => {
        props.handleCloseForm(); // Call the handleCloseAdd function here
    }

    const onSubmit = async (data) => {

        if (data.image) {
            data.path = 'images/vehicles/';
            const image = await instance.post("image/create", data, { headers: { "content-type": "application/json" } })
                .then(async (response) => {
                    data.images = response.data;
                }).catch((err) => {
                    console.error(err);
                });
        }
        data.id = props.cars.id;
        const result = await instance.put("vehicles/update", data, { headers: { "content-type": "application/json" } })
            .then(async (response) => {
                console.log(response)
            }).catch((err) => {
                console.error(err);
            });
        handleClick();
    }

    const handleFileSelect = (event) => {
        props.cars.images.path = null
        setSelectedFile(event.target.files[0]);
        handleUpload(event.target.files[0]);
        setDisplayImage(true);
    };

    const handleUpload = async (selectedFile) => {
        const formData = new FormData();
        formData.append("image", selectedFile);
        await axios.post("upload", formData, { headers: { "Content-Type": "multipart/form-data" } })
            .then(async (response) => {
                setValue('image', response.data);
                setSelectedFile(response.data);
                setDisplayImage(true);
            }).catch((err) => {
                console.error(err);
                return false;
            });
    };

    const divStyle = {
        width: '100%',
        height: '72vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const { ref: lisencePlateRef, ...lisencePlateProps } = register("lisence_plate", {
        required: true,
        pattern: /^[A-Z]{2}[-][0-9]{3}[-][A-Z]{2}$/
    });
    const { ref: nameRef, ...nameProps } = register("name", {
        required: false,
    });

    const handleNumberPlateChange = (event) => {
        let inputValue = event.target.value;
        inputValue = inputValue.toUpperCase();
        inputValue = inputValue.slice(0, 9);

        if (inputValue.length > 2 && inputValue[2] !== "-") {
            inputValue = inputValue.slice(0, 2) + "-" + inputValue.slice(2);
        }
        if (inputValue.length > 6 && inputValue[6] !== "-") {
            inputValue = inputValue.slice(0, 6) + "-" + inputValue.slice(6);
        }

        setLicencePlate(inputValue);
    };

    const handleChange = (event: SelectChangeEvent) => {
        setSeats(parseInt(event.target.value));
        setValue('available_seats', parseInt(event.target.value));
    };

    return (
        <div style={divStyle}>
            <Box
                component="form"
                sx={{
                    width: '100%',
                    '& .MuiTextField-root': { m: 1, width: '42ch' },
                    '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': { width: '100%' },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                    boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)'
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Box sx={{ display: 'flex' }}>
                    <h2>Modifier un véhicule</h2>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '16px', marginBottom: '16px', marginLeft: '256px', marginRight: '256px', alignItems: 'center' }}>
                    <TextField
                        label="Nom"
                        name="name"
                        size="medium"
                        value={name}
                        inputRef={nameRef}
                        {...nameProps}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Plaque d'immatriculation"
                        name="lisence_plate"
                        size="medium"
                        placeholder="AA-000-AA"
                        sx={{ marginTop: '16px' }}
                        value={licencePlate}
                        inputRef={lisencePlateRef}
                        {...lisencePlateProps}
                        error={!!errors.lisence_plate}
                        helperText={errors.lisence_plate && "Plaque d'immatriculation invalide"}
                        onChange={handleNumberPlateChange}
                    />
                    <Box sx={{ marginBottom: '16px', marginTop: '16px' }}>
                        <InputLabel id="color-picker">Couleurs :</InputLabel>
                        <CompactPicker
                            id="color-picker"
                            color={color}
                            onChangeComplete={(color) => {
                                setColor(color);
                                setValue('color', color.hex);
                            }} />
                    </ Box>
                    <FormControl fullWidth sx={{ marginTop: '16px' }}>
                        <InputLabel id="available-seats">Place disponible</InputLabel>
                        <Select
                            labelId="available-seats"
                            name="seats"
                            value={seats.toString()}
                            label="Place disponible"
                            onChange={handleChange}
                        >
                            <MenuItem value={1}>Une</MenuItem>
                            <MenuItem value={2}>Deux</MenuItem>
                            <MenuItem value={3}>Trois</MenuItem>
                            <MenuItem value={4}>Quatre</MenuItem>
                            <MenuItem value={5}>Cinq</MenuItem>
                            <MenuItem value={6}>Six</MenuItem>
                            <MenuItem value={7}>Sept</MenuItem>
                            <MenuItem value={8}>Huit</MenuItem>

                        </Select>
                    </ FormControl>
                    <InputLabel htmlFor="image-upload" sx={{ marginTop: '16px' }}>Télécharger une image</InputLabel>
                    <IconButton color="primary" aria-label="upload picture" component="label">
                        <input hidden accept="image/*" type="file" onChange={handleFileSelect} />
                        <PhotoCamera />
                    </IconButton>
                    {displayImage &&
                        <img width={'128px'} height={'auto'}
                            alt={"L'image n'a pas chargée"} src={!!props?.cars?.images?.path && props?.cars?.images?.path != null ? selectedFile : 'images/vehicles/' + selectedFile} />
                    }
                    <Button variant="contained" sx={{ width: 'auto', marginTop: '2vh' }} type="submit">Enregistrer</Button>
                </Box>
            </Box>
        </div >
    );
}



