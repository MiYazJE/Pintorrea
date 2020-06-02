import React, { useEffect, useState } from 'react';
import './gameProgress.scss';
import { connect } from "react-redux";
import { 
    readActualWord, readIsDrawer, 
    readCurrentRound, readMaxRound 
} from '../../Redux/Reducers/gameReducer';

const GameProgress = ({ socket, actualWord, isDrawer, currentRound, maxRound }) => {
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
            <div className="timeRoundWrap">
                <h1 className="time">{time}</h1>
                {time ? <span className="round">Ronda {currentRound} de {maxRound}</span> : null}
            </div>
            <div className="wrapWord">
                <h1 className="word">{isDrawer ? actualWord : encryptedWord}</h1>
            </div>
        </div>
    );

}

const mapStateToProps = state => {
    return { 
        actualWord  : readActualWord(state),
        isDrawer    : readIsDrawer(state),
        maxRound    : readMaxRound(state),
        currentRound: readCurrentRound(state)
    }
}

export default connect(mapStateToProps, { })(GameProgress);