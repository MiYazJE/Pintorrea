import React, { useEffect, useRef } from 'react';
import './chat.scss';
import { Form, Input, List } from 'antd';
import { connect } from 'react-redux';
import { readIsDrawer, readGuessed } from '../../Redux/Reducers/gameReducer';

const MESSAGE_BACKGROUND = '#03213E';

const Chat = ({ messages, sendMessage, placeholderMessage, isDrawer, guessed }) => {
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

    console.log(messages)
    console.log(isDrawer, guessed)
    return (
        <div className="wrap-chat">
            <div className="text-chat">
                <List
                    dataSource={messages}
                    renderItem={({ admin, name, msg, privateMsg }, index) => (
                        (privateMsg && !isDrawer) && (privateMsg && !guessed) ? null : 
                            <span className={`item-${admin ? 'admin' : privateMsg ? 'private' : 'user'}-chat`}>
                                <p style={{backgroundColor: index % 2 === 0 ? MESSAGE_BACKGROUND : null, borderRadius: '2px', padding: '3px' }}>
                                    {admin ? msg 
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
    guessed : readGuessed(state)
});

export default connect(mapStateToProps, {})(Chat);