import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { notification, Form, Input, Button, InputNumber, Select, Divider, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { readUser } from '../../reducers/userReducer';
import './privateRoom.scss';
import io from 'socket.io-client';
import { readPrivateRoom } from '../../reducers/gameReducer';
import { setPrivateRoom } from '../../actions/gameActions';
import Http from '../../Helpers/Http';
import UsersAvatars from '../UsersAvatars/UsersAvatars';
import { CopyOutlined } from '@ant-design/icons';

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

const PrivateRoom = ({ user, match }) => {
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

            socket = io();
            console.log(user.name, 'join room');
            socket.emit('joinPrivateRoom', { user, id });

            socket.on('updateSettings', (data) => {
                const { room } = JSON.parse(data);
                setRoom(room);
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
        socket.emit('changeSettingsPrivateRoom', 
            JSON.stringify({
              newRoom: { ...room, drawingTime },
            })
        );
    };

    const handleChangeMaxPlayers = (max) => {
        socket.emit('changeSettingsPrivateRoom', 
            JSON.stringify({
                newRoom: { ...room, max },
            })
        );
    };

    const handleChangeGameRounds = (rounds) => {
        socket.emit('changeSettingsPrivateRoom', 
            JSON.stringify({
                newRoom: { ...room, rounds },
            })
        );
    };

    const clipBoardUrl = () => {
        refUrl.current.select();
        navigator.clipboard.writeText(url);
        notification.success({ message: 'Link copiado en tu portapapeles!', placement: 'bottomRight' });
    }

    const clipBoardCode = () => {
        refCode.current.select();
        navigator.clipboard.writeText(roomId);
        notification.success({ message: 'Código de la sala copiado en tu portapapeles!', placement: 'bottomRight' });
    }

    return (
        <div className="wrapPreRoom">
            <div className="wrapper">
                <div className="preRoom">
                    <div className="settings">
                        <h2>Configuración</h2>
                        <Divider className="divider"></Divider>
                        <Form layout="vertical" initialValues={initialFormValues}>
                            <Form.Item label="Jugadores">
                                <Form.Item name="fieldCurrentPlayers" noStyle>
                                    <InputNumber
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
                                    disabled={!isHost}
                                    value={rounds}
                                    onChange={handleChangeGameRounds}
                                    style={{ width: 200 }}
                                >
                                    {optionsRounds}
                                </Select>
                            </Form.Item>
                            <Button className="btnStart" disabled={!isHost || currentPlayers === 1}>
                                Empezar partida
                            </Button>
                        </Form>
                    </div>
                    <div className="players">
                        <h2>Jugadores</h2>
                        <Divider className="divider"></Divider>
                        {players ? <UsersAvatars size={80} showNames={true} users={players} /> : null}
                    </div>
                </div>
                <div className="shareLink">
                    <span>Comparte este link para invitar a amigos</span>
                    <div className="wrapUrl">
                        <Input
                            ref={refUrl}
                            onChange={() => setUrl(window.location.href)}
                            value={url}
                            style={{ width: '80%' }}
                        />
                        <Button onClick={clipBoardUrl} type="primary" icon={<CopyOutlined />}>Copiar</Button>
                    </div>
                    <span>O comparte el código de la sala</span>
                    <div className="wrapUrl">
                        <Input
                            ref={refCode}
                            onChange={() => setRoomId(match.params.id)}
                            value={roomId}
                            style={{ width: '80%' }}
                        />
                        <Button onClick={clipBoardCode} type="primary" icon={<CopyOutlined />}>Copiar</Button>
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

export default connect(mapStateToProps, { setPrivateRoom })(PrivateRoom);
