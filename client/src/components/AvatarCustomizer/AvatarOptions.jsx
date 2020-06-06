import React, { useState } from 'react';
import options from './options';
import { Button } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useEffect } from 'react';


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
    'Accesorios',
    'Color del pelo',
    'Barba',
    'Tipo de ropa',
    'Color de la ropa',
    'Ojos',
    'Cejas',
    'Boca',
    'Color de la piel'
];

const AvatarOptions = ({ selectors }) => {

    const [indexes, setIndexes] = useState({});

    useEffect(() => {
        const obj = {};
        Object.keys(selectors).map(key => obj[key] = 0); 
        setIndexes(obj);
    }, []);

    const handleChangeOption = (selector, plus) => {
        const setState = selectors[selector];
        const index = indexes[selector];
        const maxIndex = options[selector].length;
        let newIndex = parseInt((index + plus) % maxIndex);
        if (newIndex < 0) newIndex = maxIndex - 1;
        console.log(index, newIndex)
        indexes[selector] = newIndex;
        setIndexes(indexes);
        setState([options[selector][newIndex], newIndex]);
    }

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