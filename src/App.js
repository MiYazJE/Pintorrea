import React, { useEffect, useState } from "react";
import "./css/App.css";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Game from "./components/Game";
import SignUp from "./components/SignUp";
import { Spin } from 'antd';
import PrivateRoute from './components/PrivateRoute';
import { whoAmI } from './Helpers/auth-helpers';
import { connect } from 'react-redux';
import { readAuth } from './Redux/Reducers/UserReducer';
import { logUser } from './Redux/Actions/UserActions';

const App = ({ logUser, auth }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        (async () => {
            const data = await whoAmI();
            logUser(data.user, data.auth);
            setLoading(false);
        })();
    }, [auth]);

    return (
        <Router>
            <div className="app" id="app">
                {loading ?
                    <div className="loading">
                        <Spin size="large" />
                    </div>
                    :
                    <Switch>
                        <Route path="/" exact>
                            <Home />
                        </Route>
                        <Route path="/game" exact>
                            {auth ? <Game /> : <Redirect to="/" />}
                        </Route>
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
                }
            </div>
        </Router>
    );
}

const mapStateToProps = state => ({ auth: readAuth(state) });

export default connect(mapStateToProps, { logUser })(App);