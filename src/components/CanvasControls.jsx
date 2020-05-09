import React, { useState } from 'react';
import { Row, Col } from 'antd';
import { GithubPicker } from 'react-color';
import { FaEraser, FaPen } from 'react-icons/fa';
import { Radio, Tooltip, Slider } from 'antd';
import '../css/canvasControls.css';

const CanvasControls = ({ changeColor, setPaintMode }) => {

    return (
        <div style={{ height: '13%', backgroundColor: '#001529' }}>
            <Row justify="space-around" align="center">
                <Col span={4}>
                    <GithubPicker triangle="hide" onChange={({ hex }) => changeColor(hex)} /> 
                </Col>
                <Col span={4}>
                    <div className="wrapPaintModes">
                        <div className="icons">
                            <Radio.Group onChange={({target}) => setPaintMode(target.value)} defaultValue="lapiz">
                                <Tooltip title="Goma de borrar">
                                    <Radio.Button value="goma"> 
                                        <FaEraser />    
                                    </Radio.Button>
                                </Tooltip>
                                <Tooltip title="Lápiz">
                                    <Radio.Button value="lapiz">
                                        <FaPen />
                                    </Radio.Button>
                                </Tooltip>
                            </Radio.Group>
                        </div>
                        <span style={{ color: 'white', fontSize: '10px' }}>Grosor</span>
                        <Slider style={{ margin: '0' }} defaultValue={20} />
                    </div>
                </Col>
            </Row>
        </div>
    );

}

export default CanvasControls;