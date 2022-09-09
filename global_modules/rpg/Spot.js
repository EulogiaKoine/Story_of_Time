"use strict";

module.exports = (function(){

function Spot(name, x, y, z, scale){
    const spot = new Set();
    Object.defineProperty(spot, "_name", {
        value: name,
        configurable: false
    });

    Object.defineProperties(spot, {
        _x: {
            writable: true,
            configurable: true
        },
        _y: {
            writable: true,
            configurable: true
        },
        _z: {
            writable: true,
            configurable: true
        }
    });

    Object.defineProperty(spot, "_scale", { // 구체로 표현했을 때의 반지름
        writable: true,
        configurable: true
    });

    spot.__proto__ = Spot.prototype; // 상속해야 프로토타입의 xyz에 접근 가능해서 직점 먼저 상속.

    spot.x = x || 0;
    spot.y = y || 0;
    spot.z = z || 0;

    spot.scale = scale || 0;

    return spot;
}

inherits(Spot, Set);

const _proto_ = Spot.prototype;

Object.defineProperty(_proto_, "clear", {
    value: void 0
});

Object.defineProperty(_proto_, "name", {
    get: function(){ return this._name; },
    set: function(name){ this._name = '' + name; },
    configurable: true
});

Object.defineProperty(_proto_, "x", {
    get: function(){ return this._x; },
    set: function(x){
        if(typeof x === "number"){
            this._x = x >> 0;
        } else {
            throw new TypeError("Spot.x/set - each dimension must be expressed with an integer");
        }
    },
    configurable: true
});

Object.defineProperty(_proto_, "y", {
    get: function(){ return this._y; },
    set: function(y){
        if(typeof y === "number"){
            this._y = y >> 0;
        } else {
            throw new TypeError("Spot.y/set - each dimension must be expressed with an integer");
        }
    },
    configurable: true
});

Object.defineProperty(_proto_, "z", {
    get: function(){ return this._z; },
    set: function(z){
        if(typeof z === "number"){
            this._z = z >> 0;
        } else {
            throw new TypeError("Spot.z/set - each dimension must be expressed with an integer");
        }
    },
    configurable: true
});

Object.defineProperty(_proto_, "scale", {
    get: function(){
        return this._scale;
    },
    set: function(scale){
        if(typeof scale === "number" && scale >= 0){
            this._scale = scale >> 0;
        } else {
            throw new TypeError("Spot.scale/set - scale must be an integer greater than zero");
        }
    },
    configurable: true
});

Object.defineProperty(_proto_, "d", {
    value: function(spot){
        if(spot instanceof Spot){
            return Math.hypot(this._x - spot._x, this._y - spot._y, this._z - spot._z);
        }

        throw new TypeError("Spot.d - argument must be an other spot");
    },
    configurable: true
});

Object.defineProperty(_proto_, "distance", {
    value: function(spot){
        if(spot instanceof Spot){
            const d = this.d(spot);
            if(d < this._scale + spot._scale) return 0;
            return d - this._scale - spot._scale;
        }

        throw new TypeError("Spot.distance - argument must be an other spot");
    },
    configurable: true
});

Object.defineProperty(_proto_, "toObject", {
    value: function(){
        return {
            name: this._name,
            x: this._x,
            y: this._y,
            z: this._z,
            scale: this._scale,
            contain: Array.from(this)
        };
    },
    configurable: true
});




return Spot;
})();