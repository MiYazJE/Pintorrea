import React, { useEffect, useState, useRef } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import { Layout } from 'antd';
import Chat from './Chat';
import CanvasControls from './CanvasControls';
import CanvasDraw from "react-canvas-draw";
import { connect } from "react-redux";
import { readUser } from '../Redux/Reducers/UserReducer';
import { Row, Col } from 'antd';
import '../css/game.css';

const { Content } = Layout;

const Game = ({ user }) => {

    const [canvasColor, setCanvasColor] = useState('#000000');
    const [previousColor, setPreviousColor] = useState(canvasColor);
    const [fontSize, setFontSize] = useState(12);
    const canvasRef = useRef(null);

    useEffect(() => {
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'z') {
                canvasRef.current.undo();
            }
        });
    }, []);

    const setPaintMode = (mode) => {
        if (mode === 'draw') {
            setCanvasColor(previousColor);
        }
        else if (mode === 'erase') {
            setCanvasColor('#FFF');
        }
    }

    const changeColor = (color) => {
        setCanvasColor(color);
        setPreviousColor(color);
    }

    return (
        <Layout className="layout">
            <Nav />
            <div className="wrapGameContent">
                <div className="gameContent">
                    <Row style={{height: '100%'}} justify="space-around" align="center">
                        <Col span={16} >
                            <CanvasDraw 
                                ref={canvasRef} 
                                brushRadius={fontSize}
                                hideGrid={true} 
                                canvasHeight={'84%'} 
                                canvasWidth={'100%'} 
                                brushColor={canvasColor}
                                />
                            <CanvasControls 
                                changeColor={changeColor} 
                                setPaintMode={setPaintMode} 
                                setFontSize={setFontSize}
                                goBack={() => canvasRef.current.undo()}
                                clear={() => canvasRef.current.clear()}
                            />
                        </Col>
                        <Col span={6}>
                            <Chat />
                        </Col>
                    </Row>
                </div>
            </div>
            <Footer />
        </Layout>
    );
}

const mapStateToProps = state => {
    return { user: readUser(state) }
}

export default connect(mapStateToProps, {})(Game);