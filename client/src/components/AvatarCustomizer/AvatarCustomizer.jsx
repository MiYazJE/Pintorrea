import React, { useState, useEffect } from 'react';
import Avatar from 'avataaars';
import AvatarOptions from './AvatarOptions';
import './avatarCustomizer.scss';
import { Button } from 'antd';
import options from './options';

const AvatarCustomizer = ({ onSave, initIndexes }) => {
    const [indexes, setIndexes]                 = useState(initIndexes);
    const [topType, setTopType]                 = useState(['LongHairMiaWallace', 0]);
    const [eyeType, setEyeType]                 = useState(['Happy', 0]);
    const [hairColor, setHairColor]             = useState(['BrownDark', 0]);
    const [mouthType, setMouthType]             = useState(['Smile', 0]);
    const [skinColor, setSkinColor]             = useState(['Light', 0]);
    const [clotheType, setClotheType]           = useState(['Hoodie', 0]);
    const [avatarStyle, setAvatarStyle]         = useState(['Circle', 0]);
    const [clotheColor, setClotheColor]         = useState(['PastelBlue', 0]);
    const [eyebrowType, setEyebrowType]         = useState(['Default', 0]);
    const [facialHairType, setFacialHairType]   = useState(['Blank', 0]);
    const [accessoriesType, setAccessoriesType] = useState(['Prescription02', 0]);

    const selectors = {
        topType        : [topType, setTopType],
        eyeType        : [eyeType, setEyeType],
        hairColor      : [hairColor, setHairColor],
        mouthType      : [mouthType, setMouthType],
        skinColor      : [skinColor, setSkinColor],
        clotheType     : [clotheType, setClotheType],
        clotheColor    : [clotheColor, setClotheColor],
        eyebrowType    : [eyebrowType, setEyebrowType],
        facialHairType : [facialHairType, setFacialHairType],
        accessoriesType: [accessoriesType, setAccessoriesType],
    };

    useEffect(() => {
        if (!indexes) {
            const obj = {};
            Object.keys(selectors).map(key => obj[key] = 0); 
            setIndexes(obj);
        }
        else {
            for (const key of Object.keys(initIndexes)) {
                const index = initIndexes[key];
                const selected = options[key][index]; 
                selectors[key][1]([selected, index]);
            }
        }
    }, []);

    const handleChangeOption = (selector, plus) => {
        const [getState, setState] = selectors[selector];
        const index = indexes[selector];
        const maxIndex = options[selector].length;
        let newIndex = parseInt((index + plus) % maxIndex);
        if (newIndex < 0) newIndex = maxIndex - 1;
        indexes[selector] = newIndex;
        setIndexes(indexes);
        setState([options[selector][newIndex], newIndex]);
    }

    const handleRandomGenerator = () => {

    }

    const handleSaveAvatar = () => {
        if (typeof onSave === 'function') onSave(indexes);
    }

    return (
        <div className="wrapAvatar">
            <div className="avatar">
                <Avatar
                    style={{ width: '100%', height: '100%' }}
                    avatarStyle={avatarStyle[0]}
                    topType={topType[0]}
                    accessoriesType={accessoriesType[0]}
                    hairColor={hairColor[0]}
                    facialHairType={facialHairType[0]}
                    clotheType={clotheType[0]}
                    clotheColor={clotheColor[0]}
                    eyeType={eyeType[0]}
                    eyebrowType={eyebrowType[0]}
                    mouthType={mouthType[0]}
                    skinColor={skinColor[0]}
                />
            </div>
            <div className="wrapAvatarCustomizer">
                <AvatarOptions 
                    selectors={selectors}
                    handleChangeOption={handleChangeOption}
                />
            </div>
            <div className="wrapButtons">
                <Button onClick={handleSaveAvatar}>
                    Guardar avatar
                </Button>
                <Button onClick={handleRandomGenerator}>
                    Generar aleatoriamente
                </Button>
            </div>
        </div>
    );
};

export default AvatarCustomizer;
