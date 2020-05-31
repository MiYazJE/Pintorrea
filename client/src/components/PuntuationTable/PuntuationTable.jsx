import React from 'react';
import './PuntuationTable.scss';
import { connect } from "react-redux";
import { readGame } from '../../Redux/Reducers/gameReducer';

const PuntuationTable = ({ users, game: { actualWord } }) => {

    return (
        <div className="wrapPuntuationTable">
            <span className="wordWas">La palabra era: {actualWord}</span>
            <div className="usersTable">
                {users ? users.map(user => (
                    <div key={user.name} className="userPuntuation">
                        <span className="name">{user.name}</span>
                        <span className="points">{user.puntuationRound}</span>
                    </div>
                )) : null}
            </div>
        </div>
    );

}

const mapStateToProps = state => {
    return { 
        game: readGame(state)
    }
}

export default connect(mapStateToProps, null)(PuntuationTable);