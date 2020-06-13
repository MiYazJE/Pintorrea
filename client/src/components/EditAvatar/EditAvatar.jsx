import React, { useRef } from 'react';
import AvatarCustomizer from '../AvatarCustomizer/AvatarCustomizer';
import { notification, Button } from 'antd';
import { connect } from 'react-redux';
import { uploadPicture, uploadAvatar } from '../../actions/userActions';
import { readImage, readName, readID, readAvatar } from '../../reducers/userReducer';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import './editAvatar.scss';

const EditAvatar = ({ picture, uploadPicture, name, id, uploadAvatar, avatar }) => {
    const refAvatar = useRef(null);

    const handleSaveAvatar = () => {
        const { indexes: avatar } = refAvatar.current.save();
        uploadAvatar(
            { avatar, id },
            (msg) => notification.success({ message: msg, duration: 5 }),
            (msg) => notification.error({ message: msg, duration: 5 })
        );
    };

    const handleRandomGenerator = () => {
        refAvatar.current.generateRandomly();
    }

    return (
        <div className="wrapProfile">
            <h1>{name}</h1>
            <AvatarCustomizer ref={refAvatar} onSave={handleSaveAvatar} initIndexes={{ ...avatar }} />
            <div className="wrapButtons">
                <Button onClick={handleSaveAvatar}>Guardar avatar</Button>
                <Button
                    style={{marginLeft: '10px'}}  
                    icon={<GiPerspectiveDiceSixFacesRandom />} 
                    onClick={handleRandomGenerator}>
                </Button>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    id: readID(state),
    name: readName(state),
    picture: readImage(state),
    avatar: readAvatar(state),
});

export default connect(mapStateToProps, { uploadPicture, uploadAvatar })(EditAvatar);
