import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import CreateIcon from '@mui/icons-material/Create';
import { Autocomplete, Avatar, FormControl, IconButton, Input, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { isTemplateSpan } from "typescript";
import { ThemeProvider } from "@emotion/react";
import { CompactPicker } from 'react-color';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { PhotoCamera } from "@mui/icons-material";
const instance = axios.create({
    baseURL: 'http://localhost:3001/api/',
});

export default function FormUpdateVehicule({ cars }) {
    const { handleSubmit, formState: { errors }, register, setValue, getValues, watch } = useForm({ defaultValues: cars });
    const [marks, setMarks] = useState();
    const [models, setModels] = useState();
    const [mark, setMark] = useState(getValues("mark"));
    const [model, setModel] = useState(getValues("model"));
    const [numberplate, setNumberplate] = useState(getValues("lisence_plate"));
    const [color, setColor] = useState({ hex: getValues("color_code") });
    const [seats, setSeats] = useState(getValues("available_seats"));
    const [selectedFile, setSelectedFile] = useState(null);

    


    const onSubmit = async (data) => {
        console.log(data);
    }

    const handleFileSelect = event => {
        console.log(event.target.files)
        setSelectedFile(event.target.files);
    };

    const handleUpload = () => {
        console.log('select', selectedFile);
        const formData = new FormData();
        formData.append('image', selectedFile);
        // const formData = new FormData();
        // formData.append('image', selectedFile);
        console.log('data', formData);
    };

    const divStyle = {
        width: '100%',
        height: '88vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    useEffect(() => {
        (async () => {
            await getDataMarks();
        })();
        setValue('available_seats', 1);
    }, []);

    const getDataMarks = async () => {
        await instance.get('get/marks')
            .then(async (response) => {
                setMarks(response.data.map(elem => elem.mark));
            }).catch((err) => {
                console.error(err);
            });
    }

    const getDataModels = async (value) => {
        await instance.post('get/models', { mark: value }, { headers: { "content-type": "application/json" } })
            .then(async (response) => {
                setModels(response.data.map(elem => elem.model));
            }).catch((err) => {
                console.error(err);
            });

    }

    const { ref: markRef, ...markProps } = register("mark", {
        required: true,
    });
    const { ref: modelRef, ...modelProps } = register("model", {
        required: true,
    });
    const { ref: numberplateRef, ...numberplateProps } = register("lisence_plate", {
        required: true,
        pattern: /^[A-Z]{2}[-][0-9]{3}[-][A-Z]{2}$/
    });
    const { ref: colorRef, ...colorProps } = register("color_code", {
        required: true,
    });
    const { ref: nameRef, ...nameProps } = register("name", {
        required: true,
    });1
    const { ref: avaiblesseatsRef, ...avaiblesseatsProps } = register("available_seats", {
        required: true,
    });

    console.log("mavalue "+getValues("available_seats"))

    function handleInputChange(event, value) {
        setModels(null);
        console.log('value', value);
        getDataModels(value);

    }

    const handleNumberPlateChange = (event) => {
        let inputValue = event.target.value;
        inputValue = inputValue.toUpperCase();
        inputValue = inputValue.slice(0, 9);

        if (inputValue.length > 2 && inputValue[2] !== "-") {
            inputValue = inputValue.slice(0, 2) + "-" + inputValue.slice(2);
        }
        if (inputValue.length > 6 && inputValue[6] !== "-") {
            inputValue = inputValue.slice(0, 6) + "-" + inputValue.slice(5);
        }

        setNumberplate(inputValue);
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
                    '& .MuiTextField-root': { m: 1, width: '42ch' },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: '28%',
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
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {!!marks &&
                        <Autocomplete
                            value={mark}
                            disablePortal
                            id="combo-box-demo"
                            options={marks}
                            sx={{ width: 300 }}
                            onInputChange={handleInputChange}
                            
                            renderInput={(params) => <TextField
                                {...params}
                                label="Marque"
                                inputRef={markRef}
                                {...markProps}
                                onChange={(e) => console.log(e.target)}
                            />
                            }
                        />
                    } 
                    {!!models &&
                        <Autocomplete
                            value={model}
                            disablePortal
                            id="combo-box-demo"
                            options={models}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField
                                {...params}
                                label="Model"
                                inputRef={modelRef}
                                {...modelProps}
                            />}
                        />
                    }
                    <TextField
                        label="Plaque d'immatriculation"
                        name="numberplate"
                        size="medium"
                        placeholder="AA-000-AA"
                        value={numberplate}
                        inputRef={numberplateRef}
                        {...numberplateProps}
                        error={!!errors.numberplate}
                        helperText={errors.numberplate && "Plaque d'immatriculation invalide"}
                        onChange={handleNumberPlateChange}
                    />
                    <Box sx={{ marginBottom: '10px' }}>
                        <InputLabel id="color-picker">Couleurs :</InputLabel>
                        <CompactPicker
                            id="color-picker"
                            color={color}
                            inputRef={colorRef}
                            {...colorProps}
                            onChangeComplete={(color) => {
                                setColor(color);
                                console.log(color);
                                setValue('color', color.hex);
                            }} />
                            
                    </ Box>
                    <FormControl fullWidth>
                        <InputLabel id="available-seats">Place disponible</InputLabel>
                        <Select
                            labelId="available-seats"
                            name="seats"
                            inputRef={avaiblesseatsRef}
                            {...avaiblesseatsProps}
                            value={seats}
                            label="Place disponible"
                            onChange={handleChange}
                        >
                            <MenuItem value={1}>Une</MenuItem>
                            <MenuItem value={2}>Deux</MenuItem>
                            <MenuItem value={3}>Trois</MenuItem>
                            <MenuItem value={4}>Quatre</MenuItem>
                            <MenuItem value={5}>Cinq</MenuItem>
                            <MenuItem value={6}>Six</MenuItem>
                        </Select>
                    </ FormControl>
                    <InputLabel htmlFor="image-upload">Télécharger une image</InputLabel>
                    <IconButton color="primary" aria-label="upload picture" component="label">
                        <input hidden accept="image/*" type="file" onChange={handleFileSelect} />
                        <PhotoCamera />
                    </IconButton>
                    <Button variant="contained" color="primary" onClick={handleUpload} />
                    <Box id="my-container"></Box>
                    <Button variant="contained" sx={{ width: '26%' }} type="submit">Enregistrer</Button>
                </Box>
            </Box>
        </div >
    );

}



