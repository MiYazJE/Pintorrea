import React, { useState } from "react";
import "../css/profile.css";
import { Upload, message, Tooltip } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import Http from '../Helpers/Http';
import { connect } from 'react-redux';
import { logUser } from '../Redux/Actions/UserActions';

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

const Profile = ({ user, logUser }) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(user.picture);

    const handleChange = info => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, async (picture) => {
                const newUser = await Http.post({ picture, id: user.id }, '/user/uploadPicture');
                message.success('La imágen ha sido actualizada');
                setLoading(false);
                setImageUrl(picture);
            });
        }
    };

    const uploadButton = (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div className="ant-upload-text">Upload</div>
        </div>
    );

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
                    <img src={imageUrl} alt="avatar" style={{ width: '100px' }} />
                </Tooltip>
            </Upload>
            <h2>{user.name}</h2>
        </div>
    );
}

export default connect(null, { logUser })(Profile);