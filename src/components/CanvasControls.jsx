import React, { useState } from 'react';
import { CirclePicker } from 'react-color';
import { FaEraser, FaPen } from 'react-icons/fa';
import { IoIosUndo } from 'react-icons/io';
import { AiFillDelete } from 'react-icons/ai';
import { Radio, Tooltip, Slider, Button } from 'antd';
import '../css/canvasControls.css';

const COLORS = [
    '#4D4D4D', '#999999', '#FFFFFF', '#F44E3B', '#FE9200', 
    '#FCDC00', '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', 
    '#AEA1FF', '#FDA1FF', '#333333', '#808080', '#cccccc', 
    '#D33115', '#E27300', '#FCC400', '#B0BC00', '#68BC00', 
    '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF', '#000000', 
    '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00', 
    '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', 
    '#AB149E'
];

const CanvasControls = ({ changeColor, setPaintMode, setFontSize, goBack, clear }) => {

    return (
        <div className="wrapControls">
            <div className="wrapColorPalette">
                <p style={{ textAlign: 'center' }}>Paleta de colores</p>
                <CirclePicker 
                    colors={COLORS} 
                    width={650} 
                    circleSize={20} 
                    triangle="hide" 
                    onChange={({ hex }) => changeColor(hex)} 
                />
            </div>
            <div className="wrapPaintModes">
                <div className="icons">
                    <Radio.Group onChange={({ target }) => setPaintMode(target.value)} defaultValue="draw">
                        <Tooltip title="Goma de borrar">
                            <Radio.Button value="erase">
                                <FaEraser />
                            </Radio.Button>
                        </Tooltip>
                        <Tooltip title="Lápiz">
                            <Radio.Button value="draw">
                                <FaPen />
                            </Radio.Button>
                        </Tooltip>
                    </Radio.Group>
                    <Tooltip title="Atrás">
                        <Button 
                            shape="circle" 
                            icon={<IoIosUndo />}
                            onClick={goBack}
                        >
                        </Button>
                    </Tooltip>
                    <Tooltip title="Limpiar">
                        <Button 
                            shape="circle" 
                            icon={<AiFillDelete style={{color: 'red'}} />}
                            onClick={clear}
                        >
                        </Button>
                    </Tooltip>
                </div>
                <span style={{ margin: '5px 0px', textAlign: 'center' }}>Grosor</span>
                <Slider 
                    min={1}
                    max={20}
                    style={{ margin: '0' }} 
                    defaultValue={12} 
                    onChange={(value) => setFontSize(value)}
                />
            </div>
        </div>
    );

}

export default CanvasControls;