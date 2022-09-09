"use strict";

module.exports = (function(){

const output = {};

const Spot = require('./Spot.js');
Object.defineProperty(output, 'Spot', {
    value: Spot,
    enumerable: true
});

const World = require('./World.js')(Spot);
Object.defineProperty(output, 'World', {
    value: World,
    enumerable: true
});




Object.defineProperty(output, "init", {
    value: (function(global){
        for(let i in this){
            global[i] = this[i];
        }
    }).bind(output),
    configurable: true
});



return output;
})();