"use strict";

module.exports = function(script, AccountManager, UIManager){

const cmd = new ChatCommand();

cmd.data.keywords = [
    "help",
    "?",
    "도움말",
    "명령어"
];

cmd.condition = (function(data, chat){
    for(let pre of this){
        if(chat.msg.startsWith(pre)) return true;
    }
}).bind(cmd.data.keywords);

const prefix = DB.read('system/command.json').prefix[0] || '';

const cmd_scripts = DB.get('cmds/guest/help/description').list()
    .map(v => v.read().format({
        prefix: prefix
    }));

const FV = '\u200b'.repeat(500);
cmd.response = (data, chat) => {
    chat.reply(
        script.format({
            sender: chat.sender,
            FV: FV,
            list: cmd_scripts.length === 0
                ? "명령어에 대한 안내가 아직 아무것도 등록되지 않았습니다. 사서에게 문의해주세요."
                : cmd_scripts.join('\n\n')
        })
    );
};


return cmd;
};