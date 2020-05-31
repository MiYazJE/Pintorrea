import React, { useEffect, useState } from 'react';
import './gameProgress.scss';

const GameProgress = ({ socket, drawer, you, word }) => {
    const [time, setTime] = useState('');

    useEffect(() => {
        socket.on('time', ({ time }) => {
            setTime(time);
        })
    }, []);

    return(
        <div className="wrapGameProgress">
            <h1 className="time">{time}</h1>
            <div className="wrapContent">
                <h1 className="word">{word.toUpperCase()}</h1>
            </div>
        </div>
    );

}

export default GameProgress;