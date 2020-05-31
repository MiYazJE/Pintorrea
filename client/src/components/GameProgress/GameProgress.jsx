import React, { useEffect, useState } from 'react';
import './gameProgress.scss';
import { connect } from "react-redux";
import { readUser } from '../../Redux/Reducers/UserReducer';
import { readGame } from '../../Redux/Reducers/gameReducer';
const GameProgress = ({ socket, user, game: { actualWord, drawerName } }) => {
    const [time, setTime] = useState('');
    const [encryptedWord, setEncryptedWord] = useState('');
    
    useEffect(() => {
        socket.on('progress', ({ time, encryptedWord }) => {
            console.log(time, encryptedWord)
            setTime(time);
            setEncryptedWord(encryptedWord);
        })
    }, []);
    
    const you = user.name;
    return(
        <div className="wrapGameProgress">
            <h1 className="time">{time}</h1>
            <div className="wrapContent">
                <h1 className="word">{drawerName === you ? actualWord : encryptedWord}</h1>
            </div>
        </div>
    );

}

const mapStateToProps = state => {
    return { 
        user: readUser(state), 
        game: readGame(state)
    }
}

export default connect(mapStateToProps, { readGame })(GameProgress);