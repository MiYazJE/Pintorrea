import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { readAuth } from '../../Redux/Reducers/UserReducer';
import { verifyAuth } from '../../Redux/Actions/UserActions';

const PrivateRoute = ({ component: Component, verifyAuth, auth, ...rest }) => {

    useEffect(() => {
        verifyAuth();
    }, []);

    return (
        <Route {...rest} render={props => (
            auth ? <Component {...props} /> : <Redirect to="/login" />
        )} />
    );

}

const mapStateToProps = state => ({ auth: readAuth(state) })

const mapDispatchToProps = dispatch => ({
    verifyAuth: () => dispatch(verifyAuth())
});

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);