// import { useEffect, useState } from "react";
// import axios from "axios";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";

// const instance = axios.create({
//   baseURL: 'http://localhost:3001/api/',
// });

// export default function Profil() {

//   const [modify, setModify] = useState(false);
//   const [user, setUser] = useState();

//   const authConnexion = async () => {

//     const dataUser = await instance.get('user');
//     console.log('user 1', dataUser);
//     setUser(dataUser.data);
//     console.log('user', user);
//     return;
//   }
//   useEffect(() => {
//     authConnexion();
//   }, []);



//   // const handleSubmit = async (event) => {
//   //   console.log('in submit');
//   //   event.preventDefault();
//   //   const data = new FormData(event.currentTarget);
//   //   console.log(data);

//   //   const { data: users } = await axios.get(
//   //     "/api/update/userdata/" +
//   //     2 +
//   //     "/" +
//   //     data.get("FirstName") +
//   //     "/" +
//   //     data.get("LastName") +
//   //     "/" +
//   //     data.get("Mail") +
//   //     "/" +
//   //     data.get("Description")
//   //   );
//   //   setUser(users);
//   //   setModify(false);
//   // }
//   return (
//     <div>
//       <Box
//         component="form"
//         sx={{
//           "& .MuiTextField-root": { m: 1, width: "50ch" }
//         }}
//         noValidate
//         autoComplete="off"
//       // onSubmit={handleSubmit}
//       >
//         <TextField
//           id="FirstName"
//           label="First name"
//           // defaultValue={user.firstname}
//           variant="standard"
//           disabled={!modify}
//         />
//         <TextField
//           id="LastName"
//           label="Last name"
//           // defaultValue={user.lastname}
//           variant="standard"
//           disabled={!modify}
//         />
//         <TextField
//           id="Mail"
//           label="EMail"
//           // defaultValue={user.email}
//           variant="standard"
//           disabled={!modify}
//         />
//         <TextField
//           id="Description"
//           label="Description"
//           // defaultValue={user.description}
//           variant="standard"
//           disabled={!modify}
//         />

//         <Button
//           variant="contained"
//           onClick={() => setModify(!modify)}
//           type='submit'
//         >
//           {modify ? "Enregistrer ses informations" : "Modifier ses informations"}
//         </Button>
//       </Box>
//     </div>
//   );
// }
import axios from 'axios'
import { useEffect, useState } from 'react';
const instance = axios.create({
  baseURL: 'http://localhost:3001/api/',
});
export default function Profil() {

  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState();

  const authConnexion = async () => {

    const dataUser = await instance.get('/user');
    setUser(dataUser.data);
  }
  useEffect(() => {
    authConnexion();
    console.log(user);
  }, []);


  return (
    <h1>Profil</h1>
    // <ThemeProvider theme={theme}>
    //     <Container component="main" maxWidth="xs">
    //         <CssBaseline />
    //         <Box
    //             sx={{
    //                 marginTop: 8,
    //                 display: 'flex',
    //                 flexDirection: 'column',
    //                 alignItems: 'center',
    //             }}
    //         >
    //             <Typography component="h1" variant="h5">
    //                 Mot de passe oublié
    //             </Typography>
    //             <FormForgot />
    //         </Box>
    //     </Container>
    // </ThemeProvider>
  );
}



