"use strict";

module.exports = function(Spot){

function World(name){
    const world = new Set();
    world.__proto__ = World.prototype;

    Object.defineProperty(world, "_name", {
        value: name,
        writable: true,
        configurable: true
    });

    return world;
}

inherits(World, Set);

const _proto_ = World.prototype;

Object.defineProperty(_proto_, "clear", {
    value: void 0
});

Object.defineProperty(_proto_, "name", {
    get: function(){ return this._name; },
    set: function(name){ this._name = '' + name; },
    configurable: true
});

const _add = Set.prototype.add;
Object.defineProperty(_proto_, "add", {
    value: function(spot){
        if(spot instanceof Spot){
            if(Array.from(this).some(v => v._name === spot._name || (v._x === spot._x && v._y === spot._y && v._z === spot._Z))){
                return this;
            }

            return _add.call(this, spot);
        } else {
            throw new TypeError("World.add - please input spot");
        }
    },
    configurable: true
});

Object.defineProperty(_proto_, "nameTable", {
    get: function(){
        const table = {};
        this.forEach(v => table[v.name] = v);
        return table;
    },
    configurable: true
});

Object.defineProperty(_proto_, "getByAxis", {
    value: function(x, y, z){
        for(let spot of this){
            if(spot._x === x && spot._y === y && spot._z === z) return spot;
        }
    },
    configurable: true
});

Object.defineProperty(_proto_, "getByName", {
    value: function(name){
        for(let spot of this){
            if(spot._name === name) return spot;
        }
    },
    configurable: true
});

// map
const map_proto = {};
Object.defineProperty(map_proto, "get", {
    value: function(x, y, z){
        return this[x+','+y+','+z];
    },
    configurable: true
});

Object.defineProperty(_proto_, "map", {
    get: function(){
        const map = {};
        this.forEach(v => map[v._x + "," + v._y + "," + v._z] = v);
        map.__proto__ = map_proto;
        return map;
    },
    configurable: true
});

Object.defineProperty(_proto_, "getNearSpot", {
    value: function(spot, radius){
        if(this.has(spot)){
            return Array.from(this)
                    .filter(v => !(v === spot || spot.distance(v) > radius));
        } else {
            throw new TypeError("World.getNearSpot - 1st argument must be a spot that should be a datum point");
        }
    },
    configurable: true
});

Object.defineProperty(_proto_, "getNearest", {
    value: function(spot, radius){
        if(this.has(spot)){
            radius = radius || Infinity;
            let nearest, d, temp;

            for(let p of this){
                if(p === spot) continue;

                temp = spot.distance(p);
                if(temp > radius) continue;

                if(!nearest){
                    nearest = p;
                    d = temp;
                } else if(temp < d){
                    nearest = p;
                    d = temp;
                }
            }

            return nearest || spot;
        } else {
            throw new TypeError("World.getNearest - argument must be a spot that should be a datum point");
        }
    },
    configurable: true
})

Object.defineProperty(_proto_, "toObject", {
    value: function(){
        return {
            name: this._name,
            map: Array.from(this).map(v => v.toObject())
        };
    },
    configurable: true
});



return World;
};