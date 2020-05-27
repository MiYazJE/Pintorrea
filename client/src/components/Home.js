import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Nav from './Nav';
import { Layout, Button, Divider, Tooltip, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { readUser } from '../Redux/Reducers/UserReducer';
import { joinRoom } from '../Redux/Actions/UserActions';
import '../css/home.css';
import io from 'socket.io-client';
import { Redirect } from 'react-router-dom';

const ENDPOINT = '/socket-io';
const { Content } = Layout;

let socket;

const Home = ({ user, joinRoom }) => {
    const [rooms, setRooms] = useState([]);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        socket = io();
        socket.emit('requestRooms', {});
        socket.on('rooms', ({ rooms }) => {
            console.log(rooms)
            rooms.forEach(room => {
                for (let i = room.users.length; i < room.max; i++) {
                    room.users[i] = null;
                }
            })
            console.log(rooms);
            setRooms(rooms);
        });

        return () => socket.disconnect();
    }, []);

    const handleJoinRoom = (room) => {
        joinRoom(room);
        setRedirect(true);
    }

    const handleViewProfile = (name, id) => {
        console.log(`opening ${name}'s profile...`);
    }

    const getColorState = (players, max) => {
        if (players === max) return 'red';
        if (players >= parseInt(max / 2)) return 'yellow'
        return 'green';
    }

    return (
        <Layout className="layout">
            <Nav />
            <Content className="content">
                {redirect ? <Redirect to="/game" /> : null}
                <div className="main-home">
                    <h1 className="title-rooms">Salas</h1>
                    <Divider />
                    <div className="wrap-rooms">
                        {rooms ? rooms.map(({ name, players, max, users, started }) => (
                            <div className="card-room" key={name}>
                                <div className="title">{name.toUpperCase()}</div>
                                <div className="players" style={{ color: getColorState(players, max) }}>{players}/{max}</div>
                                <div className="users-profiles">
                                    {users.map((user, index) => (
                                        user ?
                                            <Tooltip key={user.id} placement="top" title={user.name}>
                                                <Avatar 
                                                    style={{cursor: 'pointer'}} 
                                                    src={user.picture} 
                                                    onClick={() => handleViewProfile(user.name, user.id)} 
                                                />
                                            </Tooltip>
                                            : <Avatar key={index} icon={<UserOutlined />} />
                                    ))}
                                </div>
                                <Tooltip placement="right" title={players === max ? "La sala esta llena" : `Entrar a la sala '${name}'`}>
                                    <Button
                                        type="primary"
                                        disabled={max === players}
                                        onClick={() => handleJoinRoom(name)}
                                    >
                                        Entrar
                                    </Button>
                                </Tooltip>
                            </div>
                        )) : (<div>No rooms</div>)}
                    </div>
                </div>
            </Content>
            <Footer />
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return { user: readUser(state) };
};

export default connect(mapStateToProps, { joinRoom })(Home);
