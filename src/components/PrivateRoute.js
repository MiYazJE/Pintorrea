import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { readAuth } from '../Redux/Reducers/UserReducer';
import { logOutUser, logUser } from '../Redux/Actions/UserActions';
import { removeCookie, whoAmI } from '../Helpers/auth-helpers';

const PrivateRoute = ({ component: Component, logOutUser, setAuth, auth, ...rest }) => {

    useEffect(() => {
        (async () => {
            const data = await whoAmI();
            if (!data.auth) {
                logOutUser();
                removeCookie();
            }
            else {
                logUser(data.user, data.auth);
            }
        })();
    }, []);

    return (
        <Route {...rest} render={props => (
            auth ? <Component {...props} /> : <Redirect to="/login" />
        )} />
    );

}

const mapStateToProps = state => ({ auth: readAuth(state) })

export default connect(mapStateToProps, { logOutUser })(PrivateRoute);