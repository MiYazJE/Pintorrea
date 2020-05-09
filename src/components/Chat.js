import React, { useEffect } from 'react';
import '../css/chat.css';
import io from 'socket.io-client';
import { Form, Input, Button } from 'antd';
import { connect } from "react-redux";
import { readUser } from '../Redux/Reducers/UserReducer';

let socket;
const ENDPOINT = 'http://localhost:3000';

const Chat = ({ user, sendWord }) => {

    const onFinish = ({ msg }) => {
        socket.emit('chat', { user, msg });
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.on('chat', ({ user, msg }) => {
            console.log(`${user.name}: ${msg}`);
        });
    }, []);

    return (
        <div className="wrap-chat">
            <div className="text-chat"></div>
            <Form className="inputs" layout="inline" onFinish={onFinish}>
                <Form.Item style={{margin: 0}} name="msg">
                    <Input placeholder="Adivina el dibujo..." />
                </Form.Item>
                <Button style={{margin: '2px'}} type="primary" htmlType="submit">
                    Enviar
                </Button>
            </Form>
        </div>
    );

}

const mapStateToProps = state => {
    return { user: readUser(state) }
}

export default connect(mapStateToProps, { })(Chat);