import React, { useState, useEffect } from 'react';
import { Spin, Avatar, Divider } from 'antd';
import Http from '../../Helpers/Http';
import './userProfile.scss';
import { AiFillCloseCircle } from 'react-icons/ai';

const UserProfile = ({ id, close }) => {

    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        setLoading(true);
        (async () => {
            const user = await Http.get(`/user/profile/${id}`);
            setUserData(user);
            setLoading(false);
        })();
    }, []);

    return (
        <div className="modal">
            {loading || !userData
                ?   <Spin className="loading" /> 
                :   
                    <div className="userProfile">
                        <AiFillCloseCircle onClick={close} className="close" />
                        <Avatar className="image" size={100} src={userData.picture} />
                        <h2>{userData.name}</h2>
                        <Divider />
                    </div>  
            }
        </div>
    )

}

export default UserProfile;