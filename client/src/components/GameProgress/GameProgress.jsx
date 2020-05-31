import React, { useEffect, useState } from 'react';
import './gameProgress.scss';

const GameProgress = ({ socket, drawer, you, realWord }) => {
    const [time, setTime] = useState('');
    const [encryptedWord, setEncryptedWord] = useState('');

    useEffect(() => {
        socket.on('progress', ({ time, encryptedWord }) => {
            console.log(time, encryptedWord)
            setTime(time);
            setEncryptedWord(encryptedWord);
        })
    }, []);

    return(
        <div className="wrapGameProgress">
            <h1 className="time">{time}</h1>
            <div className="wrapContent">
                <h1 className="word">{drawer === you ? realWord : encryptedWord}</h1>
            </div>
        </div>
    );

}

export default GameProgress;