"use strict";

module.exports = (function(){

const AccountManager = require('./AccountManager.js');
const UIManager = require('./UIManager');

AccountManager.init();

for(let user of AccountManager.list){
    UIManager.set(user);
}

const guest_cmds = require('./guest_cmds.js')(AccountManager, UIManager);

const prefix = DB.read('system/command.json').prefix;

BotManager.getCurrentBot().addListener(
    Event.MESSAGE,
    (function(chat){
        if(!chat.isGroupChat || chat.room.endsWith("★")){
            let _pre;

            for(let i of this){
                if(chat.content.startsWith(i)){
                    _pre = i;
                    break;
                }
            }

            if(_pre){
                chat = new Chat(chat);
                chat.msg = chat.msg.slice(_pre.length);

                let user = UIManager.getByHash(chat.hash);
                if(user){
                    /**
                     * @todo
                     * @name for_user
                     */
                } else {
                    guest_cmds.exec(chat);
                }
            }
        }
    }).bind(prefix)
);


const output = {};

Object.defineProperties(output, {
    AccountManager: {
        value: AccountManager,
        enumerable: true
    },
    UIManager: {
        value: UIManager,
        enumerable: true
    },
    guest_cmds: {
        value: guest_cmds,
        enumerable: true
    }
});


return output;
})();