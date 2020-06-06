import React, { useState } from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

const AvatarOption = ({ title, selector, changeOption }) => {
    return(
        <div className="wrapOption">
            <div className="option">
                <Button 
                    type="primary"
                    shape="circle"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => changeOption(selector, -1)} 
                />
                <span>{title}</span>
                <Button 
                    type="primary" 
                    shape="circle" 
                    icon={<ArrowRightOutlined />} 
                    onClick={() => changeOption(selector, 1)} 
                />
            </div>
        </div>
    );
}

const titles = [
    'Cabeza',
    'Ojos',
    'Color del pelo',
    'Boca',
    'Color de la piel',
    'Tipo de ropa',
    'Color de la ropa',
    'Cejas',
    'Barba',
    'Gafas'
];

const AvatarOptions = ({ selectors, handleChangeOption }) => {
    return(
        <div className="wrapAvatarOptions">
            {Object.keys(selectors).map((selector, index) => (
                <AvatarOption 
                    key={selector} 
                    selector={selector}  
                    changeOption={handleChangeOption}
                    title={titles[index]}
                />
            ))}
        </div>
    );
}

export default AvatarOptions;