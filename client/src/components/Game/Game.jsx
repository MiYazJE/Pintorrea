import React, { useEffect, useState, useRef } from 'react';
import Chat from '../Chat/Chat';
import CanvasControls from '../CanvasControls/CanvasControls';
import Puntuation from '../Puntuation/Puntuation';
import CustomModal from '../CustomModal/CustomModal';
import { connect, useDispatch } from 'react-redux';
import { leaveRoom, sendPuntuation } from '../../actions/userActions';
import { readUser, readRoom, readVolumeActivated } from '../../reducers/userReducer';
import { readIsDrawer, readMessages, readDrawerName, readGuessed, readActualWord } from '../../reducers/gameReducer';
import {
    setActualWord,
    setGuessed,
    resetGame,
    setDrawerName,
    setIsDrawer,
    addMessage,
    resetMessages,
    setCurrentRound,
    setMaxRound,
    setIsStarted,
} from '../../actions/gameActions';
import io from 'socket.io-client';
import './game.scss';
import GameProgress from '../GameProgress/GameProgress';
import ShowInteraction from './ShowInteraction';
import ResizeObserver from 'resize-observer-polyfill';
import { useHistory, Link } from 'react-router-dom';
import useSound from 'use-sound';
import guessedSound from '../../sounds/guessed.mp3';
import clockSound from '../../sounds/clock.mp3';
import timeoutSound from '../../sounds/timeout.mp3';
import joinSound from '../../sounds/userJoin.mp3';
import leaveSound from '../../sounds/userLeft.mp3';

const INITIAL_COLOR = '#000000';
const INITIAL_FONT_SIZE = 5;

const MAX_SECONDS_CHOOSE_WORD = 15;

let socket;
let startDrawing = false;
let coordinates = {};
let globalCoordinates = [];

let canvasColor = INITIAL_COLOR;
let previousColor = canvasColor;
let fontSize = INITIAL_FONT_SIZE;
let resizing = false;

let ctx;

