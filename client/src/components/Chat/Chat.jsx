import React, { useEffect, useRef } from 'react';
import './chat.scss';
import { Form, Input, List } from 'antd';

const MESSAGE_BACKGROUND = '#03213E';

const Chat = ({ messages, sendMessage, placeholderMessage }) => {
    const [form] = Form.useForm();
    const refScroll = useRef(null);

    const scrollToBottom = () => {
        refScroll.current && refScroll.current.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = ({ msg }) => {
        if (!msg) return;
        sendMessage(msg);
        form.resetFields();
    }

    return (
        <div className="wrap-chat">
            <div className="text-chat">
                <List
                    dataSource={messages}
                    renderItem={({ admin, name, msg }, index) => (
                        <span className={`item-${admin ? 'admin' : 'user'}-chat`}>
                            <p style={{backgroundColor: index % 2 === 0 ? MESSAGE_BACKGROUND : null, borderRadius: '2px', padding: '3px' }}>
                                {admin ? msg : `${name.toUpperCase()}: ${msg}`}
                            </p>
                            <div ref={refScroll} />
                        </span>
                    )}
                />
            </div>
            <div className="formMessage">
                <Form form={form} onFinish={(msg) => handleSendMessage(msg)}>
                    <Form.Item name="msg">
                        <Input autoFocus placeholder={placeholderMessage} />
                    </Form.Item>
                </Form>
            </div>
        </div>
    );

}

export default Chat;