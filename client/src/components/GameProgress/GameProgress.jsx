import React, { useEffect, useState } from 'react';
import './gameProgress.scss';

const GameProgress = ({ socket }) => {
    const [time, setTime] = useState('');

    useEffect(() => {
        socket.on('time', ({ time }) => {
            setTime(time);
        })
    }, []);

    return(
        <div className="wrapGameProgress">
            <h1>{time}</h1>
        </div>
    );

}

export default GameProgress;