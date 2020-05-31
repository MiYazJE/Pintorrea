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
import GameProgress from "../GameProgress/GameProgress";

const ENDPOINT = '/socket-io';
const INITIAL_COLOR = '#000000';
const INITIAL_FONT_SIZE = 5;

const MAX_SECONDS_CHOOSE_WORD = 15;

let socket;

const Game = ({ user, room }) => {

    const [actualWord, setActualWord] = useState('');
    const [drawerName, setDrawerName] = useState('');
    const [showChooseWord, setShowChooseWord] = useState(false);
    const [showUserIsChoosing, setShowUserIsChoosing] = useState(false);
    const [currentWord, setCurrentWord] = useState(null);
    const [intervalEvent, setIntervalEvent] = useState(null);
    const [words, setWords] = useState([]);
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

        socket.on('chooseDrawer', async ({ drawer, words }) => {
            canvasRef.current.clear();
            setIsDrawer(drawer === user.name);
            if (drawer !== user.name) {
                showDrawerIsChoosing(drawer);
                return;
            }
            setShowChooseWord(true);
            await new Promise(res => setTimeout(res, 2000));
            setWords(words);
            startEventChooseWord(words);
        });

        socket.on('draw', ({ drawer, coordinates }) => {
            if (drawer === user.name) return;
            canvasRef.current.loadSaveData(coordinates);
        });

        socket.on('ready', ({ word }) => {
            setShowModal(false);
            setShowUserIsChoosing(false);
            setShowChooseWord(false);
            setActualWord(word);
        });

        return () => socket.disconnect();
    }, []);

    const startEventChooseWord = async (wordsToChoose) => {
        setShowModal(true);
        let currentSeconds = 0;
        let interval = setInterval(() => {
            console.log(currentSeconds);
            if (currentSeconds === MAX_SECONDS_CHOOSE_WORD) {
                console.log('timeout, choosing the word randomly...');
                handleChooseWord(wordsToChoose[Math.random() * words.length]);
                clearInterval(interval);
            }
            currentSeconds++;
        }, 1000);
        setIntervalEvent(interval);
    }

    const handleChooseWord = (word) => {
        console.log(word);
        setCurrentWord(word);
        setShowModal(false);
        clearInterval(intervalEvent);
        setIntervalEvent(null);
        socket.emit('startDrawing', { word, room, name: user.name });
    }

    const showDrawerIsChoosing = (drawer) => {
        setDrawerName(drawer);
        setShowUserIsChoosing(true);
        setShowModal(true);
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

    const sendMessage = (guess) => socket.emit('guessWord', { user, guess, room });

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
                    {socket ? 
                        <GameProgress 
                            socket={socket} 
                            drawer={drawerName} 
                            you={user.name} 
                            word={actualWord} 
                        /> 
                    : null}
                </div>
                <div className="inlineItems">
                    <div className="puntuationTable">
                        {socket ? <Puntuation you={user.name} socket={socket} room={room} /> : null}
                    </div>
                    <div className="drawContainer">
                        <div className="wrapCanvas">
                            <CanvasDraw
                                ref={canvasRef}
                                onChange={sendCoordinates}
                                brushRadius={fontSize}
                                hideGrid={true}
                                canvasHeight="100%"
                                canvasWidth="100%"
                                brushColor={canvasColor}
                                lazyRadius={0}
                                hideInterface={true}
                                immediateLoading={true}
                                disabled={!isDrawer}
                            />
                            <CustomModal show={showModal}>
                                {showChooseWord ? <ChooseWords words={words} chooseWord={handleChooseWord} /> : null}
                                {showUserIsChoosing ? 
                                    <div style={{height: '100%', display: 'flex', alignItems: 'center'}}>
                                        <h1 style={{color: 'white'}}>{drawerName} esta escogiendo una palabra!</h1>
                                    </div> 
                                : null}
                            </CustomModal>
                        </div>
                        <CanvasControls
                            show={isDrawer}
                            changeColor={changeColor}
                            setPaintMode={setPaintMode}
                            setFontSize={setFontSize}
                            goBack={handleUndo}
                            clear={handleClear}
                        />
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