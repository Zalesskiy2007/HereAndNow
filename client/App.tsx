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
        });

        /*setInterval(() => {
            let obj =
            socket.emit("GetData", );
        }, 3000); */
        
        return () => {
            socket.off("connect");
        };        
    }, []);

    return (
        <Router>
            <div className="app-container">
                <Switch>
                    <Route path="/map" render={(props) => (<MapPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth}/>)} />
                    <Route path="/settings" render={(props) => (<SettingsPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth}/>)} />
                    <Route path="/friends" render={(props) => (<FriendsPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth}/>)} />
                    <Route path="/login" render={(props) => (<LoginPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth}/>)}/> 
                    <Route path="/register" render={(props) => (<RegisterPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth}/>)} />
                    <Route path="/" render={(props) => (<MapPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth}/>)} />                    
                </Switch>
                <BottomNavigation />
            </div>
        </Router>
    );
}
