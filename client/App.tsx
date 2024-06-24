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
const spbCoords = {
        lng: 30.3158,
        lat: 59.9398
    };

function setIntervalImmediatly(func: any, interval: number) {
    func();
    return setInterval(func, interval);
}

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
    let intervalSetPos = useRef<NodeJS.Timeout | undefined>(undefined);

    let [user, setUser] = useState<_User>(User("abc", "test", -1, spbCoords.lng, spbCoords.lat, [-1], [-1], [-1], "-", false, -1));
    let [userData, setUserData] = useState("");

    let [friends, setFriends] = useState<_Friend[]>([Friend("fr", "fr", -1, spbCoords.lng, spbCoords.lat, "-", false)]);
    let [friendsData, setFriendsData] = useState("");

    let [friendsReceived, setFriendsReceived] = useState<_Friend[]>([Friend("fr", "fr", -1, spbCoords.lng, spbCoords.lat, "-", false)]);
    let [friendsReceivedData, setFriendsReceivedData] = useState("");

    let [friendsSent, setFriendsSent] = useState<_Friend[]>([Friend("fr", "fr", -1, spbCoords.lng, spbCoords.lat, "-", false)]);
    let [friendsSentData, setFriendsSentData] = useState("");

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

        socket.on('setFriends', (data) => {
            setFriendsData(data);
            console.log("setFriendsData: " + data);
        });

        socket.on('setFriendsReceived', (data) => {
            setFriendsReceivedData(data);
            console.log("setFriendsReceivedData: " + data);
        });

        socket.on('setFriendsSent', (data) => {
            setFriendsSentData(data);
            console.log("setFriendsSentData: " + data);
        });
        
        return () => {
            socket.off("connect");
            clearInterval(intervalReq.current);
            clearInterval(intervalSetPos.current);
        };        
    }, []);

    useEffect(() => {
        if (userData !== "") {
            let d = JSON.parse(userData);        
            let us = User(d.name, d.login, d.id, d.coordLng, d.coordLat, d.friends, d.friendsReceivedReq, d.friendsSentReq, d.imageSrc, d.trackingGeo, d.mapStyle);
            setUser(us);
            console.log("setUser from " + user.name + " to " + us.name);
        }        
    }, [userData]);

    useEffect(() => {
        if (friendsData !== "") {
            let data: any[] = JSON.parse(friendsData).friends;
            
            for (let i = 0; i < data.length; i++) {
                let fr = Friend(data[i].name, data[i].login, data[i].id, data[i].coordLng, data[i].coordLat, data[i].imageSrc, data[i].trackingGeo); 
                
                setFriends((frArr) => [...frArr, fr]);
            }
        }        
    }, [friendsData]);

    useEffect(() => {
        if (friendsReceivedData !== "") {
            let data: any[] = JSON.parse(friendsReceivedData).friends;
            
            for (let i = 0; i < data.length; i++) {
                let fr = Friend(data[i].name, data[i].login, data[i].id, data[i].coordLng, data[i].coordLat, data[i].imageSrc, data[i].trackingGeo); 
                
                setFriendsReceived((frArr) => [...frArr, fr]);
            }
        }        
    }, [friendsReceivedData]);

    useEffect(() => {
        if (friendsSentData !== "") {
            let data: any[] = JSON.parse(friendsSentData).friends;
            
            for (let i = 0; i < data.length; i++) {
                let fr = Friend(data[i].name, data[i].login, data[i].id, data[i].coordLng, data[i].coordLat, data[i].imageSrc, data[i].trackingGeo); 
                
                setFriendsSent((frArr) => [...frArr, fr]);
            }
        }        
    }, [friendsSentData]);

    useEffect(() => {
        let b = setAuthFromSesId(sesId);

        if (b === true) {
            if (user.trackingGeo === true) {
                clearInterval(intervalSetPos.current);
                intervalSetPos.current = setIntervalImmediatly(() => {                                
                    navigator.geolocation.getCurrentPosition((pos) => {
                        let obj = {
                            sId: sesId,
                            lng: pos.coords.longitude,
                            lat: pos.coords.latitude
                        };

                        socket.emit("setGeo", JSON.stringify(obj));
                        console.log("setGeo");
                    }, (err) => {
                        socket.emit("hideGeo", sesId);
                    }, {enableHighAccuracy: true});
                }, 2000);
                console.log("Start interval set pos");
            } else {
                clearInterval(intervalSetPos.current);
            }
        } else {
            clearInterval(intervalSetPos.current);            
        } 
        
        console.log("useEffect");

        return () => {
            clearInterval(intervalSetPos.current);
        };        
    }, [user.trackingGeo, sesId]);

    useEffect(() => {
        let b = setAuthFromSesId(sesId);
        setIsAuth(b); 

        if (b === true) {
            clearInterval(intervalReq.current);
            intervalReq.current = setIntervalImmediatly(() => {                                
                socket.emit("requestPerson", sesId);
                socket.emit("requestFriends", sesId);
                socket.emit("requestFriendsReceived", sesId);
                socket.emit("requestFriendsSent", sesId);

                console.log("requestPersonAndFriends");
            }, 2000);
            console.log("Start interval req");
        } else {
            clearInterval(intervalReq.current);
        }  

        return () => {
            clearInterval(intervalReq.current);            
        };
    }, [sesId]);

    useEffect(() => {
        function updateVH() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }

        updateVH();
        window.addEventListener('resize', updateVH);

        return () => {
            window.removeEventListener('resize', updateVH);
        };
    }, []);

    return (
        <Router>
            <div className="app-container">
                <Switch>
                    <Route path="/login" render={(props) => (<LoginPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth} sesId={sesId}/>)}/> 
                    <Route path="/register" render={(props) => (<RegisterPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth} sesId={sesId}/>)} />                    
                    <Redirect exact from="/" to="/map" />
                    <Route>
                        <div className="main-area">
                            <Switch>
                                <Route path="/map" render={(props) => (<MapPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth} sesId={sesId}/>)} />
                                <Route path="/settings" render={(props) => (<SettingsPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth} sesId={sesId}/>)} />
                                <Route path="/friends" render={(props) => (<FriendsPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth} sesId={sesId}/>)} />
                                <Redirect exact from="/" to="/map" />
                            </Switch>
                        </div>
                        <div className="bottom-area">
                            <BottomNavigation />
                        </div>
                    </Route>                    
                </Switch>
            </div>
        </Router>
    );
}