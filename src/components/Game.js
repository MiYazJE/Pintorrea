import React, { useEffect } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import io from 'socket.io-client';
import { Layout } from 'antd';
import Chat from './Chat';
import { connect } from "react-redux";
import { readUser } from '../Redux/Reducers/UserReducer';

const { Content } = Layout;

let socket;
const ENDPOINT = 'http://localhost:3000';

const Game = ({ user }) => {

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('join', user);
        
        return () => {
            console.log('unmounting component')
            socket.emit('disconnect');
            socket.off();
        }
    }, [user]);
    
    const sendWord = (word) => {
        socket.emit('guessWord', { user, word });
    }

    return (
        <Layout className="layout">
            <Nav />
            <Content className="content">
                <Chat sendWord={sendWord} />
            </Content>
            <Footer />
        </Layout>
    );
}

const mapStateToProps = state => {
    return { user: readUser(state) }
}

export default connect(mapStateToProps, { })(Game);