import React from 'react';
import '../css/chat.css';
import { Form, Input, List } from 'antd';

const Chat = ({ messages, sendMessage }) => {
    const [form] = Form.useForm();

    const handleSendMessage = ({ msg }) => {
        sendMessage(msg);
        form.resetFields();
    }

    return (
        <div className="wrap-chat">
            <div className="text-chat">
                <List
                    dataSource={messages}
                    renderItem={({ admin, name, msg }) => (
                        <List.Item className={`item-${admin ? 'admin' : 'user'}-chat`} key={name}>
                            <p>{admin ? msg : `${name.toUpperCase()}: ${msg}`}</p>
                        </List.Item>
                    )}
                />
            </div>
            <Form form={form} onFinish={(msg) => handleSendMessage(msg)}>
                <Form.Item name="msg">
                    <Input autoFocus placeholder="Adivina el dibujo..." />
                </Form.Item>
            </Form>
        </div>
    );

}

export default Chat;