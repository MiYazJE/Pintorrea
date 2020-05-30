import React from 'react';
import { Button } from 'antd';
import './CustomModal.scss';

const CustomModal = ({ show, children }) => {

    return(
        <div className={`wrapModal ${show ? 'show' : 'hide'}`}>
            {children}
        </div>
    )

}

export default CustomModal;