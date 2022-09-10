"use strict";

module.exports = (function(){

const UIManager = new Map();

const _idmap = {};

Object.defineProperties(UIManager, {
    idmap: {
        get: (function(){
            return Object.assign({}, this);
        }).bind(_idmap),
        enumerable: true
    },
    getById: {
        value: (function(id){
            return this[id];
        }).bind(_idmap),
        enumerable: true
    }
});

Object.defineProperty(UIManager, "list", {
    get: (function(){
        return Array.from(this.values());
    }).bind(UIManager),
    enumerable: true
});

Object.defineProperty(UIManager, "getByHash", {
    value: (function(hash){
        for(let id in this){
            if(this[id].hash === hash) return this[id];
        }
    }).bind(_idmap),
    enumerable: true
});

Object.defineProperty(UIManager, "set", {
    value: (function(user){
        if(user instanceof User){
            if(this.has(user) || _idmap[user.id]){
                return false;
            }

            Map.prototype.set.call(this,
                user,
                _idmap[user.id] = new UI(user)
            );

            return true;
        } else {
            throw new TypeError("UIManager.add - please input an user object");
        }
    }).bind(UIManager),
    enumerable: true
});

Object.defineProperty(UIManager, "delete", {
    value: (function(user){
        if(user instanceof User){
            if(!(this.has(user) || _idmap[user.id])){
                return false;
            }

            Map.prototype.delete.call(this, user);
            delete _idmap[user.id];

            return true;
        } else {
            throw new TypeError("UIManager.delete - please input an user object");
        }
    }).bind(UIManager),
    enumerable: true
});




return UIManager;
})();