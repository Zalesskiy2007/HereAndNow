export class _User {
    name: String;
    login: String;
    id: Number;
    coordLng: Number;
    coordLat: Number;
    friends: [Number];
    friendsReceivedReq: [Number];
    friendsSentReq: [Number];
    imageSrc: String;
    trackingGeo: Boolean;
    mapStyle: Number;

    constructor(    newname: String,
                    newlogin: String,
                    newid: Number,
                    newcoordLng: Number,
                    newcoordLat: Number,
                    newfriends: [Number],
                    newfriendsReceivedReq: [Number],
                    newfriendsSentReq: [Number],
                    newimageSrc: String,
                    newtrackingGeo: Boolean,
                    newmapStyle: Number 
                ) {
        this.name = newname;
        this.login = newlogin;
        this.id = newid;
        this.coordLng = newcoordLng;
        this.coordLat = newcoordLat;
        this.friends = newfriends;
        this.friendsReceivedReq = newfriendsReceivedReq;
        this.friendsSentReq = newfriendsSentReq;
        this.imageSrc = newimageSrc;
        this.trackingGeo = newtrackingGeo;
        this.mapStyle = newmapStyle;
    }
}

export class _Friend {
    name: String;
    login: String;
    id: Number;
    coordLng: Number;
    coordLat: Number; 
    imageSrc: String;
    trackingGeo: Boolean;

    constructor(    newname: String,
                    newlogin: String,
                    newid: Number,
                    newcoordLng: Number,
                    newcoordLat: Number,
                    newimageSrc: String,
                    newtrackingGeo: Boolean                     
                ) {
        this.name = newname;
        this.login = newlogin;
        this.id = newid;
        this.coordLng = newcoordLng;
        this.coordLat = newcoordLat;
        this.imageSrc = newimageSrc;
        this.trackingGeo = newtrackingGeo;
    }
}

export function User(...args: [String, String, Number, Number, Number, [Number], [Number], [Number], String, Boolean, Number]) {
    return new _User(...args);
}

export function Friend(...args: [String, String, Number, Number, Number, String, Boolean]) {
    return new _Friend(...args);
}