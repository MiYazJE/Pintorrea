import React from 'react';
import ChooseWords from '../ChooseWords/ChooseWords';
import PuntuationTable from '../PuntuationTable/PuntuationTable';
import { connect } from "react-redux";
import { readDrawerName } from '../../Redux/Reducers/gameReducer';

const ShowInteraction = ({ view, chooseWord, words, drawerName, users }) => {

    switch(view) {
        case 'userChoosing':
            return (
                <div key={drawerName} style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <h1 style={{color: 'white'}}>{drawerName} esta escogiendo una palabra!</h1>
                </div> 
            ) 
        case 'chooseWord':
            return (
                <ChooseWords words={words} chooseWord={chooseWord} />
            ) 
        case 'puntuationTable': 
            return (
                <PuntuationTable users={users} />
            )
        default:
            return null;
    }

}

const mapStateToProps = state => {
    return { 
        drawerName: readDrawerName(state)
    }
}

export default connect(mapStateToProps, {})(ShowInteraction);