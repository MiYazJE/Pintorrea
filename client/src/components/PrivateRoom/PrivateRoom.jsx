import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { notification, Form, Input, Button, InputNumber, Select, Divider, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { readUser } from '../../reducers/userReducer';
import './privateRoom.scss';
import io from 'socket.io-client';
import { addMessage, resetMessages } from '../../actions/gameActions';
import { readPrivateRoom } from '../../reducers/gameReducer';
import Http from '../../Helpers/Http';
import UsersAvatars from '../UsersAvatars/UsersAvatars';
import { CopyOutlined } from '@ant-design/icons';
import Chat from '../Chat/Chat';

const { Option } = Select;

const initialFormValues = {
    fieldCurrentPlayers: 1,
};

const getOptions = (start, final, increment) => {
    const options = [];
    for (let i = start; i <= final; i += increment) {
        options.push(<Option key={`${i}`}>{i}</Option>);
    }
    return options;
};

let socket;

const PrivateRoom = ({ user, match, addMessage, resetMessages }) => {
    const [roomId, setRoomId] = useState(match.params.id);
    const [url, setUrl] = useState(window.location.href);
    const [room, setRoom] = useState({});
    const [isHost, setIsHost] = useState(true);
    const [currentPlayers, setCurrentPlayers] = useState(0);
    const [maxPlayers, setMaxPlayers] = useState(0);
    const [drawingTime, setDrawingTime] = useState(0);
    const [rounds, setRounds] = useState(0);
    const [players, setPlayers] = useState([]);
    const [optionsTime, setOptionsTime] = useState(getOptions(60, 150, 10));
    const [optionsRounds, setOptionsRounds] = useState(getOptions(3, 10, 1));
    const history = useHistory();
    const refUrl = useRef();
    const refCode = useRef();

    useEffect(() => {
        (async () => {
            const { id } = match.params;
            console.log(id);
            if (!id || !(await isValidRoom(id))) {
                notification.error({ message: 'La sala a la que intentas acceder no es válida!' });
                history.push('/login');
                return;
            }

            resetMessages();
            socket = io();
            console.log(user.name, 'join room');
            socket.emit('joinPrivateRoom', { user, id });

            socket.on('updateSettings', (data) => {
                const { room } = JSON.parse(data);
                setRoom(room);
            });

            socket.on('message', (msg) => {
                addMessage(msg);
            });

            return () => socket.disconnect();
        })();
    }, []);

    useEffect(() => {
        console.log('updating room settings');
        console.log(room);
        setIsHost(user.name === room.host);
        setCurrentPlayers(room.players);
        setMaxPlayers(room.max);
        setDrawingTime(room.drawingTime);
        setRounds(room.rounds);
        setPlayers(room.allUsers);
    }, [room]);

    const isValidRoom = async (id) => {
        const { valid } = await Http.get(`/user/game/room/valid/${id}`);
        console.log(valid);
        return valid;
    };

    const handleChangeDrawingTime = (drawingTime) => {
        socket.emit(
            'changeSettingsPrivateRoom',
            JSON.stringify({
                newRoom: { ...room, drawingTime },
            })
        );
    };

    const handleChangeMaxPlayers = (max) => {
        socket.emit(
            'changeSettingsPrivateRoom',
            JSON.stringify({
                newRoom: { ...room, max },
            })
        );
    };

    const handleChangeGameRounds = (rounds) => {
        socket.emit(
            'changeSettingsPrivateRoom',
            JSON.stringify({
                newRoom: { ...room, rounds },
            })
        );
    };

    const clipBoardUrl = () => {
        refUrl.current.select();
        navigator.clipboard.writeText(url);
        notification.success({ message: 'Link copiado en tu portapapeles!', placement: 'bottomRight' });
    };

    const clipBoardCode = () => {
        refCode.current.select();
        navigator.clipboard.writeText(roomId);
        notification.success({ message: 'Código de la sala copiado en tu portapapeles!', placement: 'bottomRight' });
    };

    const handleStartGame = () => {
        console.log('starting the game...');
    };

    const handleSendMessage = (msg) => {
        console.log(msg);
        socket.emit('sendMessageToRoom', { room: roomId, name: user.name, msg });
    }

    return (
        <div className="wrapPreRoom">
            <div className="wrapper">
                <div className="preRoom">
                    <div className="settings">
                        <h2>Configuración</h2>
                        <Divider className="divider"></Divider>
                        <div className="center">
                            {players ? <UsersAvatars size={40} showNames={true} users={players} /> : null}
                            <Form layout="vertical" initialValues={initialFormValues}>
                                <Form.Item label="Jugadores">
                                    <Form.Item name="fieldCurrentPlayers" noStyle>
                                        <InputNumber
                                            size="middle"
                                            disabled={!isHost}
                                            style={{ width: 200 }}
                                            onChange={handleChangeMaxPlayers}
                                            value={maxPlayers}
                                            min={currentPlayers}
                                            max={20}
                                        />
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item label="Tiempo de dibujado">
                                    <Select
                                        size="middle"
                                        disabled={!isHost}
                                        value={drawingTime}
                                        onChange={handleChangeDrawingTime}
                                        style={{ width: 200 }}
                                    >
                                        {optionsTime}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Rondas">
                                    <Select
                                        size="middle"
                                        disabled={!isHost}
                                        value={rounds}
                                        onChange={handleChangeGameRounds}
                                        style={{ width: 200 }}
                                    >
                                        {optionsRounds}
                                    </Select>
                                </Form.Item>
                                <Button
                                    size="large"
                                    className="btnStart"
                                    onClick={handleStartGame}
                                    disabled={!isHost || currentPlayers === 1}
                                >
                                    Empezar partida
                                </Button>
                            </Form>
                        </div>
                    </div>
                    <div className="players">
                        <h2>Chat</h2>
                        <Divider className="divider"></Divider>
                        <Chat sendMessage={handleSendMessage} placeholderMessage="Escribe algo..." />
                    </div>
                </div>
                <div className="shareLink">
                    <span>Comparte este link para invitar a amigos</span>
                    <div className="wrapUrl">
                        <Input
                            size="large"
                            ref={refUrl}
                            onChange={() => setUrl(window.location.href)}
                            value={url}
                            style={{ width: '80%' }}
                        />
                        <Button size="large" onClick={clipBoardUrl} type="primary" icon={<CopyOutlined />}>
                            Copiar
                        </Button>
                    </div>
                    <span>O comparte el código de la sala</span>
                    <div className="wrapUrl">
                        <Input
                            size="large"
                            ref={refCode}
                            onChange={() => setRoomId(match.params.id)}
                            value={roomId}
                            style={{ width: '80%' }}
                        />
                        <Button size="large" onClick={clipBoardCode} type="primary" icon={<CopyOutlined />}>
                            Copiar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    user: readUser(state),
    room: readPrivateRoom(state),
});

const mapDispatchToProps = (dispatch) => ({
    addMessage: (message) => dispatch(addMessage(message)),
    resetMessages: () => dispatch(resetMessages())
});

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoom);
