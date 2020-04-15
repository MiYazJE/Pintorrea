import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { readAuth } from '../Redux/Reducers/AuthReducer';
import { setAuth } from '../Redux/Actions/AuthActions';
import { imLogged, removeCookie } from '../Helpers/auth-helpers';
import { logOutUser } from '../Redux/Actions/UserActions';

const PrivateRoute = ({ component: Component, logOutUser, setAuth, auth, ...rest }) => {

    useEffect(() => {
        (async () => {
            const data = await imLogged();
            if (!data.auth) {
                logOutUser();
                removeCookie();
            }
            setAuth(data.auth);
        })();
    }, []);

    return (
        <Route {...rest} render={props => (
            auth ? <Component {...props} /> : <Redirect to="/login" />
        )} />
    );

}

const mapStateToProps = state => ({ auth: readAuth(state) })

export default connect(mapStateToProps, { logOutUser, setAuth })(PrivateRoute);