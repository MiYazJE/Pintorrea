import React, { useEffect, useState, useRef } from 'react';
import Chat from '../Chat/Chat';
import CanvasControls from '../CanvasControls/CanvasControls';
import Puntuation from '../Puntuation/Puntuation';
import CanvasDraw from 'react-canvas-draw';
import CustomModal from '../CustomModal/CustomModal';
import { connect, useDispatch } from 'react-redux';
import { leaveRoom, sendPuntuation } from '../../actions/userActions';
import { readUser, readRoom, readVolumeActivated } from '../../reducers/userReducer';
import {
    readIsDrawer,
    readMessages,
    readDrawerName,
    readGuessed,
    readActualWord,
} from '../../reducers/gameReducer';
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
    setIsStarted
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
    volumeActivated
}) => {
    const [roundPuntuation, setRoundPuntuation] = useState([]);
    const [finalPuntuation, setFinalPuntuation] = useState([]);
    const [interaction, setInteraction] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [intervalEvent, setIntervalEvent] = useState(null);
    const [words, setWords] = useState([]);
    const [canvasColor, setCanvasColor] = useState(INITIAL_COLOR);
    const [previousColor, setPreviousColor] = useState(canvasColor);
    const [fontSize, setFontSize] = useState(INITIAL_FONT_SIZE);
    const [previousFontSize] = useState(fontSize);
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

        resetMessages();
        socket = io();
        socket.emit('joinRoom', { user, roomName: room });
    }, []);

    useEffect(() => {
        const observer = new ResizeObserver((entries, observer) => {
            const { width, height } = entries[0].contentRect;
            setWrapCanvasHeight(height);
            setWrapCanvasWidth(width);
        });
        observer.observe(wrapCanvasRef.current);

        return () => observer.unobserve(wrapCanvasRef.current);
    }, [wrapCanvasRef.current]);

    useEffect(() => {
        if (!user.room) return history.push('/');
        socket.on('message', (message) => {
            if (message.reproduceSound) {
                setReproduce(message.reproduceSound);
            }
            else if (message.userLeft) {
                setReproduce('leave');
            }
            else if (message.userJoin) {
                setReproduce('join');
            }
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

    useEffect(() => {
        if (!volumeActivated) return;
        if (reproduce) {
            if (reproduce === 'time') {
                playTime();
            }
            else if (reproduce === 'guessed') {
                playGuessed();
            }
            else if (reproduce === 'stopTime') {
                stop();
            } 
            else if (reproduce === 'timeout') {
                stop();
                playTimeout();
            }
            else if (reproduce === 'join') {
                playJoin();
            }
            else if (reproduce === 'leave') {
                playLeave();
            }
            setReproduce(null);
        }
    }, [reproduce])

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
            setCanvasColor(previousColor);
        } else if (mode === 'erase') {
            setCanvasColor('#FFF');
        }
        setFontSize(previousFontSize);
    };

    const changeColor = (color) => {
        setCanvasColor(color);
        setPreviousColor(color);
    };

    const sendMessage = (guess) => {
        socket.emit('guessWord', { user, guess, room })
    };

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
                <div className="wrapLogo"><Link to="/"><div className="logo"></div></Link></div>
                <div className="gameProgress"><GameProgress time={time} encryptedWord={encryptedWord}  /></div>
                <div className="inlineItems">
                    <div className="puntuationTable"><Puntuation ref={puntuationRef} /></div>
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
    user: readUser(state),
    room: readRoom(state),
    isDrawer: readIsDrawer(state),
    drawerName: readDrawerName(state),
    guessed: readGuessed(state),
    actualWord: readActualWord(state),
    messages: readMessages(state),
    volumeActivated: readVolumeActivated(state)
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
    sendPuntuation
})(Game);
