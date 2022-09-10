"use strict";

module.exports = (function(){

const _accountDB = DB.get('account');

_accountDB.onsave = user => {
    return {
        name: user.name,
        hash: user.hash,
        pw: user.password,
        id: user.id,
        room: user.room
    };
};

const AccountManager = (() => void 0).bind();

Object.defineProperty(AccountManager, "db", {
    value: _accountDB,
    enumerable: true
});

const _accountSet = new Set();
Object.defineProperty(AccountManager, "list", {
    get: (function(){
        return Array.from(this);
    }).bind(_accountSet),
    enumerable: true
});

Object.defineProperty(AccountManager, "count", {
    get: (function(){
        return this.size;
    }).bind(_accountSet),
    enumerable: true
});

const _idmap = {};
const _hashmap = {};
const _namemap = {};
Object.defineProperties(AccountManager, {
    idmap: {
        get: (function(){
            return Object.assign({}, this);
        }).bind(_idmap),
        enumerable: true
    },
    hashmap: {
        get: (function(){
            return Object.assign({}, this);
        }).bind(_hashmap),
        enumerable: true
    },
    namemap: {
        get: (function(){
            return Object.assign({}, this);
        }).bind(_namemap),
        enumerable: true
    }
});

Object.defineProperties(AccountManager, {
    getById: {
        value: (function(id){
            return this[id];
        }).bind(_idmap),
        enumerable: true
    },
    getByHash: {
        value: (function(hash){
            return this[hash];
        }).bind(_hashmap),
        enumerable: true
    },
    getByName: {
        value: (function(name){
            return this[name];
        }).bind(_namemap),
        enumerable: true
    }
});

Object.defineProperty(AccountManager, "add", {
    value: (function(user){
        if(user instanceof User){
            if(this.has(user) || user.id in _idmap || user.hash in _hashmap || user.name in _namemap){
                return false;
            }

            this.add(user);

            _idmap[user.id] = user;
            _hashmap[user.hash] = user;
            _namemap[user.name] = user;

            _accountDB.write(user.id + '.json', user);
            _accountDB.get(user.id + ".json").save(true);

            return true;
        }

        return false;
    }).bind(_accountSet),
    enumerable: true
});

Object.defineProperty(AccountManager, "delete", {
    value: (function(user){
        if(user = _idmap[user]){
            delete _idmap[user.id];
            delete _hashmap[user.hash];
            delete _namemap[user.name];

            this.delete(user);
            _accountDB.delete(user.id + '.json');

            return true;
        }

        return false;
    }).bind(_accountSet),
    enumerable: true
});

Object.defineProperty(AccountManager, "register", {
    value: (function(name, hash, pw, room){
        let id;
        do {
            id = User.generateId();
        } while(id in _idmap); // id 중첩 방지(평균 0.02% 정도로 중첩되더라...)

        return this.add(
            User.from({
                name: name,
                hash: hash,
                pw: pw,
                room: room,
                id: id
            })
        );
    }).bind(AccountManager),
    enumerable: true
});

Object.defineProperty(AccountManager, "changeName", {
    value: (function(id, name){
        if(id in this){
            delete _namemap[this[id].name];
            _namemap[this[id].name = name] = this[id];

            _accountDB.get(id + ".json").save(true);

            return true;
        }

        return false;
    }).bind(_idmap),
    enumerable: true
});

Object.defineProperty(AccountManager, "changeHash", {
    value: (function(id, hash){
        if(id in this){
            delete _hashmap[this[id].hash];
            _hashmap[this[id].hash = hash] = this[id];

            _accountDB.get(id + ".json").save(true);

            return true;
        }

        return false;
    }).bind(_idmap),
    enumerable: true
});

Object.defineProperty(AccountManager, "changePassword", {
    value: (function(id, pw){
        if(id in this){
            this[id].password = pw;

            _accountDB.get(id + ".json").save(true);

            return true;
        }

        return false;
    }).bind(_idmap),
    enumerable: true
});


Object.defineProperty(AccountManager, "init", {
    value: (function(){
        let meta;

        for(let file of _accountDB.list()){
            meta = file.read();

            if(!(meta instanceof User)){
                this.add( // 계정 등록
                    file.write( // 파일에 재저장
                        User.from(meta) // 메타데이터로 유저화
                    )
                );
            }
        }
    }).bind(AccountManager),
    enumerable: true
});



return AccountManager;
})();