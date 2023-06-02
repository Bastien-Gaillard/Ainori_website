import { PhotoCamera } from "@mui/icons-material";
import { Box, Button, IconButton, InputLabel } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import Snackbar from '../features/Snackbar'
const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

const PopUpAvatar = ({ image, onChange, onClick }) => {

    const [displayImage, setDisplayImage] = useState(false);
    const [selectedFile, setSelectedFile] = useState();
    const [displayError, setDisplayError] = useState(false);
    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
        handleUpload(event.target.files[0]);
        setDisplayImage(true);
    };

    const handleUpload = async (selectedFile) => {
        const formData = new FormData();
        formData.append("image", selectedFile);
        await axios.post("image/upload/users", formData, { headers: { "Content-Type": "multipart/form-data" } })
            .then(async (response) => {
                setSelectedFile(response.data);
                setDisplayImage(true);
            }).catch((err) => {
                console.error(err);
                return false;
            });
    };

    const handleSubmit = async () => {
        if (selectedFile) {
            const data = { path: 'images/avatars/', image: selectedFile }
            const image = await instance.post("image/create", data, { headers: { "content-type": "application/json" } })
                .then(async (response) => {
                    const result = await instance.put("user/update/avatar", { image_id: response.data.id }, { headers: { "content-type": "application/json" } })
                        .then(async (response) => {
                            console.log("")
                        }).catch((err) => {
                            console.error(err);
                        });
                    handleImageChange('images/avatars/' + selectedFile);
                }).catch((err) => {
                    console.error(err);
                });
        } else {
            setDisplayError(true);
        }
    }

    const handleImageChange = (newImage) => {
        onChange(newImage);
        onClick(false);
    };

    const handleClose = () => {
        setDisplayError(false);
    }
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <InputLabel htmlFor="image-upload" sx={{ marginTop: '16px' }}>Télécharger une image</InputLabel>
            <IconButton color="primary" aria-label="upload picture" component="label">
                <input hidden accept="image/*" type="file" onChange={handleFileSelect} />
                <PhotoCamera />
            </IconButton>
            {displayImage &&
                <img width={'128px'} height={'auto'}
                    alt={"L'image n'a pas chargée"} src={'images/avatars/' + selectedFile} />
            }
            <Button variant="contained" sx={{ width: 'auto', marginTop: '2vh' }} onClick={handleSubmit}>Enregistrer</Button>
            <Snackbar severity='error' message={'Veuillez selectionner une image'} open={displayError} handleClose={handleClose} />
        </Box>
    )
}

export default PopUpAvatar;