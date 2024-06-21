import React from 'react';
import { Friends } from '../components/friends/Friends';

import { Redirect, Switch} from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import * as cookie from "../utils/Cookie-util";
import {User, Friend, _User, _Friend} from "../User";

export function FriendsPage(props: {socket: Socket, user: _User, friends: _Friend[], isAuth: Boolean}) {
    if (props.isAuth) {
        return (
            <div>
                <Friends />
            </div>
        );
    } else {
        return (<Switch><Redirect exact from="/friends" to="/login" /></Switch>);
    }
}
