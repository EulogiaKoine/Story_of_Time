module.exports = (function(){

const _nanoTime = java.lang.System.nanoTime;
const _prefix = ['e'];
const _admin = [];

const _javaString = java.lang.String;
const _getProfileHash = function(){
    return _javaString(this.getBase64()).hashCode();
}

const _legacyAdaptor = chat => {
    return {
        room: chat.room,
        msg: chat.content,
        sender: chat.author.name,
        replier: chat,
        isGroupChat: chat.isGroupChat,
        imageDB: Object.assign(chat.author.avatar, { getProfileHash: _getProfileHash }),
        packageName: chat.packageName,
        isDebugRoom: chat.isDebugRoom,
        isMention: chat.isMention
    };
};

function listenAsLegacy(chat){
    let { room, msg, sender, isGroupChat, replier, imageDB, packageName, isDebugRoom, isMention } = _legacyAdaptor(chat);

    let _pre = _prefix.find(v => msg.startsWith(v));
    if(_pre && _admin.indexOf(imageDB.getProfileHash()) !== -1 || isDebugRoom){
        const rp = chat.reply.bind(chat);

        let _code = msg.slice(_pre.length).trim(), _start;

        try {
            const _result = eval(
                "void (_start = _nanoTime());\n"
                + _code
            );

            _start = (_nanoTime() - _start) / 1000000000;
            rp("⏱˚ " + _start + " sec.\n" + _result);
        } catch (e) {
            rp("☢ " + e.name + " ··· " + (e.lineNumber - 1) + "\n " + e.message);
        }
    }
}

function listenChat(chat){
    let _pre = _prefix.find(v => chat.content.startsWith(v));
    if(_pre && _admin.indexOf(_javaString(chat.author.avatar.getBase64()).hashCode()) !== -1 || chat.isDebugRoom){
        const rp = chat.reply.bind(chat);

        let _code = chat.content.slice(_pre.length).trim(), _start;

        try {
            const _result = eval(
                "void (_start = _nanoTime());\n"
                + _code
            );

            _start = (_nanoTime() - _start) / 1000000000;
            rp("⏱˚ " + _start + " sec.\n" + _result);
        } catch (e) {
            rp("☢ " + e.name + " ··· " + (e.lineNumber - 1) + "\n " + e.message);
        }
    }
}

const _getListener = function(type){
    type = String(type).toLowerCase();
    switch(type){
        case "1":
        case "legacy":
            return listenAsLegacy;
    
        case "2":
        case "api2":
            return listenChat;

        default:
            throw new Error("evaluate.install - plaese select either legacy or api2");
    }
};


return Object.defineProperties({}, {
    admin: {
        value: _admin,
        enumerable: true
    },
    prefix: {
        value: _prefix,
        enumerable: true
    },
    listener: {
        value: _getListener.bind(),
        enumerable: true
    },
    install: {
        value: (function(bot, listener){
            listener = _getListener(listener);

            if(bot.listeners(Event.MESSAGE).indexOf(listener) === -1){
                bot.addListener(Event.MESSAGE, listener);
                return true;
            }

            return false;
        }).bind(),
        enumerable: true
    }
});
})();