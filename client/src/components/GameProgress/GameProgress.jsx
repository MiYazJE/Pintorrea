import React, { useEffect, useState } from 'react';
import './gameProgress.scss';
import { connect } from "react-redux";
import { 
    readActualWord, readIsDrawer, 
    readCurrentRound, readMaxRound,
    readGuessed
} from '../../Redux/Reducers/gameReducer';

const GameProgress = ({ socket, actualWord, isDrawer, currentRound, maxRound, guessed }) => {
    const [time, setTime] = useState(0);
    const [encryptedWord, setEncryptedWord] = useState('');
    
    useEffect(() => {
        socket.on('progress', ({ time, encryptedWord }) => {
            console.log(time, encryptedWord)
            setTime(time);
            setEncryptedWord(encryptedWord);
        });
    }, []);
    
    return(
        <div className="wrapGameProgress">
            <div className="timeRoundWrap">
                <h1 className="time">{time}</h1>
                <span className="round">Ronda {currentRound} de {maxRound}</span>
            </div>
            <div className="wrapWord">
                <h1 className="word">{isDrawer || guessed ? actualWord : encryptedWord}</h1>
            </div>
        </div>
    );

}

const mapStateToProps = state => {
    return { 
        actualWord  : readActualWord(state),
        isDrawer    : readIsDrawer(state),
        maxRound    : readMaxRound(state),
        currentRound: readCurrentRound(state),
        guessed     : readGuessed(state)
    }
}

export default connect(mapStateToProps, { })(GameProgress);