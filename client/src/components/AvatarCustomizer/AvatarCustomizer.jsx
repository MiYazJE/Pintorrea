import React, { useState } from 'react';
import Avatar from 'avataaars';
import AvatarOptions from './AvatarOptions';
import './avatarCustomizer.scss';

const AvatarCustomizer = () => {
    const [avatarStyle, setAvatarStyle] = useState(['Circle', 0]);
    const [topType, setTopType] = useState(['LongHairMiaWallace', 0]);
    const [accessoriesType, setAccessoriesType] = useState(['Prescription02', 0]);
    const [hairColor, setHairColor] = useState(['BrownDark', 0]);
    const [facialHairType, setFacialHairType] = useState(['Blank', 0]);
    const [clotheType, setClotheType] = useState(['Hoodie', 0]);
    const [clotheColor, setClotheColor] = useState(['PastelBlue', 0]);
    const [eyeType, setEyeType] = useState(['Happy', 0]);
    const [eyebrowType, setEyebrowType] = useState(['Default', 0]);
    const [mouthType, setMouthType] = useState(['Smile', 0]);
    const [skinColor, setSkinColor] = useState(['Light', 0]);
    const [selectors, setSelectors] = useState({
        topType: setTopType,
        accessoriesType: setAccessoriesType,
        hairColor: setHairColor,
        facialHairType: setFacialHairType,
        clotheType: setClotheType,
        clotheColor: setClotheColor,
        eyeType: setEyeType,
        eyebrowType: setEyebrowType,
        mouthType: setMouthType,
        skinColor: setSkinColor,
    });
    
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
            <div className="wrapUserCustomizer">
                <AvatarOptions 
                    selectors={selectors}
                />
            </div>
        </div>
    );
};

export default AvatarCustomizer;
