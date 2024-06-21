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
import {User, Friend} from "./User";
import * as cookie from "./utils/Cookie-util";

export function App() {
    let socket= useRef(io());

    //cookie.deleteCookie(cookie.name); //reset

    let [sesId, setSesId] = useState(cookie.getCookie(cookie.name));
    const setAuthFromSesId = (idData: string) => {
        if (idData === cookie.noneValue) return false;
        else return true;         
    };

    let [isAuth, setIsAuth] = useState(setAuthFromSesId(sesId));

    let [user, setUser] = useState(User("abc", "test", -1, -1, -1, [-1], [-1], [-1], "-", false, -1));
    let [friends, setFriends] = useState([Friend("fr", "fr", -1, -1, -1, "-", false)]);

    useEffect(() => {
        socket.current.on("connect", () => {
            console.log(`Connected with socketID: ${socket.current.id}`);            
        });
        
        socket.current.on("logIn", (data) => {
            let d = JSON.parse(data).sesId.toString();
            cookie.setCookie(cookie.name, d);             
            setSesId(d);          
        });
        
        let data = cookie.getCookie(cookie.name);
        setSesId(data);
        setIsAuth(setAuthFromSesId(data));

        return () => {
            socket.current.off("connect");
        };        
    }, []);   

   useEffect(() => {
        setIsAuth(setAuthFromSesId(sesId));      
    }, [sesId]);

    return (
        <Router>
            <div className="app-container">
                <Switch>
                    <Route path="/map" render={(props) => (<MapPage {...props} socket={socket.current} user={user} friends={friends} isAuth={isAuth}/>)} />
                    <Route path="/settings" render={(props) => (<SettingsPage {...props} socket={socket.current} user={user} friends={friends} isAuth={isAuth}/>)} />
                    <Route path="/friends" render={(props) => (<FriendsPage {...props} socket={socket.current} user={user} friends={friends} isAuth={isAuth}/>)} />
                    <Route path="/login" render={(props) => (<LoginPage {...props} socket={socket.current} user={user} friends={friends} isAuth={isAuth}/>)}/> 
                    <Route path="/register" render={(props) => (<RegisterPage {...props} socket={socket.current} user={user} friends={friends} isAuth={isAuth}/>)} />                    
                    <Redirect exact from="/" to="/map" />
                </Switch>
                <BottomNavigation />
            </div>
        </Router>
    );
}