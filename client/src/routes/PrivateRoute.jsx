import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { readAuth, readUserLoading } from '../Redux/Reducers/UserReducer';
import { Spin } from 'antd';

const PrivateRoute = ({ component: Component, userLoading, auth, ...rest }) => {
    return (
        <Route {...rest} render={props => (
            userLoading 
                ? <Spin size="large" style={{position: 'absolute', left: '50%', top: '50%'}} />
                : auth 
                    ? <Component {...props} /> 
                    : <Redirect to="/login" />
        )} />
    );
}

const mapStateToProps = state => ({ 
    auth: readAuth(state),
    userLoading: readUserLoading(state)
});

export default connect(mapStateToProps, {})(PrivateRoute);