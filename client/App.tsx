import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
import {User, Friend, _User, _Friend} from "./User";
import * as cookie from "./utils/Cookie-util";

let socket = io();

export function App() {
    //cookie.deleteCookie(cookie.name); //reset

    console.log("Start render");

    let [sesId, setSesId] = useState<string>(cookie.getCookie(cookie.name));
    const setAuthFromSesId = (idData: string) => {
        if (idData === cookie.noneValue) return false;
        else return true;         
    };

    let [isAuth, setIsAuth] = useState(setAuthFromSesId(sesId));

    let intervalReq = useRef<NodeJS.Timeout | undefined>(undefined);

    let [user, setUser] = useState<_User>(User("abc", "test", -1, -1, -1, [-1], [-1], [-1], "-", false, -1));
    let [userData, setUserData] = useState("");

    let [friends, setFriends] = useState<_Friend[]>([Friend("fr", "fr", -1, -1, -1, "-", false)]);

    useEffect(() => {
        socket.on("connect", () => {
            console.log(`Connected with socketID: ${socket.id}`);            
        });        
        
        socket.on("logIn", (data) => {
            let d = JSON.parse(data).sesId.toString();
            cookie.setCookie(cookie.name, d);             
            setSesId(d);          

            console.log("logIn");
        });
        socket.on("logOut", () => {
            cookie.deleteCookie(cookie.name);      
            setSesId(cookie.noneValue);  
            
            console.log("logOut");
        });

        socket.on("setPerson", (data) => {                        
            setUserData(data);
            console.log("setUserData");
        });  
        
        return () => {
            socket.off("connect");
            clearInterval(intervalReq.current);
        };        
    }, []);

    useEffect(() => {
        if (userData !== "") {
            let d = JSON.parse(userData);        
            let us = User(d.name, d.login, d.id, d.coordLng, d.coordLat, d.friends, d.friendsReceivedReq, d.friendsSentReq, d.imageSrc, d.trackingGeo, d.mapStyle);
            setUser(us);
            console.log("setUser");
        }        
    }, [userData]);

    useEffect(() => {
        let b = setAuthFromSesId(sesId);
        setIsAuth(b); 

        if (b === true) {
            clearInterval(intervalReq.current);
            intervalReq.current = setInterval(() => {                
                // socket emit request data about users and person themself, and maybe send new geo
                socket.emit("requestPerson", sesId);
                console.log("requestPerson");
            }, 2000);
            console.log("Start interval");
        } else {
            clearInterval(intervalReq.current);
        }  

        return () => {
            clearInterval(intervalReq.current);            
        };
    }, [sesId]);

    return (
        <Router>
            <div className="app-container">
                <Switch>
                    <Route path="/map" render={(props) => (<MapPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth}/>)} />
                    <Route path="/settings" render={(props) => (<SettingsPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth}/>)} />
                    <Route path="/friends" render={(props) => (<FriendsPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth}/>)} />
                    <Route path="/login" render={(props) => (<LoginPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth}/>)}/> 
                    <Route path="/register" render={(props) => (<RegisterPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth}/>)} />                    
                    <Redirect exact from="/" to="/map" />
                </Switch>
                <BottomNavigation />
            </div>
        </Router>
    );
}