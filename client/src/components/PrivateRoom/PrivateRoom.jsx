import React, { useState, useEffect } from 'react';
import { Form, Input, Button, InputNumber, Select, Divider, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { readUser } from '../../Redux/Reducers/UserReducer';
import './privateRoom.scss';
import io from 'socket.io-client';
import { readPrivateRoom } from '../../Redux/Reducers/gameReducer';
import { setPrivateRoom } from '../../Redux/Actions/gameActions';

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

const PrivateRoom = ({ user, match, room }) => {
    const [currentPlayers, setCurrentPlayers] = useState(room.players);
    const [maxPlayers, setMaxPlayers] = useState(room.max);
    const [drawingTime, setDrawingTime] = useState(room.drawingTime);
    const [rounds, setRounds] = useState(room.rounds);
    const [optionsTime, setOptionsTime] = useState(getOptions(60, 150, 10));
    const [optionsRounds, setOptionsRounds] = useState(getOptions(3, 10, 1));

    useEffect(() => {
        setCurrentPlayers(room.players);
        setMaxPlayers(room.max);
        setDrawingTime(drawingTime);
        setRounds(rounds);
    }, [room]);

    useEffect(() => {
        socket = io();

        console.log(room)
        socket.emit('joinPrivateRoom', { user, id: room.id });

        socket.on('updateSettings', ({ room }) => {
            console.log(room);
            setPrivateRoom(room)
        });

        return () => socket.disconnect();
    }, []);

    const setConfiguration = ({}) => {
        console.log();
    };

    const handleChangeDrawingTime = (drawingTime) => {
        socket.emit('changeSettingsPrivateRoom', { 
            newRoom: { ...room, drawingTime },
        });
    };

    const handleChangeMaxPlayers = (max) => {
        socket.emit('changeSettingsPrivateRoom', { 
            newRoom: { ...room, max },
        });
    }
    
    const handleChangeGameRounds = (rounds) => {
        socket.emit('changeSettingsPrivateRoom', { 
            newRoom: { ...room, rounds },
        });
    }

    return (
        <div className="wrapPreRoom">
            <div className="preRoom">
                <div className="settings">
                    <h2>Configuración</h2>
                    <Divider className="divider"></Divider>
                    <Form layout="vertical" initialValues={initialFormValues}>
                        <Form.Item label="Jugadores">
                            <Form.Item name="fieldCurrentPlayers" noStyle>
                                <InputNumber style={{ width: 200 }} onChange={handleChangeMaxPlayers} min={currentPlayers} max={20} />
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label="Tiempo de dibujado por turno">
                            <Select defaultValue="80" onChange={handleChangeDrawingTime} style={{ width: 200 }}>
                                {optionsTime}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Rondas">
                            <Select defaultValue="3" onChange={handleChangeGameRounds} style={{ width: 200 }}>
                                {optionsRounds}
                            </Select>
                        </Form.Item>
                        <Tooltip title={currentPlayers === 1 ? 'Necesario ser mas de 1 jugador.' : null}>
                            <Button className="btnStart" disabled={currentPlayers === 1}>
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
    room: readPrivateRoom(state)
});

export default connect(mapStateToProps, { setPrivateRoom })(PrivateRoom);
