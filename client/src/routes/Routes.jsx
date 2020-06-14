import React from 'react';
import Home from '../components/Home/Home';
import Login from '../components/Login/Login';
import Game from '../components/Game/Game';
import SignUp from '../components/SignUp/SignUp';
import PrivateRoom from '../components/PrivateRoom/PrivateRoom';
import PrivateRoute from './PrivateRoute';
import Ranking from '../components/Ranking/Ranking';
import { connect } from 'react-redux';
import { readAuth, readUserLoading } from '../reducers/userReducer';
import { Switch, Route, Redirect } from 'react-router-dom';
import '../App.scss';
import { Spin } from 'antd';

const Routes = ({ auth, userLoading }) => {
    console.log(userLoading)
    return (
        <div className="app" id="app">
            {userLoading ? (
                <Spin size="large" style={{position: 'absolute', left: '50%', top: '50%'}} />
            ) : (
                <Switch>
                    <PrivateRoute component={Home} path="/" exact />
                    <PrivateRoute component={Game} path="/game" exact />
                    <PrivateRoute component={Ranking} path="/ranking" exact />
                    <PrivateRoute component={PrivateRoom} path="/privateRoom/:id" />
                    <Route path="/login" exact>
                        {!auth ? <Login /> : <Redirect to="/" />}
                    </Route>
                    <Route path="/signUp" exact>
                        {!auth ? <SignUp /> : <Redirect to="/" />}
                    </Route>
                    <Route path="*">
                        <Redirect to="/" />
                    </Route>
                </Switch>
            )}
        </div>
    );
};

const mapStateToProps = (state) => ({
    auth: readAuth(state),
    userLoading: readUserLoading(state)
});

export default connect(mapStateToProps, {})(Routes);
