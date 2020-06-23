import React from 'react';
import { CirclePicker } from 'react-color';
import { FaEraser, FaPen } from 'react-icons/fa';
import { IoIosUndo } from 'react-icons/io';
import { AiFillDelete } from 'react-icons/ai';
import { GiPaintBucket } from 'react-icons/gi';
import { Radio, Tooltip, Slider, Button } from 'antd';
import './canvasControls.scss';
import COLORS from './colors.js';
console.log(COLORS)

const CanvasControls = ({ changeColor, setPaintMode, setFontSize, goBack, clear, show }) => {
    return (
        <div className="wrapControls">
            {show ? (
                <React.Fragment>
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
                                <Tooltip title="Cubo de pintura">
                                    <Radio.Button value="bucket">
                                        <GiPaintBucket />
                                    </Radio.Button>
                                </Tooltip>
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
                            {/* <Tooltip title="Atrás">
                                <Button shape="circle" icon={<IoIosUndo />} onClick={goBack}></Button>
                            </Tooltip> */}
                            <Tooltip title="Limpiar">
                                <Button
                                    shape="circle"
                                    icon={<AiFillDelete style={{ color: 'red' }} />}
                                    onClick={clear}
                                ></Button>
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
                </React.Fragment>
            ) : null}
        </div>
    );
};

export default CanvasControls;
