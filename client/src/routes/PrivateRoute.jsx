import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { readAuth } from '../reducers/userReducer';

const PrivateRoute = ({ component: Component, auth, ...rest }) => {
    return <Route {...rest} render={(props) => (auth ? <Component {...props} /> : <Redirect to="/login" />)} />;
};

const mapStateToProps = (state) => ({
    auth: readAuth(state),
});

export default connect(mapStateToProps, {})(PrivateRoute);
