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
import { readUser } from './Redux/Reducers/UserReducer';
import { logUser } from './Redux/Actions/UserActions';

const App = ({ user, logUser }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        (async () => {
            const data = await whoAmI();
            logUser(data.user);
            setLoading(false);
        })();
    }, []);

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
                            {user ? <Game /> : <Redirect to="/" />}
                        </Route>
                        <PrivateRoute component={Game} path="/game" exact />
                        <Route path="/login">
                            {user ? <Redirect to="/" /> : <Login />}
                        </Route>
                        <Route path="/signUp">
                            {user ? <Redirect to="/" /> : <SignUp />}
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

const mapStateToProps = state => ({ user: readUser(state) })

export default connect(mapStateToProps, { logUser })(App);