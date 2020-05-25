import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Nav from './Nav';
import { Layout, Button, Divider } from 'antd';
import { connect } from 'react-redux';
import { readUser } from '../Redux/Reducers/UserReducer';
import { joinRoom } from '../Redux/Actions/UserActions';
import '../css/home.css';
import io from 'socket.io-client';
import { Redirect } from 'react-router-dom';

const ENDPOINT = 'http://localhost:3000';
const { Content } = Layout;

let socket;

const Home = ({ user, joinRoom }) => {
    const [rooms, setRooms] = useState([]);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('requestRooms', {});
        socket.on('rooms', ({ rooms }) => {
            console.log(rooms);
            setRooms(rooms);
        });

        return () => socket.disconnect();
    }, [ENDPOINT]);

    const handleJoinRoom = (room) => {
        joinRoom(room);
        setRedirect(true);
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
                        {rooms ? rooms.map(({ name, players, max }) => (
                            <div className="card-room" key={name}>
                                <div className="title">{name}</div>
                                <div className="players">{players}/{max}</div>
                                <Button 
                                    type="primary" 
                                    disabled={max === players} 
                                    onClick={() => handleJoinRoom(name)}
                                >
                                    Entrar
                                </Button>
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
