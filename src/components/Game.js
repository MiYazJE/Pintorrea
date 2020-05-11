import React, { useEffect, useState, useRef } from "react";
import Chat from './Chat';
import CanvasControls from './CanvasControls';
import CanvasDraw from "react-canvas-draw";
import { connect } from "react-redux";
import { readUser } from '../Redux/Reducers/UserReducer';
import io from 'socket.io-client';
import '../css/game.css';

const ENDPOINT          = 'http://localhost:3000'
const INITIAL_COLOR     = '#000000';
const INITIAL_FONT_SIZE = 12;

let socket;

const Game = ({ user }) => {

    const [messages, setMessages] = useState([]);
    const [canvasColor, setCanvasColor] = useState(INITIAL_COLOR);
    const [previousColor, setPreviousColor] = useState(canvasColor);
    const [fontSize, setFontSize] = useState(INITIAL_FONT_SIZE);
    const [previousFontSize, setPreviousFontSize] = useState(fontSize);
    const [bucketPaint, setBucketPaint] = useState(false);
    const canvasRef = useRef(null);

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('join', user);

        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'z') {
                canvasRef.current.undo();
            }
        });

        return () => {
            socket.disconnect(user);
        }
    }, [ENDPOINT]);

    useEffect(() => {
        socket.on('message', (message) => { 
            console.log(message)
            setMessages(messages => [...messages, message]);
        });
    }, []);

    const setPaintMode = (mode) => {
        if (mode === 'draw') {
            setCanvasColor(previousColor);
        }
        else if (mode === 'erase') {
            setCanvasColor('#FFF');
        }
        else if (mode === 'bucket') {
            setPreviousFontSize(fontSize);
            setFontSize(0);
            setBucketPaint(true);
            return;
        }
        console.log('entra')
        setFontSize(previousFontSize);
        setBucketPaint(false);
    }

    const changeColor = (color) => {
        setCanvasColor(color);
        setPreviousColor(color);
    }

    const paintBucket = () => {
        console.log('painting with bucket...');
        
    }

    const sendMessage = (msg) => socket.emit('sendMessage', { user, msg });

    return (
        <div className="wrapGameContent">
            <div className="gameContent">
                <div className="drawContainer">
                    <CanvasDraw 
                        ref={canvasRef} 
                        brushRadius={fontSize}
                        hideGrid={true} 
                        canvasHeight="80%"
                        canvasWidth={'100%'} 
                        brushColor={canvasColor}
                        lazyRadius={0}
                        hideInterface={true}
                        />
                    <CanvasControls 
                        changeColor={changeColor} 
                        setPaintMode={setPaintMode} 
                        setFontSize={setFontSize}
                        goBack={() => canvasRef.current.undo()}
                        clear={() => canvasRef.current.clear()}
                    />
                </div>
                <Chat messages={messages} sendMessage={sendMessage} />
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return { user: readUser(state) }
}

export default connect(mapStateToProps, {})(Game);