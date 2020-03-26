import React, { useState, useEffect } from "react"
import "./css/App.css"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom"
import Home from "./components/Home"
import Login from "./components/Login"
import Game from "./components/Game"
import { whoAmI, logout } from "./Helpers/auth-helpers"
import { set } from "mongoose"

export default function App() {
    const [user, setUser] = useState(null)

    const handleLogout = () => {
        setUser(null);
        logout();
    }

    useEffect(() => {
        (async () => {
            const data = await whoAmI();
            if (data.auth) {
                setUser(data.user);
            }
        })()
    }, [])

    const saveUser = user => setUser(user);

    return (
        <Router>
            <div className="app" id="app">
                <Switch>
                    <Route path="/" exact>
                        <Home user={user} logout={handleLogout} />
                    </Route>
                    <Route path="/game">
                        {user ? <Game logout={handleLogout} user={user} /> : <Redirect to="/login" />}
                    </Route>
                    <Route path="/login">
                        {!user ? (
                            <Login saveUser={saveUser} />
                        ) : (
                            <Redirect to="/" />
                        )}
                    </Route>
                    <Route path="*">
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}
