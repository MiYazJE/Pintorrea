import React, { useState, Fragment } from 'react';
import Nav from './Nav';
import GameInfo from './GameInfo';

export default function Home({ user, logout }) {

    return (
        <Fragment>
            <Nav logout={logout} user={user} />
            <GameInfo logout={logout} user={user} />
        </Fragment>
    )
        
}