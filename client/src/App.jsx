import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { verifyAuth } from './actions/userActions';
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './routes/Routes';
import './App.scss';

const App = ({ verifyAuth }) => {
    useEffect(() => {
        verifyAuth();
    }, []);
    
    return (
        <Router>
            <Routes />
        </Router>
    );
};

const mapDispatchToProps = (dispatch) => ({
    verifyAuth: () => dispatch(verifyAuth()),
});

export default connect(null, mapDispatchToProps)(App);
