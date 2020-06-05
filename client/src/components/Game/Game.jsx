import React, { useEffect, useState, useRef } from 'react';
import Chat from '../Chat/Chat';
import CanvasControls from '../CanvasControls/CanvasControls';
import Puntuation from '../Puntuation/Puntuation';
import CanvasDraw from 'react-canvas-draw';
import CustomModal from '../CustomModal/CustomModal';
import { connect } from 'react-redux';
import { readUser, readRoom } from '../../Redux/Reducers/UserReducer';
import {
    readIsDrawer,
    readMessages,
    readDrawerName,
    readGuessed,
    readActualWord,
} from '../../Redux/Reducers/gameReducer';
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
} from '../../Redux/Actions/gameActions';
import io from 'socket.io-client';
import './game.scss';
import GameProgress from '../GameProgress/GameProgress';
import ShowInteraction from './ShowInteraction';
import ResizeObserver from 'resize-observer-polyfill';

const ENDPOINT = '/socket-io';
const INITIAL_COLOR = '#000000';
const INITIAL_FONT_SIZE = 5;

const MAX_SECONDS_CHOOSE_WORD = 15;

let socket;

const Game = ({
    isDrawer,
    user,
    room,
    setActualWord,
    setGuessed,
    setDrawerName,
    setIsDrawer,
    resetGame,
    addMessage,
    setCurrentRound,
    setMaxRound,
    setIsStarted
}) => {
    const [roundPuntuation, setRoundPuntuation] = useState([]);
    const [finalPuntuation, setFinalPuntuation] = useState([]);
    const [interaction, setInteraction] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [intervalEvent, setIntervalEvent] = useState(null);
    const [words, setWords] = useState([]);
    const [coordinates, setCoordinates] = useState({});
    const [canvasColor, setCanvasColor] = useState(INITIAL_COLOR);
    const [previousColor, setPreviousColor] = useState(canvasColor);
    const [fontSize, setFontSize] = useState(INITIAL_FONT_SIZE);
    const [previousFontSize, setPreviousFontSize] = useState(fontSize);
    const [bucketPaint, setBucketPaint] = useState(false);
    const [wrapCanvasWidth, setWrapCanvasWidth] = useState(0);
    const [wrapCanvasHeight, setWrapCanvasHeight] = useState(0);
    const [canvasOberserver, setCanvasObserver] = useState(null);

    const wrapCanvasRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'z') {
                handleUndo();
            }
        });

        socket = io();
        socket.emit('joinRoom', { user, roomName: room });
        resetMessages();
    }, []);

    useEffect(() => {
        const observer = new ResizeObserver((entries, observer) => {
            const { width, height } = entries[0].contentRect;
            console.log(width, height);
            setWrapCanvasHeight(height);
            setWrapCanvasWidth(width);
        });
        observer.observe(wrapCanvasRef.current);

        return () => observer.unobserve(wrapCanvasRef.current);
    }, [wrapCanvasRef.current]);

    useEffect(() => {
        socket.on('message', (message) => {
            console.log(message);
            addMessage(message);
        });

        socket.on('chooseDrawer', async ({ drawer, words }) => {
            resetGame();
            setIsDrawer(drawer === user.name);
            setDrawerName(drawer);
            if (drawer !== user.name) {
                showDrawerIsChoosing(drawer);
                return;
            }
            setInteraction('chooseWord');
            setWords(words);
            startEventChooseWord(words);
        });

        socket.on('draw', ({ drawer, coordinates }) => {
            if (drawer === user.name) return;
            canvasRef.current.loadSaveData(coordinates);
        });

        socket.on('ready', ({ word, currentRound, maxRound }) => {
            canvasRef.current.clear();
            setIsStarted(true);
            setShowModal(false);
            setCurrentRound(currentRound);
            setMaxRound(maxRound);
            setActualWord(word);
        });

        socket.on('puntuationTable', ({ users, finalStatusMsg }) => {
            console.log(users);
            setRoundPuntuation({ users, finalStatusMsg });
            setInteraction('puntuationTable');
            setShowModal(true);
        });

        socket.on('setGuessed', () => setGuessed());

        socket.on('nextRound', ({ round }) => {
            setInteraction('nextRound');
            setCurrentRound(round);
        });

        socket.on('endGame', ({ users }) => {
            console.log(users);
            resetGame();
            setInteraction('showResults');
            setFinalPuntuation(users);
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
    };

    const handleChooseWord = (word) => {
        console.log(word);
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
            setCanvasColor(previousColor);
        } else if (mode === 'erase') {
            setCanvasColor('#FFF');
        } else if (mode === 'bucket') {
            setPreviousFontSize(fontSize);
            setFontSize(0);
            setBucketPaint(true);
            return;
        }
        setFontSize(previousFontSize);
        setBucketPaint(false);
    };

    const changeColor = (color) => {
        setCanvasColor(color);
        setPreviousColor(color);
    };

    const paintBucket = () => {
        console.log('painting with bucket...');
    };

    const sendMessage = (guess) => socket.emit('guessWord', { user, guess, room });

    const sendCoordinates = (canvas) => {
        if (!isDrawer) return;
        const coordinates = canvas.getSaveData();
        socket.emit('sendDraw', { drawer: user.name, coordinates, room });
    };

    const handleClear = () => {
        canvasRef.current.clear();
        sendCoordinates(canvasRef.current);
    };

    const handleUndo = () => {
        canvasRef.current.undo();
        sendCoordinates(canvasRef.current);
    };

    return (
        <div className="wrapGameContent">
            <div className="gameContent">
                <div className="gameProgress">{socket ? <GameProgress socket={socket} /> : null}</div>
                <div className="inlineItems">
                    <div className="puntuationTable">{socket ? <Puntuation socket={socket} room={room} /> : null}</div>
                    <div className="drawContainer">
                        <div className="wrapCanvas" ref={wrapCanvasRef}>
                            <CanvasDraw
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
                            />
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
                            setFontSize={setFontSize}
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
    user      : readUser(state),
    room      : readRoom(state),
    isDrawer  : readIsDrawer(state),
    drawerName: readDrawerName(state),
    guessed   : readGuessed(state),
    actualWord: readActualWord(state),
    messages  : readMessages(state),
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
    setIsStarted
})(Game);
