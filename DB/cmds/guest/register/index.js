"use strict";

module.exports = function(script, AccountManager, UIManager){

const cmd = new ChatCommand();

cmd.data.keywords = [
    "등록",
    "가입",
    "register"
];

cmd.condition = (function(data, chat){
    for(let pre of this){
        if(chat.msg.startsWith(pre)){
            chat.msg = chat.msg.slice(pre.length).trim();
            
            return true;
        }
    }
}).bind(cmd.data.keywords);

cmd.response = (function(data, chat){
    if(chat.hash in this.hashmap){
        chat.reply('"어라, ' + chat.sender +' 님께선 이미 등록되어 계시네요. 예상치 못한 상황이에요. 이 메시지가 보인다면 코이네에게 문의해주세요."');

        return;
    }

    let cmd = chat.msg.split(' ').filter(v => v !== '');
    let name = cmd[0];
    let pw = cmd[1];

    if(pw === void 0){
        chat.reply('"도서관에서 사용할 이름과, 보안을 위한 비밀번호를 입력해주세요."');
    } else {
        if(name in this.namemap){
            chat.reply('"같은 이름의 사용자가 이미 존재합니다. 다른 이름으로 부탁드려요."');
        } else {
            if(/^[0-9A-z가-힣_]+$/.test(name)){
                if(pw.length < 8){
                    chat.reply('"비밀번호는 8자 이상으로 설정해주세요."');
                } else {
                    this.register(name = name.replace(/_/g, ' '), chat.hash, pw, chat.room);
                    UIManager.set(this.getByName(name));
    
                    chat.reply(
                        script.format({
                            sender: chat.sender,
                            name: name
                        })
                    );
                }
            } else {
                chat.reply('"이름은 한글, 영어, 숫자와 공백(_으로 대체)으로만 이루어지도록 설정 부탁드려요."');
            }
        }
    }
}).bind(AccountManager);



return cmd;
};