import React, { useState, useEffect } from 'react';
import { Spin, Avatar, Tooltip } from 'antd';
import Http from '../../Helpers/Http';
import './userProfile.scss';
import { AiFillCloseCircle } from 'react-icons/ai';

const UserProfile = ({ id, close }) => {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [ranking, setRanking] = useState(null);

    useEffect(() => {
        setLoading(true);
        (async () => {
            const { user, ranking } = await Http.get(`/user/profile/${id}`);
            console.log(ranking);
            setUserData(user);
            setRanking(ranking);
            setLoading(false);
        })();
    }, []);

    return (
        <div className="modal">
            {loading || !userData ? (
                <Spin className="loading" />
            ) : (
                <div className="userProfile">
                    <AiFillCloseCircle onClick={close} className="close" />
                    <Avatar className="image" size={100} src={userData.picture} />
                    <h2>{userData.name}</h2>
                    <div className="wrapVictories">
                        <div>
                            <Tooltip title="Oro">
                                <span className="gold">🥇</span>
                            </Tooltip>
                            {ranking.goldVictories}
                        </div>
                        <div>
                            <Tooltip title="Plata">
                                <span className="silver">🥈</span>
                            </Tooltip>
                            {ranking.silverVictories}
                        </div>
                        <div>
                            <Tooltip title="Bronce">
                                <span className="bronze">🥉</span>
                            </Tooltip>
                            {ranking.bronzeVictories}
                        </div>
                    </div>
                    <span>Partidas jugadas: {ranking.totalGames}</span>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
