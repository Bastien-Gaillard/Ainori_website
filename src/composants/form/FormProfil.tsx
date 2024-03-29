import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import CreateIcon from '@mui/icons-material/Create';
import { Avatar, Badge, BadgeProps, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, styled } from "@mui/material";
import { isTemplateSpan } from "typescript";
import { ThemeProvider } from "@emotion/react";
import AddIcon from '@mui/icons-material/Add';
import PopUpAvatar from "../Profil/PopUpAvatar";
const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

type UserModel = {
    firstname: string,
    lastname: string,
    email: string,
    description?: string
}
export default function FormProfil({ user, updateUser, updateImage }) {
    const [modify, setModify] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState(user.image?.path);
    const { handleSubmit, formState: { errors }, register, setValue, getValues } = useForm({ defaultValues: user });

    useEffect(() => {
        updateImage(image);
    }, image)

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const changeModify = () => {
        if (modify) {
            setModify(false)
        } else {
            setModify(true)
        }
    }

    const onSubmit = async (data) => {
        data.id = user.id;
        await instance.put('user/update', data, { headers: { "content-type": "application/json" } })
            .then(async (response) => {
                updateUser(response.data);
                setModify(false);
            }).catch((err) => {
                console.error(err);
            });
    }

    const { ref: firstnameRef, ...firstnameProps } = register("firstname",
        {
            required: modify,
            disabled: !modify
        });
    const { ref: lastnameRef, ...lastnameProps } = register("lastname",
        {
            required: modify,
            disabled: !modify
        });
    const { ref: emailRef, ...emailProps } = register("email",
        {
            required: modify,
            disabled: !modify,
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/

        });
    const { ref: descriptionRef, ...descriptionProps } = register("description",
        {
            required: modify,
            disabled: !modify
        });

    const divStyle = {
        width: '100%',
        height: '88vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    return (
        <div style={divStyle}>
            {Object.keys(user).length > 0 &&
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '42ch' },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '42vw',
                        height: '60vh',
                        boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
                        minWidth: '360px',
                        minHeight: '600px'
                    }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Box sx={{ display: 'flex' }}>
                        <h2>Mes informations</h2>
                        <CreateIcon onClick={changeModify} sx={
                            {
                                marginLeft: '8px',
                                '&:hover':
                                {
                                    color: '#FFC107',
                                    cursor: 'pointer'
                                }
                            }} />


                    </Box>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            <IconButton onClick={handleClickOpen}><AddIcon sx={{ backgroundColor: '#00bcd4', borderRadius: '50%' }} /></IconButton >
                        }
                    >
                        <Avatar alt={user.firstname} src={image} />
                    </Badge>
                    <TextField
                        label="Prénom"
                        name="firstname"
                        size="small"
                        inputRef={firstnameRef}
                        {...firstnameProps}
                    />
                    <TextField
                        label="Nom"
                        name="lastname"
                        size="medium"
                        inputRef={lastnameRef}
                        {...lastnameProps}
                    />
                    <TextField
                        label="Adresse mail"
                        name="email"
                        error={!!errors.email}
                        helperText={errors.email && "L'adresse mail est invalide"}
                        inputRef={emailRef}
                        {...emailProps}
                    />
                    <TextField
                        label="Description"
                        name="description"
                        multiline
                        minRows={4}
                        inputRef={descriptionRef}
                        {...descriptionProps}
                    />
                    <Dialog onClose={handleClose} open={open}>
                        <DialogTitle>Changer de photo</DialogTitle>
                        <DialogContent>
                            <PopUpAvatar image={user.image?.path} onChange={setImage} onClick={handleClose}/>
                        </DialogContent>
                    </Dialog>
                    <Button variant="contained" sx={{ width: '26%' }} type="submit">Enregistrer</Button>
                </Box>
            }
        </div >
    );
}



