import { Visibility, VisibilityOff } from "@mui/icons-material";
import { TextField, Button, Link, Box, InputAdornment, IconButton, AlertColor } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Snackbar from "../features/Snackbar";
import Alert from "../features/Alert"
const instance = axios.create({
    baseURL: 'http://localhost:3001/api/',
});

export default function FormForgot() {
    const { handleSubmit, formState: { errors }, register } = useForm();
    const [open, setOpen] = useState<boolean>(false);
    const [notSame, setNotSame] = useState<boolean>(false);
    const [message, setMessage] = useState("Votre lien a expiré, vous allez être redirigé");
    const [severity, setSeverity] = useState<AlertColor>("error");
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    let navigate = useNavigate();

    const onSubmit = async (data) => {
        if (data.password1 === data.password2) {
            setNotSame(false);
            await instance.post('forgot/update', data, { headers: { "content-type": "application/json" } })
                .then((response) => {
                    if (response.data) {
                        setOpen(true);
                        setMessage("Mot de passe changé, vous allez être redirigé");
                        setSeverity("success");
                        setTimeout(() => {
                            navigate('/');
                        }, 5000);
                    }
                }).catch((err) => {
                    console.error(err);
                });
        } else {
            setNotSame(true);
        }
    }

    const handleClose = () => {
        setNotSame(false);
    };

    return (
        <>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                <TextField
                    type={showPassword1 ? "text" : "password"}
                    name="password1"
                    margin="normal"
                    fullWidth
                    label="Mot de passe"
                    error={!!errors.password1}
                    helperText={errors.password1 && "Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 charactere spéciale"}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword1(!showPassword1)}
                                >
                                    {showPassword1 ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                        ...register("password1",
                            {
                                required: true,
                                pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
                            })
                    }}
                />
                <TextField
                    type={showPassword2 ? "text" : "password"}
                    name="password2"
                    margin="normal"
                    fullWidth
                    label="Mot de passe"
                    error={!!errors.password2}
                    helperText={errors.password2 && "Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 charactere spéciale"}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword2(!showPassword2)}
                                >
                                    {showPassword2 ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                        ...register("password2",
                            {
                                required: true,
                                pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
                            })
                    }}
                />
                <Alert severity="error" open={notSame} message="Les mots de passe sont différents" handleClose={handleClose} />
                <Button
                    color="secondary"
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Valider
                </Button>


                <Link href="/" variant="body2">
                    Se connecter
                </Link>
            </Box>
            <Snackbar severity={severity} message={message} open={open} handleClose={handleClose} />
        </>
    );
}


