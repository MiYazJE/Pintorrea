import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Nav from './Nav';
import { Layout, Button, Divider } from 'antd';
import { connect } from 'react-redux';
import { readUser } from '../Redux/Reducers/UserReducer';
import '../css/home.css';
import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:3000';
const { Content } = Layout;

let socket;

const Home = ({ user }) => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('requestRooms', {});
        socket.on('rooms', ({ rooms }) => {
            console.log(rooms)
            setRooms(rooms);
        });
    }, [ENDPOINT]);

    const handleJoinRoom = (e) => {
        console.log(e);
    }

    return (
        <Layout className="layout">
            <Nav />
            <Content className="content">
                <div className="main-home">
                    <h1 className="title-rooms">Rooms</h1>
                    <Divider />
                    <div className="wrap-rooms">
                        {rooms ? rooms.map(({ name, players, max }) => (
                            <div className="card-room" key={name}>
                                <div className="title">{name}</div>
                                <div className="players">{players}/{max}</div>
                                <Button type="primary" onClick={() => handleJoinRoom(name)}>
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

export default connect(mapStateToProps, {})(Home);
