import React, { useState } from "react";
import { Upload, message, Tooltip } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { connect } from 'react-redux';
import { uploadPicture } from '../../Redux/Actions/UserActions';
import { readImage, readName, readID } from '../../Redux/Reducers/UserReducer';
import "./profile.scss";

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('Solo puedes subir ficheros jpeg y png!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('La imágen no debe superar 2mb!');
    }
    return isJpgOrPng && isLt2M;
}

const Profile = ({ picture, uploadPicture, name, id }) => {

    const handleChange = info => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, async (image) => {
                uploadPicture(image, id, () => {
                    message.success('La imágen ha sido actualizada');
                });
            });
        }
    };

    return (
        <div className="wrapProfile">
            <Upload
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
            </Upload>
            <h2>{name}</h2>
        </div>
    );
}

const mapStateToProps = (state) => ({
    name   : readName(state),
    id     : readID(state),
    picture: readImage(state),
});

export default connect(mapStateToProps, { uploadPicture })(Profile);