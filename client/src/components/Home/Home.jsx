import React, { useEffect, useState } from 'react';
import Footer from '../Footer/Footer';
import Nav from '../Nav/Nav';
import Rooms from '../Rooms/Rooms';
import Chat from '../Chat/Chat';
import { Layout, Spin, Input, Button, Form, notification } from 'antd';
import { connect } from 'react-redux';
import { readUser } from '../../reducers/userReducer';
import { readLoadingRoom, readRooms } from '../../reducers/gameReducer';
import { joinRoom } from '../../actions/userActions';
import { resetMessages, createPrivateRoom, addMessage, setRooms, verifyPrivateRoom } from '../../actions/gameActions';
import { useHistory } from 'react-router-dom';
import './home.scss';
import io from 'socket.io-client';
import Drawer from 'react-drag-drawer';

const { Content } = Layout;

let socket;

const Home = ({
    user,
    resetMessages,
    joinRoom,
    verifyPrivateRoom,
    createPrivateRoom,
    loadingRoom,
    addMessage,
    setRooms,
}) => {
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);
    const [btnLoad, setBtnLoad] = useState(false);

    useEffect(() => {
        resetMessages();

        socket = io.connect();
        socket.emit('joinGlobalChat', { user });
    }, []);

    useEffect(() => {
        socket.on('globalChat', (msg) => {
            console.log('adding message', msg);
            addMessage(msg);
        });

        socket.on('rooms', ({ rooms }) => {
            console.log(rooms);
            rooms.forEach((room) => {
                for (let i = room.users.length; i < room.max; i++) {
                    room.users[i] = null;
                }
            });
            console.log(rooms);
            setRooms(rooms);
        });
        
        return () => {
            console.log('home unmounting...')
            socket.disconnect();
        }
    }, []);

    const handleSendMessage = (msg) => {
        console.log(msg);
        socket.emit('sendMessageToAll', { user, msg });
    };

    const handleJoinRoom = (roomName) => {
        joinRoom(roomName);
        resetMessages();
        history.push('/game');
    };

    const handleCreateRoom = () => {
        createPrivateRoom(user, (id) => {
            history.push(`/privateRoom/${id}`);
        });
    };

    const handleJoinPrivateRoom = async ({ roomName }) => {
        if (!roomName) return;
        setBtnLoad(true);
        verifyPrivateRoom(
            roomName,
            (message) => {
                setBtnLoad(false)
                notification.success({ message });
                history.push(`/privateRoom/${roomName}`);
            },
            (message) => {
                setBtnLoad(false)
                notification.error({ message });
            }
        );
    };

    return (
        <Layout className="layout">
            <Nav />
            <Content className="content">
                {loadingRoom ? (
                    <Spin />
                ) : (
                    <div className="main-home">
                        <Rooms
                            joinRoom={handleJoinRoom}
                            joinPrivateRoom={() => setShowModal(true)}
                            createPrivateRoom={handleCreateRoom}
                        />
                        <Chat sendMessage={handleSendMessage} placeholderMessage="Escribe aquí..." />
                        <Drawer open={showModal} onRequestClose={() => setShowModal(false)}>
                            <div className="wrapQuestion">
                                <Form onFinish={handleJoinPrivateRoom} layout="vertical">
                                    <Form.Item name="roomName" label="Introduce el código de la sala:">
                                        <Input style={{ width: '200px' }}></Input>
                                    </Form.Item>
                                    <div className="center">
                                        <Button loading={btnLoad} className="btnJoin" htmlType="submit" type="primary">
                                            Entrar
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </Drawer>
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
        rooms: readRooms(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        resetMessages: () => dispatch(resetMessages()),
        joinRoom: (roomName) => dispatch(joinRoom(roomName)),
        createPrivateRoom: (user, callback) => dispatch(createPrivateRoom(user, callback)),
        addMessage: (msg) => dispatch(addMessage(msg)),
        setRooms: (rooms) => dispatch(setRooms(rooms)),
        verifyPrivateRoom: (roomName, success, error) => dispatch(verifyPrivateRoom(roomName, success, error)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