const Game = ({
    isDrawer,
    user,
    room,
    setActualWord,
    setGuessed,
    setDrawerName,
    setIsDrawer,
    resetGame,
    resetMessages,
    addMessage,
    setCurrentRound,
    setMaxRound,
    setIsStarted,
    leaveRoom,
    volumeActivated,
}) => {
    const [roundPuntuation, setRoundPuntuation] = useState([]);
    const [finalPuntuation, setFinalPuntuation] = useState([]);
    const [interaction, setInteraction] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [intervalEvent, setIntervalEvent] = useState(null);
    const [words, setWords] = useState([]);
    const [wrapCanvasWidth, setWrapCanvasWidth] = useState(0);
    const [wrapCanvasHeight, setWrapCanvasHeight] = useState(0);
    const [reproduce, setReproduce] = useState(false);
    const [time, setTime] = useState(null);
    const [encryptedWord, setEncryptedWord] = useState('');
    const [playGuessed] = useSound(guessedSound);
    const [playTimeout] = useSound(timeoutSound);
    const [playJoin] = useSound(joinSound);
    const [playLeave] = useSound(leaveSound);
    const [playTime, { stop }] = useSound(clockSound);
    const history = useHistory();
    const dispatch = useDispatch();

    const wrapCanvasRef = useRef(null);
    const canvasRef = useRef(null);
    const puntuationRef = useRef(null);

    useEffect(() => {
        if (!user.room) return history.push('/');

        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'z') {
                handleUndo();
            }
        });

        ctx = canvasRef.current.getContext('2d');
        resetMessages();
        socket = io();
        socket.emit('joinRoom', { user, roomName: room });
    }, []);

    useEffect(() => {
        const observer = new ResizeObserver((entries, observer) => {
            const { width, height } = entries[0].contentRect;
            setWrapCanvasHeight(height);
            setWrapCanvasWidth(width);
            resizing = true;
            for (const coordinates of globalCoordinates) {
                draw(coordinates);
            }
            resizing = false;
        });
        observer.observe(wrapCanvasRef.current);

        return () => observer.unobserve(wrapCanvasRef.current);
    }, []);

    useEffect(() => {
        if (!user.room) return history.push('/');
        socket.on('message', (message) => {
            if (message.reproduceSound) {
                setReproduce(message.reproduceSound);
            } else if (message.userLeft) {
                setReproduce('leave');
            } else if (message.userJoin) {
                setReproduce('join');
            }
            addMessage(message);
        });

        socket.on('chooseDrawer', async ({ drawer, words }) => {
            resetGame();
            setIsDrawer(drawer === user.name);
            setDrawerName(drawer);
            if (drawer !== user.name) {
                removeCanvasEvents();
                showDrawerIsChoosing(drawer);
                return;
            }
            applyCanvasEvents();
            setInteraction('chooseWord');
            setWords(words);
            startEventChooseWord(words);
        });

        socket.on('draw', ({ drawer, coordinates }) => {
            console.log(coordinates)
            if (drawer !== user.name) draw(coordinates);
        });

        socket.on('clearCanvas', () => {
            clearCanvas();
        });

        socket.on('ready', ({ word, currentRound, maxRound }) => {
            clearCanvas();
            setIsStarted(true);
            setShowModal(false);
            setCurrentRound(currentRound);
            setMaxRound(maxRound);
            setActualWord(word);
        });

        socket.on('progress', ({ time, encryptedWord }) => {
            setTime(time);
            setEncryptedWord(encryptedWord);
        });

        socket.on('puntuationTable', ({ users, finalStatusMsg, reproduceSound }) => {
            setReproduce(reproduceSound || 'stopTime');
            setRoundPuntuation({ users, finalStatusMsg });
            setInteraction('puntuationTable');
            setShowModal(true);
        });

        socket.emit('getGameStatus', { room });

        socket.on('gameStatus', ({ users }) => {
            puntuationRef.current.sortUsers(users);
        });

        socket.on('setGuessed', () => setGuessed());

        socket.on('nextRound', ({ round }) => {
            setInteraction('nextRound');
            setCurrentRound(round);
        });

        socket.on('endGame', ({ users }) => {
            dispatch(sendPuntuation(user, users));
            resetGame();
            setInteraction('showResults');
            setFinalPuntuation(users);
        });

        return () => {
            resetMessages();
            leaveRoom();
            socket.disconnect();
        };
    }, []);

    const applyCanvasEvents = () => {
        canvasRef.current.onmousedown = mouseDownEvent;
        canvasRef.current.onmousemove = mouseMoveEvent;
        canvasRef.current.onmouseup = mouseUpEvent;
    };

    const removeCanvasEvents = () => {
        canvasRef.current.removeEventListener('mousedown', mouseDownEvent);
        canvasRef.current.removeEventListener('mousemove', mouseMoveEvent);
        canvasRef.current.removeEventListener('mouseup', mouseUpEvent);
    };

    const mouseMoveEvent = ({ offsetX, offsetY }) => {
        if (!startDrawing) return;
        const drawCoordinates = { from: { ...coordinates }, to: { x: offsetX, y: offsetY } };
        sendCoordinates({ ...drawCoordinates });
        draw({ ...drawCoordinates });
        coordinates = { x: offsetX, y: offsetY };
    };

    const mouseDownEvent = ({ offsetX, offsetY }) => {
        startDrawing = true;
        coordinates = { x: offsetX, y: offsetY };
        const drawCoordinates = {
            from: { x: offsetX, y: offsetY },
            to: { x: offsetX, y: offsetY },
        };
        sendCoordinates({ ...drawCoordinates });
        draw({ ...drawCoordinates });
    };

    const mouseUpEvent = () => {
        startDrawing = false;
    };

    const draw = ({ from, to, color, size, width, height }) => {
        width = width || canvasRef.current.width;
        height = height || canvasRef.current.height;
        color = color || canvasColor;
        size = size || fontSize;
        const [newFrom, newTo] = calculateRealCoordinates(from, to, width, height);
        if (!resizing) globalCoordinates.push({ from, to, color, size, width, height, size });

        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(newFrom.x, newFrom.y);
        ctx.quadraticCurveTo(newFrom.x, newFrom.y, newTo.x, newTo.y);
        ctx.stroke();
    };

    const calculateRealCoordinates = (from, to, width, height) => {
        if (!width || (width === canvasRef.current.width && height === canvasRef.current.height)) return [from, to];
        const newFrom = {
            x: (from.x * canvasRef.current.width) / width,
            y: (from.y * canvasRef.current.height) / height,
        };
        const newTo = {
            x: (to.x * canvasRef.current.width) / width,
            y: (to.y * canvasRef.current.height) / height,
        };
        return [newFrom, newTo];
    };

    useEffect(() => {
        if (!volumeActivated) return;
        if (reproduce) {
            if (reproduce === 'time') {
                playTime();
            } else if (reproduce === 'guessed') {
                playGuessed();
            } else if (reproduce === 'stopTime') {
                stop();
            } else if (reproduce === 'timeout') {
                stop();
                playTimeout();
            } else if (reproduce === 'join') {
                playJoin();
            } else if (reproduce === 'leave') {
                playLeave();
            }
            setReproduce(null);
        }
    }, [reproduce]);

    const startEventChooseWord = async (wordsToChoose) => {
        setShowModal(true);
        clearInterval(intervalEvent);
        let currentSeconds = 0;
        let interval = setInterval(() => {
            if (currentSeconds === MAX_SECONDS_CHOOSE_WORD) {
                handleChooseWord(wordsToChoose[Math.random() * words.length]);
                clearInterval(interval);
            }
            currentSeconds++;
        }, 1000);
        setIntervalEvent(interval);
    };

    const handleChooseWord = (word) => {
        setShowModal(false);
        clearInterval(intervalEvent);
        setIntervalEvent(null);
        socket.emit('startDrawing', { word, room, name: user.name });
    };

    const showDrawerIsChoosing = () => {
        setInteraction('userChoosing');
        setShowModal(true);
    };

    const setPaintMode = (mode) => {
        if (mode === 'draw') {
            canvasColor = previousColor;
        } else if (mode === 'erase') {
            canvasColor = '#FFF';
        }
    };

    const changeColor = (color) => {
        canvasColor = color;
        previousColor = color;
    };

    const sendMessage = (guess) => {
        socket.emit('guessWord', { user, guess, room });
    };

    const sendCoordinates = (coordinates) => {
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;
        coordinates = { ...coordinates, color: canvasColor, size: fontSize, width, height };
        socket.emit('sendDraw', {
            room,
            drawer: user.name,
            coordinates,
        });
    };

    const handleClear = () => {
        socket.emit('clearDraw', { room });
    };

    const handleUndo = () => {};

    const clearCanvas = () => {
        globalCoordinates = [];
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    return (
        <div className="wrapGameContent">
            <div className="gameContent">
                <div className="wrapLogo">
                    <Link to="/">
                        <div className="logo"></div>
                    </Link>
                </div>
                <div className="gameProgress">
                    <GameProgress time={time} encryptedWord={encryptedWord} />
                </div>
                <div className="inlineItems">
                    <div className="puntuationTable">
                        <Puntuation ref={puntuationRef} />
                    </div>
                    <div className="drawContainer">
                        <div className="wrapCanvas" ref={wrapCanvasRef}>
                            {/* <CanvasDraw
                                ref={canvasRef}
                                onChange={sendCoordinates}
                                brushRadius={fontSize}
                                hideGrid={true}
                                canvasHeight={wrapCanvasHeight}
                                canvasWidth={wrapCanvasWidth}
                                brushColor={canvasColor}
                                lazyRadius={0}
                                hideInterface={true}
                                immediateLoading={true}
                                disabled={!isDrawer}
                            /> */}
                            <canvas
                                width={wrapCanvasWidth}
                                height={wrapCanvasHeight}
                                ref={canvasRef}
                                style={{ backgroundColor: 'white', zIndex: 5, display: 'block' }}
                            ></canvas>
                            <CustomModal show={showModal} width={wrapCanvasWidth} height={wrapCanvasHeight}>
                                <ShowInteraction
                                    view={interaction}
                                    chooseWord={handleChooseWord}
                                    words={words}
                                    puntuation={roundPuntuation}
                                    finalPuntuation={finalPuntuation}
                                />
                            </CustomModal>
                        </div>
                        <CanvasControls
                            show={isDrawer}
                            changeColor={changeColor}
                            setPaintMode={setPaintMode}
                            setFontSize={(size) => (fontSize = size)}
                            goBack={handleUndo}
                            clear={handleClear}
                        />
                    </div>
                    <Chat sendMessage={sendMessage} placeholderMessage="Adivina el dibujo..." />
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    user: readUser(state),
    room: readRoom(state),
    isDrawer: readIsDrawer(state),
    drawerName: readDrawerName(state),
    guessed: readGuessed(state),
    actualWord: readActualWord(state),
    messages: readMessages(state),
    volumeActivated: readVolumeActivated(state),
});

export default connect(mapStateToProps, {
    setActualWord,
    setGuessed,
    setDrawerName,
    setIsDrawer,
    addMessage,
    resetGame,
    resetMessages,
    setCurrentRound,
    setMaxRound,
    setIsStarted,
    leaveRoom,
    sendPuntuation,
})(Game);
