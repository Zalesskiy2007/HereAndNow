import React, { useEffect, useRef, useState } from 'react';
import { BottomNavigation } from './components/common/Navigation';
import { MapPage } from './pages/MapPage';
import { SettingsPage } from './pages/SettingsPage';
import { FriendsPage } from './pages/FriendsPage';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

import { io } from 'socket.io-client';

import * as cookie from "./utils/Cookie-util";
import {User, Friend} from "./User";

export function App() {
    let login: boolean = false;

    let [socket, setSocket] = useState(io());
    let [isAuth, setIsAuth] = useState(false);
    let [user, setUser] = useState(User("abc", "test", -1, -1, -1, [-1], [-1], [-1], "-", false, -1));
    let [friends, setFriends] = useState([Friend("fr", "fr", -1, -1, -1, "-", false)]);

    useEffect(() => {
        socket.on("connect", () => {
            console.log(`Connected with socketID: ${socket.id}`);
            //setInterval(() => {console.log(cookie.getCookie("test"));}, 2000);
        });
        
        return () => {
            socket.off("connect");
        };        
    }, []); 

    return (
        <Router>
            <div className="app-container">
                <Switch>
                    <Route path="/map" component={MapPage} />            {/* Here add socket, onClick functions for buttons, other data from server as attributes */}
                    <Route path="/settings" component={SettingsPage} />  {/* Here add socket, onClick functions for buttons, other data from server as attributes */}
                    <Route path="/friends" component={FriendsPage} />    {/* Here add socket, onClick functions for buttons, other data from server as attributes */}
                    <Route path="/login" component={LoginPage} />        {/* Here add socket, onClick functions for buttons, other data from server as attributes */}
                    <Route path="/register" component={RegisterPage} />  {/* Here add socket, onClick functions for buttons, other data from server as attributes */}
                    <Route path="/" component={MapPage} />               {/* Here add socket, onClick functions for buttons, other data from server as attributes */}             
                    {/* <Redirect exact from="/" to="/login" /> */}
                    {/* <Redirect exact from="/" to="/map" /> */}
                </Switch>
                <BottomNavigation />
            </div>
        </Router>
    );
}
