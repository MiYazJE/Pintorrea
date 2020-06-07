import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Avatar from 'avataaars';
import AvatarOptions from './AvatarOptions';
import './avatarCustomizer.scss';
import options from './options';

const URL_IMG = 'https://avataaars.io/';

const AvatarCustomizer = forwardRef(({ onSave, initIndexes, onlyAvatar }, ref) => {
    const [indexes, setIndexes] = useState(initIndexes);
    const [topType, setTopType] = useState('LongHairMiaWallace');
    const [eyeType, setEyeType] = useState('Happy');
    const [hairColor, setHairColor] = useState('BrownDark');
    const [mouthType, setMouthType] = useState('Smile');
    const [skinColor, setSkinColor] = useState('Light');
    const [clotheType, setClotheType] = useState('Hoodie');
    const [avatarStyle, setAvatarStyle] = useState('Circle');
    const [clotheColor, setClotheColor] = useState('PastelBlue');
    const [eyebrowType, setEyebrowType] = useState('Default');
    const [facialHairType, setFacialHairType] = useState('Blank');
    const [accessoriesType, setAccessoriesType] = useState('Prescription02');

    const selectors = {
        topType: [topType, setTopType],
        eyeType: [eyeType, setEyeType],
        hairColor: [hairColor, setHairColor],
        mouthType: [mouthType, setMouthType],
        skinColor: [skinColor, setSkinColor],
        clotheType: [clotheType, setClotheType],
        clotheColor: [clotheColor, setClotheColor],
        eyebrowType: [eyebrowType, setEyebrowType],
        avatarStyle: [avatarStyle, setAvatarStyle],
        facialHairType: [facialHairType, setFacialHairType],
        accessoriesType: [accessoriesType, setAccessoriesType],
    };

    useEffect(() => {
        if (indexesAreEmpty()) {
            const obj = {};
            Object.keys(selectors).forEach((key) => (obj[key] = 0));
            setIndexes(obj);
        } else {
            initSelectedIndexes();
        }
    }, []);

    const indexesAreEmpty = () => Object.keys(indexes).length === 0;

    const initSelectedIndexes = () => {
        for (const key of Object.keys(indexes)) {
            const index = indexes[key];
            const selected = options[key][index];
            selectors[key][1](selected);
        }
    };

    const handleChangeOption = (selector, plus) => {
        const [_, setState] = selectors[selector];
        const index = indexes[selector];
        const maxIndex = options[selector].length;
        let newIndex = parseInt((index + plus) % maxIndex);
        if (newIndex < 0) newIndex = maxIndex - 1;
        indexes[selector] = newIndex;
        setIndexes(indexes);
        setState(options[selector][newIndex]);
    };

    const generateRandomly = () => {
        console.log('random generator avatar...');
    };

    const save = () => {
        const imageUrl = getUrlImage();
        return { imageUrl, indexes };
    };

    useImperativeHandle(ref, () => ({
        save,
        generateRandomly
    }));

    const getUrlImage = () => {
        let url = URL_IMG + '?';
        Object.keys(selectors).forEach((key, index) => {
            url += `${key}=${selectors[key][0]}`;
            if (index < Object.keys(selectors).length - 1) url += '&';
        });
        return url;
    };

    return (
        <div className="wrapAvatar">
            <div className="avatar">
                <Avatar
                    style={{ width: '100%', height: '100%' }}
                    avatarStyle={avatarStyle}
                    topType={topType}
                    accessoriesType={accessoriesType}
                    hairColor={hairColor}
                    facialHairType={facialHairType}
                    clotheType={clotheType}
                    clotheColor={clotheColor}
                    eyeType={eyeType}
                    eyebrowType={eyebrowType}
                    mouthType={mouthType}
                    skinColor={skinColor}
                />
            </div>
            {onlyAvatar ? null : (
                <div className="wrapAvatarCustomizer">
                    <AvatarOptions selectors={selectors} handleChangeOption={handleChangeOption} />
                </div>
            )}
        </div>
    );
});

export default AvatarCustomizer;
