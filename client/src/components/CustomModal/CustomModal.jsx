import React from 'react';
import { Button } from 'antd';
import './CustomModal.scss';

const CustomModal = ({ show, children, height, width }) => {

    console.log(width, height);
    return(
        <div 
            style={{ width: `${width}px`, height: `${height}px` }}    
            className={`wrapModal ${show ? 'show' : 'hide'}`}
        >
            {children}
        </div>
    )

}

export default CustomModal;