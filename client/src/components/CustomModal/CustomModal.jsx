import React from 'react';
import './CustomModal.scss';

const CustomModal = ({ show, children, height, width }) => {
    return (
        <div style={{ width: `${width}px`, height: `${height}px` }} className={`wrapModal ${show ? 'show' : 'hide'}`}>
            {children}
        </div>
    );
};

export default CustomModal;
