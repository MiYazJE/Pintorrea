import React from "react";
import AvatarCustomizer from '../AvatarCustomizer/AvatarCustomizer';
import { notification } from "antd";
import { connect } from 'react-redux';
import { uploadPicture, uploadAvatar } from '../../Redux/Actions/UserActions';
import { readImage, readName, readID, readAvatar } from '../../Redux/Reducers/UserReducer';
import "./profile.scss";

const Profile = ({ picture, uploadPicture, name, id, uploadAvatar, avatar }) => {

    const handleSaveAvatar = async (avatar, imageUrl) => {
        uploadAvatar({ avatar, id, imageUrl }, (msg) => {
            notification.success({ message: msg, duration: 8 });
        });
    }

    return (
        <div className="wrapProfile">
            <h1>{name}</h1>
            {/* <Upload
                name="avatar"
                listType="picture"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={handleChange}
            >
                <Tooltip placement="right" style={{color: 'white'}} title="Cambiar imágen">
                    <img src={picture} alt="avatar" style={{ width: '100px' }} />
                </Tooltip>
            </Upload> */}
            <AvatarCustomizer onSave={handleSaveAvatar} initIndexes={avatar} />
        </div>
    );
}

const mapStateToProps = (state) => ({
    id     : readID(state),
    name   : readName(state),
    picture: readImage(state),
    avatar : readAvatar(state),
});

export default connect(mapStateToProps, { uploadPicture, uploadAvatar })(Profile);