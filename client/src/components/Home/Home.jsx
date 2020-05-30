import React, { useState, useEffect } from 'react';
import Footer from '../Footer/Footer';
import Nav from '../Nav/Nav';
import Rooms from '../Rooms/Rooms';
import Chat from '../Chat/Chat';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { readUser } from '../../Redux/Reducers/UserReducer';
import io from 'socket.io-client';
import { Redirect } from 'react-router-dom';
import './home.scss';

const ENDPOINT = '/socket-io';
const { Content } = Layout;

let socket;

const Home = ({ user }) => {
    const [messages, setMessages] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        socket = io();
        socket.emit('joinGlobalChat', { user });

        socket.on('rooms', ({ rooms }) => {
            rooms.forEach(room => {
                for (let i = room.users.length; i < room.max; i++) {
                    room.users[i] = null;
                }
            })
            console.log(rooms);
            setRooms(rooms);
        });

        socket.on('globalChat', (msg) => {
            setMessages(messages => [...messages, msg]);
        });

        return () => socket.disconnect();
    }, []);

    const handleSendMessage = (msg) => {
        socket.emit('sendMessageToAll', { user, msg });
    }

    return (
        <Layout className="layout">
            <Nav />
            <Content className="content">
                {redirect ? <Redirect to="/game" /> : null}
                <div className="main-home">
                    <Rooms 
                        rooms={rooms} 
                        setRedirect={setRedirect} 
                    />
                    <Chat 
                        messages={messages} 
                        sendMessage={handleSendMessage} 
                        placeholderMessage="Escribe aquí..." 
                    />
                </div>
            </Content>
            <Footer />
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return { user: readUser(state) };
}

export default connect(mapStateToProps, { })(Home);
