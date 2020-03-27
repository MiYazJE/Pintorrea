import React, { useState, useEffect } from "react";
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
import { whoAmI, logout } from "./Helpers/auth-helpers";

export default function App() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    const handleLogout = () => {
        setUser(null);
        logout();
    };

    useEffect(() => {
        setLoading(true);
        (async () => {
            const data = await whoAmI();
            if (data.auth) {
                setUser(data.user);
            }
            setLoading(false);
        })();
    }, []);

    const saveUser = user => setUser(user);

    return (
        <Router>
            <div className="app" id="app">
                {!loading ? (
                    <Switch>
                        <Route path="/" exact>
                            <Home user={user} logout={handleLogout} />
                        </Route>
                        <Route path="/game">
                            {user ? (
                                <Game logout={handleLogout} user={user} />
                            ) : (
                                <Redirect to="/login" />
                            )}
                        </Route>
                        <Route path="/login">
                            {!user ? (
                                <Login
                                    logout={handleLogout}
                                    saveUser={saveUser}
                                />
                            ) : (
                                <Redirect to="/" />
                            )}
                        </Route>
                        <Route path="/signUp">
                            {!user ? (
                                <SignUp
                                    logout={handleLogout}
                                    saveUser={saveUser}
                                />
                            ) : (
                                <Redirect to="/" />
                            )}
                        </Route>
                        <Route path="*">
                            <Redirect to="/" />
                        </Route>
                    </Switch>
                ) : (
                    <div className="loading">
                        <Spin size="large" />
                    </div>
                )}
            </div>
        </Router>
    );
}
