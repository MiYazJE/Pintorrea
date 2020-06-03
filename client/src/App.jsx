import React, { useEffect, useState } from "react";
import "./App.css";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Game from "./components/Game/Game";
import SignUp from "./components/SignUp/SignUp";
import PrivateRoute from './components/Routes/PrivateRoute';
import { connect } from 'react-redux';
import { readAuth } from './Redux/Reducers/UserReducer';
import { verifyAuth } from './Redux/Actions/UserActions';

const App = ({ verifyAuth, auth }) => {

    useEffect(() => {
        verifyAuth();
    }, []); 
    
    return (
        <Router>
            <div className="app" id="app">
                <Switch>
                    <PrivateRoute component={Home} path="/" exact />
                    <PrivateRoute component={Game} path="/game" exact />
                    <Route path="/login">
                        {auth ? <Redirect to="/" /> : <Login />}
                    </Route>
                    <Route path="/signUp">
                        {auth ? <Redirect to="/" /> : <SignUp />}
                    </Route>
                    <Route path="*">
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

const mapStateToProps = state => ({ 
    auth: readAuth(state),
});

const mapDispatchToProps = dispatch => ({
    verifyAuth: () => dispatch(verifyAuth())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);