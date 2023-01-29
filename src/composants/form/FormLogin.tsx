import { Visibility, VisibilityOff } from "@mui/icons-material";
import { TextField, InputAdornment, IconButton, Button, Box, Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
const instance = axios.create({
    baseURL: 'http://localhost:3001/api/',
});
interface JSXElement extends React.ReactElement<any> { }
type Element = JSXElement | null;

export default function FormLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const { handleSubmit, control, formState: { errors }, register } = useForm();
    const [info, setInfo] = useState<Element>();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        // Check if value of email and password exist in database
        const user = await instance.post('login', data, { headers: { "content-type": "application/json" } })
            .then((response) => {
                if (response.data == "ok") {
                    navigate('/home');
                } else if(response.data == "null"){
                    setInfo(<Alert severity="error">Identifiant ou mot de passe invalide</Alert>);
                } else if(response.data == "disable"){
                    setInfo(<Alert severity="error">Le compte est désactivé</Alert>);
                }
            }).catch((err) => {
                console.error(err);
            });
    }
    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <TextField
                type="text"
                name="email"
                margin="normal"
                fullWidth
                label="Adresse mail"
                error={!!errors.email}
                helperText={errors.email && "L'adresse mail est invalide"}
                InputProps={{
                    ...register("email",
                        {
                            required: true,
                            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
                        })
                }}
            />
            <TextField
                type={showPassword ? "text" : "password"}
                name="password"
                margin="normal"
                fullWidth
                label="Mot de passe"
                error={!!errors.password}
                helperText={errors.password && "Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 charactere spéciale"}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ),
                    ...register("password",
                        {
                            required: true,
                            // pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
                        })
                }}
            />
            {info}
            <Button
                color="secondary"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Connexion
            </Button>


        </Box>
    );
}