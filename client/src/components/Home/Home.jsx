import React, { useState, useEffect, useContext } from 'react';
import Footer from '../Footer/Footer';
import Nav from '../Nav/Nav';
import Rooms from '../Rooms/Rooms';
import Chat from '../Chat/Chat';
import { Layout, Spin } from 'antd';
import { connect } from 'react-redux';
import { readUser } from '../../Redux/Reducers/UserReducer';
import { readLoadingRoom, readSocket } from '../../Redux/Reducers/gameReducer';
import { joinRoom } from '../../Redux/Actions/UserActions';
import { resetMessages, joinPrivateRoom, addMessage, setRooms } from '../../Redux/Actions/gameActions';
import { useHistory } from 'react-router-dom';
import './home.scss';

const { Content } = Layout;

const Home = ({ user, messages, resetMessages, joinRoom, joinPrivateRoom, loadingRoom, socket, addMessage, setRooms }) => {
    const history = useHistory();

    useEffect(() => {
        resetMessages();
        socket.emit('joinGlobalChat', { user });

        socket.on('globalChat', (msg) => {
            console.log('adding message', msg);
            addMessage(msg);
        });

        socket.on('rooms', ({ rooms }) => {
            rooms.forEach((room) => {
                for (let i = room.users.length; i < room.max; i++) {
                    room.users[i] = null;
                }
            });
            console.log(rooms);
            setRooms(rooms);
        });
        return () => socket.disconnect();
    }, []);

    const handleSendMessage = (msg) => {
        console.log(msg)
        socket.emit('sendMessageToAll', { user, msg });
    };

    const handleJoinRoom = (roomName) => {
        joinRoom(roomName);
        resetMessages();
        history.push('/game');
    };

    const createPreRoom = () => {
        joinPrivateRoom(user, () => {
            resetMessages();
            history.push('/privateRoom');
        });
    };

    return (
        <Layout className="layout">
            <Nav />
            <Content className="content">
                {loadingRoom ? (
                    <Spin />
                ) : (
                    <div className="main-home">
                        <Rooms joinRoom={handleJoinRoom} createPreRoom={createPreRoom} />
                        <Chat
                            sendMessage={handleSendMessage}
                            placeholderMessage="Escribe aquí..."
                        />
                    </div>
                )}
            </Content>
            <Footer />
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        user: readUser(state),
        loadingRoom: readLoadingRoom(state),
        socket: readSocket(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        resetMessages: () => dispatch(resetMessages()),
        joinRoom: (roomName) => dispatch(joinRoom(roomName)),
        joinPrivateRoom: (user, callback) => dispatch(joinPrivateRoom(user, callback)),
        addMessage: (msg) => dispatch(addMessage(msg)),
        setRooms: (rooms) => dispatch(setRooms(rooms)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
