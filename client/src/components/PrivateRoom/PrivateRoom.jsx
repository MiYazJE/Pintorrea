import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Button, InputNumber, Select, Divider, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { readUser } from '../../Redux/Reducers/UserReducer';
import './privateRoom.scss';
import io from 'socket.io-client';
import { readPrivateRoom } from '../../Redux/Reducers/gameReducer';
import { setPrivateRoom } from '../../Redux/Actions/gameActions';
import Http from '../../Helpers/Http';

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
    const [room, setRoom] = useState({});
    const [isHost, setIsHost] = useState(true);
    const [currentPlayers, setCurrentPlayers] = useState(0);
    const [maxPlayers, setMaxPlayers] = useState(0);
    const [drawingTime, setDrawingTime] = useState(0);
    const [rounds, setRounds] = useState(0);
    const [optionsTime, setOptionsTime] = useState(getOptions(60, 150, 10));
    const [optionsRounds, setOptionsRounds] = useState(getOptions(3, 10, 1));
    const history = useHistory();

    useEffect(() => {
        console.log(user);  
        (async () => {
            // const { id } = match.params;
            // if (!id || (!await isValidRoom(id)))
            //     return history.push('/login');
    
            // socket = io();
            // console.log(user.name, 'join room');
            // socket.emit('joinPrivateRoom', { user, id });
    
            // socket.on('updateSettings', ({ room }) => {
            //     console.log('updating room settings', room);
            //     setRoom(room);
            // });
    
            // return () => socket.disconnect();
        })();
    }, []);

    useEffect(() => {
        setCurrentPlayers(room.players);
        setMaxPlayers(room.max);
        setDrawingTime(room.drawingTime);
        setRounds(room.rounds);
    }, [room]);

    const isValidRoom = async (id) => {
        const { valid } = await Http.get(`/user/game/room/valid/${id}`);
        console.log(valid)
        return valid;
    }

    const handleChangeDrawingTime = (drawingTime) => {
        socket.emit('changeSettingsPrivateRoom', {
            newRoom: { ...room, drawingTime },
        });
    };

    const handleChangeMaxPlayers = (max) => {
        socket.emit('changeSettingsPrivateRoom', {
            newRoom: { ...room, max },
        });
    };

    const handleChangeGameRounds = (rounds) => {
        socket.emit('changeSettingsPrivateRoom', {
            newRoom: { ...room, rounds },
        });
    };

    return (
        <div className="wrapPreRoom">
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
                                    min={currentPlayers}
                                    max={20}
                                />
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label="Tiempo de dibujado por turno">
                            <Select disabled={!isHost} defaultValue="80" onChange={handleChangeDrawingTime} style={{ width: 200 }}>
                                {optionsTime}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Rondas">
                            <Select defaultValue="3" onChange={handleChangeGameRounds} style={{ width: 200 }}>
                                {optionsRounds}
                            </Select>
                        </Form.Item>
                        <Tooltip title={isHost && currentPlayers === 1 ? 'Necesario ser mas de 1 jugador.' : ''}>
                            <Button className="btnStart" disabled={!isHost || currentPlayers === 1}>
                                Empezar partida
                            </Button>
                        </Tooltip>
                    </Form>
                </div>
                <div className="players">
                    <h2>Jugadores</h2>
                    <Divider className="divider"></Divider>
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
