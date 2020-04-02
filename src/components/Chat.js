import React from 'react';
import '../css/chat.css';
import { Form, Input, Button } from 'antd';

const Chat = () => {

    const sendWord = ({ guessedWord }) => {
        console.log(guessedWord);
    }

    return (
        <div className="wrap-chat">
            <div className="text-chat"></div>
            <Form layout="inline" onFinish={sendWord}>
                <Form.Item name="guessedWord">
                    <Input placeholder="Adivina el dibujo..." />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                    Enviar
                </Button>
            </Form>
        </div>
    );

}

export default Chat;