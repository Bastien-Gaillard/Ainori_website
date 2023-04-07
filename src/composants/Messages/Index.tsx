import { Avatar, Box, Button, Divider, Fab, FormControl, Grid, List, ListItem, ListItemIcon, ListItemText, Paper, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from 'react';
import axios from 'axios';
import * as moment from 'moment';

import * as io from "socket.io-client";
const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: '100%',
        height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    }
});

const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});
const Messages = ({ socket }) => {
    const classes = useStyles();

    const [conversations, setConversations] = useState([]);
    const [conversation, setConversation] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [receivedUserId, setReceivedUserId] = useState();
    const [sender, setSender] = useState();
    useEffect(() => {
        instance.get('views/conversations')
            .then(async (response) => {
                console.log(response.data);
                setConversations(response.data);
            }).catch((err) => {
                console.log("err " + err);
                console.error(err);
            });
        instance.get('user/current/id')
            .then(async (response) => {
                console.log(response.data);
                setSender(response.data.id);
            }).catch((err) => {
                console.log("err " + err);
                console.error(err);
            });
    }, []);

    useEffect(() => {
        if (!!receivedUserId && message != '') {
            instance.post('views/conversation', { user_id: receivedUserId }, { headers: { "content-type": "application/json" } })
                .then(async (response) => {
                    console.log(response.data);
                    setConversation(
                        response.data
                    );
                }).catch((err) => {
                    console.log("err " + err);
                    console.error(err);
                });
        }
    }, [])
    const getConversation = (userId) => {
        setReceivedUserId(userId);
        instance.post('views/conversation', { user_id: userId }, { headers: { "content-type": "application/json" } })
            .then(async (response) => {
                console.log(response.data);
                setConversation(
                    response.data
                );
            }).catch((err) => {
                console.log("err " + err);
                console.error(err);
            });
    }

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    }

    useEffect(() => {
        socket.on('messageResponse', (data) => {
            data.sended_at = new Date();
            data.position = 'left';
            setMessages([...messages, data]);
            console.log('socket', data, receivedUserId);

        });
    }, [socket, messages]);

    const handleSendMessage = (e) => {
        console.log('test')
        e.preventDefault();
        if (message.trim()) {
            socket.emit('message', {
                text: message,
                name: localStorage.getItem('userName'),
                received: receivedUserId,
                id: `${socket.id}${Math.random()}`,
                socketID: socket.id,
            });
        }
        instance.post('messages/create', { content: message, received_by_user_id: receivedUserId }, { headers: { "content-type": "application/json" } });
        setMessage('');
    };
    return (
        <div>
            <Grid container component={Paper} className={classes.chatSection}>
                <Grid item xs={3} className={classes.borderRight500}>
                    <Divider />
                    <Grid item xs={12} style={{ padding: '10px' }}>
                        <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth onChange={(e) => { console.log(e.target.value); setMessage(e.target.value) }} />
                    </Grid>
                    <Divider />
                    <List>
                        {!!conversations &&
                            conversations.map((value) => (

                                <ListItem button key={value.user_id} onClick={() => {console.log('user', value); getConversation(value.user_id)}}>
                                    <ListItemIcon>
                                        <Avatar alt={value.name} src="https://material-ui.com/static/images/avatar/1.jpg" />
                                    </ListItemIcon>
                                    <ListItemText primary={value.name}>{value.name}</ListItemText>
                                </ListItem>
                            ))
                        }
                    </List>
                </Grid>
                <Grid item xs={9}>
                    <List className={classes.messageArea}>
                        {!!conversation &&
                            conversation.map((message) => (
                                <ListItem key={message.sended_at} sx={{ backgroundColor: message.position == "left" ? 'rgb(255, 193, 7, 0.05)' : 'rgb(0, 188, 212, 0.05)' }}>
                                    <Grid container>
                                        <p style={{ textAlign: message.position, fontStyle: 'italic', fontSize: 'small' }} >{message.name}</p>
                                        <Grid item xs={12}>
                                            <ListItemText style={{ textAlign: message.position }} primary={message.content}></ListItemText>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <ListItemText style={{ textAlign: message.position }} secondary={moment(message.sended_at).locale('fr').format('LT')}></ListItemText>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            ))
                        }
                        {messages.map((message) =>
                            // message.received === receivedUserId &&
                                message.name === localStorage.getItem('userName') ? (
                                <ListItem key={'zdsqqdssqd'} sx={{ backgroundColor: 'rgb(0, 188, 212, 0.05)' }}>
                                    <Grid container>
                                        <p style={{ textAlign: 'right', fontStyle: 'italic', fontSize: 'small' }} >Vous</p>
                                        <Grid item xs={12}>
                                            <ListItemText style={{ textAlign: 'right' }} primary={message.text}></ListItemText>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <ListItemText style={{ textAlign: 'right' }} secondary={moment(message.sended_at).locale('fr').format('LT')}></ListItemText>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            ) : (
                                // message.received === receivedUserId &&
                                <ListItem key={'zdsqqdssqd'} sx={{ backgroundColor: 'rgb(255, 193, 7, 0.05)' }}>
                                    <Grid container>
                                        <p style={{ textAlign: 'left', fontStyle: 'italic', fontSize: 'small' }} >{message.name}</p>
                                        <Grid item xs={12}>
                                            <ListItemText style={{ textAlign: 'left' }} primary={message.text}></ListItemText>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <ListItemText style={{ textAlign: 'left' }} secondary={moment(message.sended_at).locale('fr').format('LT')}></ListItemText>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            )
                        )}
                    </List>
                    <Divider />
                    <Grid container style={{ padding: '20px' }}>
                        <Grid item xs={11}>
                            <Box component="form" onSubmit={handleSendMessage}>
                                <TextField
                                    id="outlined-basic-email"
                                    label="Type Something"
                                    fullWidth
                                    variant="outlined"
                                    value={message}
                                    onChange={handleMessageChange}
                                />
                                <Button type='submit'><SendIcon /></Button>
                            </Box>

                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default Messages;