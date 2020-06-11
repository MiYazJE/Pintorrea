import React, { useEffect, useRef, useState } from 'react';
import './chat.scss';
import { Form, Input, List } from 'antd';
import { connect } from 'react-redux';
import { readIsDrawer, readGuessed, readMessages } from '../../reducers/gameReducer';

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

    const getClassStatus = (admin, privateMsg, statusMsg, userLeft) => {
        if (admin) return 'admin';
        if (privateMsg) return 'private';
        if (statusMsg) return 'gameStatus';
        if (userLeft) return 'userLeft';
        return 'user';
    }

    return (
        <div className="wrap-chat">
            <div className="text-chat">
                <List
                    dataSource={messages}
                    renderItem={({ admin, name, msg, privateMsg, statusMsg, userLeft }, index) => (
                        <span className={getClassStatus(admin, privateMsg, statusMsg, userLeft)}>
                            <p style={{backgroundColor: index % 2 === 0 ? MESSAGE_BACKGROUND : null, borderRadius: '2px', padding: '3px' }}>
                                {admin || statusMsg || userLeft ? msg 
                                    : 
                                    <span>
                                        <span style={{fontWeight: 'bold'}}>{name.toUpperCase()}</span>{`: ${msg}`}
                                    </span>
                                }
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

const mapStateToProps = (state) => ({
    isDrawer: readIsDrawer(state),
    guessed : readGuessed(state),
    messages: readMessages(state),
});

export default connect(mapStateToProps, {})(Chat);