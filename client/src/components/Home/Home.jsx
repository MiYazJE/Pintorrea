import React, { useState, useEffect } from 'react';
import Footer from '../Footer/Footer';
import Nav from '../Nav/Nav';
import Rooms from '../Rooms/Rooms';
import Chat from '../Chat/Chat';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { readUser } from '../../Redux/Reducers/UserReducer';
import { readMessages } from '../../Redux/Reducers/gameReducer';
import { addMessage, resetMessages } from '../../Redux/Actions/gameActions';
import io from 'socket.io-client';
import { useHistory } from 'react-router-dom';
import './home.scss';

const ENDPOINT = '/socket-io';
const { Content } = Layout;

let socket;

const Home = ({ user, messages, resetMessages, addMessage }) => {

    const history = useHistory();
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        resetMessages();
        addMessage({ admin: true, mag: 'fregrtgrt' })

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
            console.log('adding message', msg);
            addMessage(msg);
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
                <div className="main-home">
                    <Rooms 
                        rooms={rooms} 
                        setRedirect={() => history.push('/game')} 
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
    return { 
        user    : readUser(state),
        messages: readMessages(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addMessage   : (message) => dispatch(addMessage(message)),
        resetMessages: ()        => dispatch(resetMessages())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
