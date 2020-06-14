import React from 'react';
import ChooseWords from '../ChooseWords/ChooseWords';
import PuntuationTable from '../PuntuationTable/PuntuationTable';
import Results from './Results';
import { connect } from "react-redux";
import { readDrawerName, readCurrentRound } from '../../reducers/gameReducer';

const ShowInteraction = ({ currentRound, view, chooseWord, words, drawerName, puntuation, finalPuntuation }) => {

    switch(view) {
        case 'nextRound': 
            return (
                <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <h1 style={{color: 'white', textAlign: 'center'}}>
                        Ronda {currentRound}
                    </h1>
                </div> 
            ); 
        case 'userChoosing':
            return (
                <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <h1 style={{color: 'white', textAlign: 'center'}}>
                        {drawerName} esta escogiendo una palabra!
                    </h1>
                </div> 
            );
        case 'chooseWord':
            return (
                <ChooseWords words={words} chooseWord={chooseWord} />
            );
        case 'puntuationTable': 
            return (
                <PuntuationTable puntuation={puntuation} />
            );
        case 'showResults':
            return (
                <Results finalPuntuation={finalPuntuation} />
            );
        default:
            return null;
    }

}

const mapStateToProps = state => {
    return { 
        drawerName  : readDrawerName(state),
        currentRound: readCurrentRound(state)
    }
}

export default connect(mapStateToProps, {})(ShowInteraction);