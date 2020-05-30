import React from 'react';
import { Button } from 'antd';
import './ChooseWords.scss';

const ChooseWords = ({ words, chooseWord }) => {
    return(
        <div className="wrapWords">
            <h1 className="title">Escoge una palabra</h1>
            <div className="words">
                {words ? words.map(word => (
                    <Button type="primary" onClick={() => chooseWord(word)}>
                        {word}
                    </Button>
                )) : null}
            </div>
        </div>
    );

}

export default ChooseWords;