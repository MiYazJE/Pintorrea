import React, { useState, useEffect, useRef } from 'react';
import AvatarCustomizer from '../AvatarCustomizer/AvatarCustomizer';
import { Upload, notification, Button } from 'antd';
import { connect } from 'react-redux';
import { readAvatar, readID, readName, readImage, readImageType } from '../../reducers/userReducer';
import { uploadPicture, uploadAvatarImage } from '../../actions/userActions';
import './editProfile.scss';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        notification.error({ message: 'Solo puedes subir archivos JPG/PNG!', duration: 5 });
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        notification.error({ message: 'La imágen pesa más de 2mb!', duration: 5 });
    }
    return isJpgOrPng && isLt2M;
}

const EditProfile = ({ avatar, id, name, picture, imageType, uploadPicture, uploadAvatarImage }) => {
    const [imageSelected, setImageSelected] = useState(false);
    const [avatarSelected, setAvatarSelected] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(picture);
    const refAvatar = useRef();

    useEffect(() => {
        setImageSelected(imageType === 'image');
        setAvatarSelected(imageType === 'avatar');
    }, []);

    const handleChangeImage = (info) => {
        if (info.file.status === 'uploading') {
            
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (imageUrl) => setImageUploaded(imageUrl));
        }
    };

    const handleSelectImage = () => {
        uploadPicture(imageUploaded, id, () => {
            notification.success({ message: 'Ahora tienes tu imagen seleccionada!', duration: 5 });
            if (!imageSelected) {
                toggleSelectedButtons()
            }
        });
    };

    const handleSelectAvatar = () => {
        const { imageUrl } = refAvatar.current.save();
        uploadAvatarImage(
            { imageUrl, id },
            (msg, picture) => {
                notification.success({ message: msg, duration: 5 })
                setImageUploaded(picture)
                if (!avatarSelected)
                    toggleSelectedButtons();
            },  
            (msg) => notification.error({ message: msg, duration: 5 }),  
        );
    };

    const toggleSelectedButtons = () => {
        setImageSelected(!imageSelected);
        setAvatarSelected(!avatarSelected);
    };

    return (
        <div className="wrapEditProfile">
            <h1>{name}</h1>
            <div className="wrapImages">
                <div className="avatar">
                    <AvatarCustomizer ref={refAvatar} initIndexes={{ ...avatar }} onlyAvatar={true} />
                    <Button type={avatarSelected ? 'primary' : null} onClick={handleSelectAvatar}>
                        Utiliza tu avatar como imagen
                    </Button>
                </div>
                <div className="profileImage">
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        beforeUpload={beforeUpload}
                        onChange={handleChangeImage}
                    >
                        <img src={imageUploaded} alt="avatar" />
                    </Upload>
                    <Button type={imageSelected ? 'primary' : null} onClick={() => handleSelectImage()}>
                        Utiliza tu propia imagen
                    </Button>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    id: readID(state),
    avatar: readAvatar(state),
    name: readName(state),
    picture: readImage(state),
    imageType: readImageType(state),
});

export default connect(mapStateToProps, { uploadPicture, uploadAvatarImage })(EditProfile);
