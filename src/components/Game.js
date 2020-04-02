import React, { useEffect } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import io from 'socket.io-client';
import { Layout } from 'antd';
import Chat from './Chat';

const { Content } = Layout;

let socket;
const ENDPOINT = 'http://localhost:3000';

export default function Game({ user, logout }) {
    
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.on('connection', () => {

        });
    }, []);

    return (
        <Layout className="layout">
            <Nav logout={logout} user={user} />
            <Content className="content">
                <Chat />
            </Content>
            <Footer />
        </Layout>
    );
}
