import React, { useEffect, useState } from 'react';
import './gameProgress.scss';
import { connect } from 'react-redux';
import {
    readActualWord,
    readIsDrawer,
    readCurrentRound,
    readMaxRound,
    readGuessed,
    readIsStarted,
} from '../../reducers/gameReducer';

const GameProgress = ({ time, encryptedWord, socket, actualWord, isDrawer, currentRound, maxRound, guessed, isStarted }) => {

    return isStarted ? (
        <div className="wrapGameProgress">
            <div className="timeRoundWrap">
                <h1 className="time">{time}</h1>
                <span className="round">
                    Ronda {currentRound} de {maxRound}
                </span>
            </div>
            <div className="wrapWord">
                <h1 className="word">{isDrawer || guessed ? actualWord : encryptedWord}</h1>
            </div>
        </div>
    ) : null;
};

const mapStateToProps = (state) => ({
    actualWord  : readActualWord(state),
    isDrawer    : readIsDrawer(state),
    maxRound    : readMaxRound(state),
    currentRound: readCurrentRound(state),
    guessed     : readGuessed(state),
    isStarted   : readIsStarted(state),
});

export default connect(mapStateToProps, {})(GameProgress);
