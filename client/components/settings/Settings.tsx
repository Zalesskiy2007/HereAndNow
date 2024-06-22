import React, { useEffect, useState } from 'react';

import { Socket, io } from 'socket.io-client';
import * as cookie from "../../utils/Cookie-util";
import {User, Friend, _User, _Friend} from "../../User";

export function Settings(props: {socket: Socket, user: _User, friends: _Friend[], isAuth: Boolean, sesId: String}) {
    const [showMapStyles, setShowMapStyles] = useState<boolean>(false);
    const [toggleCheck, setToggleCheck] = useState<boolean>(props.user.trackingGeo);

    const handleToggleChange = () => {
        setToggleCheck((toggle) => !toggle);        
        props.socket.emit("settingsChangeGeo", props.sesId); 
    };

    useEffect(() => {
        setToggleCheck(props.user.trackingGeo);
    }, [props.user]);

    const toggleMapSyles = () => {
        setShowMapStyles(!showMapStyles);
    };

    return (
        <div className="settings-content">
            <div className="settings-content-wrapper">
                <div className="user-info-wrapper">
                    <div className="edit-button">
                        <button>Edit</button>
                    </div>
                    <div className="div-row-user-info row-profile-photo">
                        <img src={props.user.imageSrc} />
                    </div>
                    <div className="div-row-user-info row-user-info">
                        <div className="row-name-a">
                            <h1>{props.user.name}</h1>
                        </div>
                        <div className="row-user-name">
                            <p>@{props.user.login}</p>
                        </div>
                    </div>
                </div>
                <div className="buttons-wrapper">
                    <div className="div-row-buttons">
                        <input
                            type="file"
                            id="profile-photo-change"
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <button
                            className="button change-photo-button"
                            onClick={() =>
                                document
                                    .getElementById('profile-photo-change')
                                    ?.click()
                            }
                        >
                            Change Profile Photo
                        </button>
                    </div>
                    <div className="div-row-buttons row-button-block">
                        <label className="button block-button hide-geo-toggle">
                            Hide Geolocation
                            <input
                                type="checkbox"
                                checked={!toggleCheck}
                                onChange={handleToggleChange}
                            />
                            <i></i>
                        </label>
                        <div
                            className="button block-button map-style-button"
                            onClick={toggleMapSyles}
                        >
                            Map Style{' '}
                            <i
                                className={`fas fa-chevron-right ${
                                    showMapStyles ? 'open' : ''
                                }`}
                            ></i>
                            {showMapStyles && (
                                <div className="map-styles-dropdown">
                                    <ul>
                                        <li>Style 1</li>
                                        <li>Style 2</li>
                                        <li>Style 3</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="div-row-buttons row-button-block">
                        <button className="button block-button logout-button" onClick={() => alert(props.user.trackingGeo)}>
                            Log Out
                        </button>
                        <button className="button block-button delete-acc-button">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
