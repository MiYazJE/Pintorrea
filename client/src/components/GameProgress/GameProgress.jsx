import React from 'react';
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
import { toggleVolume } from '../../actions/userActions';
import { readVolumeActivated } from '../../reducers/userReducer';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';

const GameProgress = ({
    time,
    encryptedWord,
    actualWord,
    isDrawer,
    currentRound,
    maxRound,
    guessed,
    isStarted,
    volumeActivated,
    toggleVolume,
}) => {

    return (
        <div className="wrapGameProgress">
            {isStarted ? (
                <React.Fragment>
                    <div className="timeRoundWrap">
                        <h1 className="time">{time}</h1>
                        <span className="round">
                            Ronda {currentRound} de {maxRound}
                        </span>
                    </div>
                    <div className="wrapWord">
                        <h1 className="word">{isDrawer || guessed ? actualWord : encryptedWord}</h1>
                    </div>
                </React.Fragment>
            ) : null}
            <div className="wrapSoundLogo" onClick={toggleVolume}>
                {volumeActivated ? <FiVolume2 style={{color: 'white'}} size={30} /> : <FiVolumeX style={{color: 'white'}} size={30} />}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    actualWord: readActualWord(state),
    isDrawer: readIsDrawer(state),
    maxRound: readMaxRound(state),
    currentRound: readCurrentRound(state),
    guessed: readGuessed(state),
    isStarted: readIsStarted(state),
    volumeActivated: readVolumeActivated(state),
});

export default connect(mapStateToProps, { toggleVolume })(GameProgress);
