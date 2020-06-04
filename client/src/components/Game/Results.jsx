import React from 'react';
import UserAvatar from '../UsersAvatars/UserAvatar';

const Results = ({ finalPuntuation }) => {

    let avatarSize = 100;

    function decrementSizeAvatar() {
        avatarSize -= 10; 
    }

    const getRankColor = (rank) => {
        if (rank === 1) {
            return '#FFD700'
        }
        if (rank === 2) {
            return '#BEBEBE';
        }
        if (rank === 3) {
            return '#CD7F32';    
        }
    }

    console.log(finalPuntuation);
    return(
        <div className="wrap-result">
            <h1>Resultados</h1>            
            <div className="puntuation">
                {finalPuntuation.map((player, index) => (
                    <div key={player.id} className="player">
                        <UserAvatar size={avatarSize} {...player} />
                        <span className="rank" style={{ color: getRankColor(index + 1) }}>
                            # {index + 1}
                        </span>
                        {decrementSizeAvatar()}
                    </div>
                ))}
            </div>
        </div>
    );

}

export default Results;