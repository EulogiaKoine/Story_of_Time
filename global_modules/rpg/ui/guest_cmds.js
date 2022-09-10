"use strict";

/**
 * @decription
 *   미가입 사용자(guest - 게스트) 전용 명령어 세팅.
 * 
 * @see {Directory_DB.cmds.guest}
 * 
 * @return {object}
 *  + TypedArray->CCContainer container
 */

module.exports = function(AccountManager, UIManager){

const container = new CCContainer();

// DB에 등록된 각 커맨드들을 컨테이너에 추가
DB.get('cmds/guest').list()
    .map(v => v.read('index.js')(v.read('script.txt'), AccountManager, UIManager))
    .forEach(v => container.push(v));



return container;
};