import React, { ChangeEvent, useEffect, useState } from 'react';

import { Socket, io } from 'socket.io-client';
import * as cookie from "../../utils/Cookie-util";
import {User, Friend, _User, _Friend} from "../../User";

export function Friends(props: {socket: Socket, user: _User, friends: _Friend[], isAuth: Boolean, sesId: String}) {
    interface User {
        id: number;
        username: string;
        isFriend: boolean;
        avatar: string;
    }

    const [users, setUsers] = useState<User[]>([
        { id: 1, username: 'vsndrg', isFriend: true, avatar: '../assets/images/vsndrg.jpg' },
        { id: 6, username: 'tatumwsg', isFriend: true, avatar: '../assets/images/whigga.jpg' },
        { id: 3, username: 'redcheek', isFriend: true, avatar: '../assets/images/rust.jpg' },
        { id: 4, username: 'mihanzales', isFriend: true, avatar: '../assets/images/mihan.jpg' },
        { id: 5, username: 'wittmann', isFriend: true, avatar: '../assets/images/default.jpg' },
        { id: 11, username: 'vsndrg', isFriend: true, avatar: '../assets/images/vsndrg.jpg' },
        { id: 16, username: 'tatumwsg', isFriend: true, avatar: '../assets/images/whigga.jpg' },
        { id: 13, username: 'redcheek', isFriend: true, avatar: '../assets/images/rust.jpg' },
        { id: 14, username: 'mihanzales', isFriend: true, avatar: '../assets/images/mihan.jpg' },
        { id: 15, username: 'wittmann', isFriend: true, avatar: '../assets/images/default.jpg' },
        { id: 21, username: 'vsndrg', isFriend: true, avatar: '../assets/images/vsndrg.jpg' },
        { id: 26, username: 'tatumwsg', isFriend: true, avatar: '../assets/images/whigga.jpg' },
        { id: 23, username: 'redcheek', isFriend: true, avatar: '../assets/images/rust.jpg' },
        { id: 24, username: 'mihanzales', isFriend: true, avatar: '../assets/images/mihan.jpg' },
        { id: 25, username: 'wittmann', isFriend: true, avatar: '../assets/images/default.jpg' },
        { id: 31, username: 'vsndrg', isFriend: true, avatar: '../assets/images/vsndrg.jpg' },
        { id: 36, username: 'tatumwsg', isFriend: true, avatar: '../assets/images/whigga.jpg' },
        { id: 33, username: 'redcheek', isFriend: true, avatar: '../assets/images/rust.jpg' },
        { id: 34, username: 'mihanzales', isFriend: true, avatar: '../assets/images/mihan.jpg' },
        { id: 35, username: 'wittmann', isFriend: true, avatar: '../assets/images/default.jpg' }
    ]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<User[]>([]);

    useEffect(() => {
        const results = users.filter((user) => user.username.toLowerCase().includes(searchTerm.toLowerCase()));
        setSearchResults(results);
    }, [users, searchTerm]);

    const handleAddFriend = (id: number) => {
        const upadtedFriends = users.map((user) => {
            if (user.id === id) {
                return { ...user, isFriend: true };
            }
            return user;
        });
        setUsers(upadtedFriends);        
    };

    const handleRemoveFriend = (id: number) => {
        const updatedFriends = users.map((user) => {
            if (user.id === id) {
                return { ...user, isFriend: false };
            }
            return user;
        });
        setUsers(updatedFriends);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="friends-content">
            <div className="div-row-friends friends-header">
                <h1>Friends</h1>
            </div>
            <div className="div-row-friends friends-search">
                <input
                    type="text"
                    placeholder="Search"
                    id="friends-search-input"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onBlur={() => {
                        let input = document.getElementById('friends-search-input') as HTMLInputElement;
                        input.value = '';
                        // setSearchTerm(''); 
                    }}
                />
            </div>
            <div className="div-row-friends friends-list">
                <ul>
                    {searchTerm === ''
                        ? users.map(
                              (user) =>
                                  user.isFriend && (
                                      <li key={user.id}>
                                          <img src={user.avatar} />
                                          {user.username}
                                          <button
                                              onClick={() => {
                                                  handleRemoveFriend(user.id);
                                              }}
                                              style={{ backgroundColor: 'rgb(210, 30, 20)' }}
                                          >
                                              Remove
                                          </button>
                                      </li>
                                  )
                          )
                        : searchResults.map((result) => (
                              <li key={result.id}>
                                  <img src={result.avatar} />
                                  {result.username}
                                  {result.isFriend ? (
                                      <button
                                          onClick={() => {
                                              handleRemoveFriend(result.id);
                                          }}
                                          style={{ backgroundColor: 'rgb(210, 30, 20)' }}
                                      >
                                          Remove
                                      </button>
                                  ) : (
                                      <button
                                          onClick={() => {
                                              handleAddFriend(result.id);
                                          }}
                                      >
                                          Add
                                      </button>
                                  )}
                              </li>
                          ))}
                </ul>
            </div>
        </div>
    );
}
