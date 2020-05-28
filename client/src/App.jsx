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
import { Spin } from 'antd';
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
                }
            </div>
        </Router>
    );
}

const mapStateToProps = state => ({ auth: readAuth(state) });

export default connect(mapStateToProps, { logUser })(App);