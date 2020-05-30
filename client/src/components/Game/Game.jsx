import React, { useEffect, useState, useRef } from "react";
import Chat from '../Chat/Chat';
import CanvasControls from '../CanvasControls/CanvasControls';
import Puntuation from '../Puntuation/Puntuation';
import CanvasDraw from "react-canvas-draw";
import ChooseWords from '../ChooseWoords/ChooseWords';
import CustomModal from '../CustomModal/CustomModal';
import { connect } from "react-redux";
import { readUser, readRoom } from '../../Redux/Reducers/UserReducer';
import io from 'socket.io-client';
import './game.scss';

const ENDPOINT = '/socket-io';
const INITIAL_COLOR = '#000000';
const INITIAL_FONT_SIZE = 5;

let socket;

const Game = ({ user, room }) => {

    const [intervalEvent, setIntervalEvent] = useState(null);
    const [words, setWords] = useState(['pepino', 'rodillo', 'teclado']);
    const [showModal, setShowModal] = useState(false);
    const [coordinates, setCoordinates] = useState({});
    const [isDrawer, setIsDrawer] = useState(false);
    const [messages, setMessages] = useState([]);
    const [canvasColor, setCanvasColor] = useState(INITIAL_COLOR);
    const [previousColor, setPreviousColor] = useState(canvasColor);
    const [fontSize, setFontSize] = useState(INITIAL_FONT_SIZE);
    const [previousFontSize, setPreviousFontSize] = useState(fontSize);
    const [bucketPaint, setBucketPaint] = useState(false);
    const canvasRef = useRef(null);

    useEffect(() => {
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'z') {
                handleUndo();
            }
        });
    }, []);

    useEffect(() => {
        socket = io();
        socket.emit('joinRoom', { user, roomName: room });

        socket.on('message', (message) => {
            setMessages(messages => [...messages, message]);
        });

        socket.on('chooseDrawer', ({ drawer, words }) => {
            setIsDrawer(drawer === user.name);
            if (drawer !== user.name) return;
            console.log(words);
            setWords(words);
            startEventChooseWord();
        }); 

        socket.on('draw', ({ drawer, coordinates }) => {
            if (drawer === user.name) return;
            canvasRef.current.loadSaveData(coordinates);
        });

        return () => socket.disconnect();
    }, []);

    const startEventChooseWord = async () => {
        setShowModal(true);
        let seconds = 0;
        let interval = setInterval(() => {
            console.log(seconds);
            seconds++;
            if (seconds === 5) {
                console.log('timeout, choosing the word randomly...');
                setShowModal(false);
                clearInterval(interval);
                setIntervalEvent(null);
            }
        }, 1000);
        setIntervalEvent(interval);
    }

    const handleChooseWord = (word) => {
        console.log(word);
        setShowModal(false);
        clearInterval(intervalEvent);
        setIntervalEvent(null);
    }

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

    const sendMessage = (msg) => socket.emit('sendMessage', { user, msg, room });

    const sendCoordinates = (canvas) => {
        if (!isDrawer) return;
        const coordinates = canvas.getSaveData();
        socket.emit('sendDraw', { drawer: user.name, coordinates, room });
    }

    const handleClear = () => {
        canvasRef.current.clear();
        sendCoordinates(canvasRef.current);
    }

    const handleUndo = () => {
        canvasRef.current.undo();
        sendCoordinates(canvasRef.current);
    }

    return (
        <div className="wrapGameContent">
            <div className="gameContent">
                <div className="gameProgress">
                    
                </div>
                <div className="inlineItems">
                    <div className="puntuationTable">
                        {socket ? <Puntuation socket={socket} room={room} /> : null}
                    </div>
                    <div className="drawContainer">
                        <CanvasDraw
                            ref={canvasRef}
                            onChange={sendCoordinates}
                            brushRadius={fontSize}
                            hideGrid={true}
                            canvasHeight="80%"
                            canvasWidth={'100%'}
                            brushColor={canvasColor}
                            lazyRadius={0}
                            hideInterface={true}
                            immediateLoading={true}
                            disabled={!isDrawer}
                        />
                        {isDrawer ?
                            <CanvasControls
                                changeColor={changeColor}
                                setPaintMode={setPaintMode}
                                setFontSize={setFontSize}
                                goBack={handleUndo}
                                clear={handleClear}
                            /> : null}
                        <CustomModal show={showModal}>
                            <ChooseWords words={words} chooseWord={handleChooseWord} />
                        </CustomModal>
                    </div>
                    <Chat
                        messages={messages}
                        sendMessage={sendMessage}
                        placeholderMessage="Adivina el dibujo..."
                    />
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return { user: readUser(state), room: readRoom(state) }
}

export default connect(mapStateToProps, {})(Game);