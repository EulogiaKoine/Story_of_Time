const scriptName = "RENEW RPG 4";
const PATH = "/storage/emulated/0/Newrpg4/player/";
const FS = FileStream;
const WEXP = 1;
const WGOLD = 1;
const PREFIX = "*"; // 접두사
const movable = ["1"]; // 이동 가능한 장소 ID(문자열)

Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, '');

function makeBar(count, max, barLength) {
    const BAR = ['', '▏', '▎', '▍', '▌', '▋', '▊', '▉', '█'];
    let length = (barLength * count / max),
        dec = length % 1,
        int = length - dec,
        result = (BAR[8].repeat(int) + BAR[Math.round(dec * 8)]);
    return (result + '　'.repeat(barLength - result.length));
}

function makeRnd(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function haveData(name) {
    return java.io.File(PATH + "Data/" + name + "/" + name + ".json").canRead();
}

function updatePlayer(name) {
    return JSON.parse(FS.read(PATH + "Data/" + name + "/" + name + ".json"));
}

function savePlayer(data, name) {
    FS.write(PATH + "Data/" + name + "/" + name + ".json", JSON.stringify(data, null, "\t"));
}

function setCurr(user) {
    user.Rhp = user.hp + user.statpoint_hp * 5;
    user.Rhpmax = user.hpmax + user.statpoint_hp * 5;
    user.Ratk = user.atk + user.statpoint_atk * 1;
    user.Rmp = user.mp;
    user.Rmpmax = user.mpmax;
    user.cri_dam_total = user.cri_dam + user.statpoint_cri * 8;
    user.cri_per_total = user.cri_per_total + user.statpoint_cri * 450;
    user.RExpboost = WEXP + user.Expboost + user.statpoint_luk * 0.005;
    user.RGoldboost = WGOLD + user.Goldboost + user.statpoint_luk * 0.005;
}


function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {

    // 보낸사람 이름에서 슬래시와(/) 공백(\s) 모두 제거
    sender = sender.replace(/(\/|\s)/g, "");

    let hash = imageDB.getProfileHash(); // 해시코드
    let user = updatePlayer(sender) || {}; // 유저 데이터

    // 접두사 검사 및 cmd 배열 생성
    if(msg.startsWith(PREFIX)){
        // 메시지에서 접두사(*)를 잘라내고 공백(띄어쓰기, 엔터)를 기준으로 잘라낸 배열
        var cmd = msg.slice(PREFIX.length).split(/\s/);
    } else {
        return;
    }

    if (msg === "회원가입") {
        if (user.name) {
            replier.reply("이미 회원가입 하셨습니다. 정보를 확인하시려면 '*내정보'를 입력하세요.");
        } else {
            user = {
                "name": sender,
                "level": 1,
                "Exp": 0,
                "Expmax": 1000,
                "heal": false,
                "Expboost": 0,
                "RExpboost": 1,
                "gold": 100000,
                "Goldboost": 0,
                "RGoldboost": 1,
                "total_score": 0, //투력
                "statpoint": 0,
                "statpoint_hp": 0,
                "statpoint_atk": 0,
                "statpoint_luk": 0,
                "statpoint_cri": 0,
                "atk": 2,
                "Ratk": 2,
                "hp": 20,
                "Rhp": 20,
                "hpmax": 20,
                "Rhpmax": 20,
                "mp": 20,
                "Rmp": 20,
                "mpmax": 20,
                "Rmpmax": 20,
                "cri_dam": 2000, // 1000 = 1.000X = 1x
                "cri_dam_total": 2000,
                "cri_per": 10000, // 10000 = 1.0000% = 1%
                "cri_per_total": 10000,
                "week": 0,
                "event_id": 0,
                "tag_u": "S4 PLAYER",
                "tag_1": "개발자야 일해라",
                "tag_2": "",
                "tag_3": "",
                "tag_4": "",
                "tag_5": "",
                "tag_6": "",
                "tag_7": "",
                "tag_8": "",
                "tag_9": "",
                "tag_10": "",
                "rankscore": 0,
                "rank_tier": "UNRANKED",
                "season": 1,
                "monster_name1": "",
                "monster_name2": "",
                "monster_hp": 0,
                "monster_hpmax": 0,
                "monster_atk": 0,
                "monster_def": 1,
                "attack_monster": 0,
                "monster_count": 0,
                "location": 0,
                "STAR": 100000,
                "coupon1": 0,
                "coupon2": 0,
                "dropA": 20000,
                "dropB": 5000,
                "dropC": 200,
                "dropD": 80,
                "hp_potion_s": 10,
                "hp_potion_m": 0,
                "hp_potion_l": 10,
                "mp_potion_s": 10,
                "mp_potion_m": 0,
                "mp_potion_l": 0,
                "monster_1": 0,
                "monster_2": 0,
                "monster_3": 0,
                "box_star1": 0,
                "box_star2": 0,
                "box_star3": 0,
                "box_overstat1": 0,
                "box_overstat2": 0,
                "box_gold1": 0,
                "box_gold2": 0,
                "box_gold3": 0,
                "box_random": 0,
                "over_point": 0,
                "quest_point": 0,
                "event1": 0,
                "event2": 0,
                "event3": 0,
                "event4": 0,
                "event5": 0,
                "event6": 0
            };

            savePlayer(user, sender);

            replier.reply(
                "회원가입 완료!"
                + "\n\"*내정보\"를 입력하여 " + sender + "님의 정보를 확인하세요."
            );
        }
        return;
    }


    if(!user.name) return; // 미가입 유저는 아래 코드 사용 불가

    // 자동 레벨업 처리
    if (user.Exp >= user.Expmax && user.level < 31) {
        replier.reply(
            "< LEVEL UP >"
            + "\n\nLEVEL " + user.level + " -> " + (user.level + 1)
            + "\n\nHP + 5"
            + "\nATK + 1"
            + "\n스탯포인트 + 2"
            + "\nLP + " + (user.level * 5)
            + "\n[EVENT] STAR + 500"
        );

        user.rankscore += (user.level * 5);
        user.level += 1;
        user.Exp -= user.Expmax;
        user.Expmax += 200;
        user.hp += 5;
        user.hp_max += 5;
        user.atk += 1;
        user.statpoint += 2;

        user.STAR += 500;

        savePlayer(user, sender);
    }

    // 명령어: 회복
    if (msg === "*회복" && user.Rhp <= user.Rhpmax && !user.heal) {
        replier.reply("회복 중입니다.\n[" + 90 + "s 소요]");

        user.heal = true;
        savePlayer(user, sender);

        // 회복 예약
        setTimeout(sender => {
            replier.reply("HP 회복 완료!");

            let user = updatePlayer(sender);

            if (user.heal) {
                user.heal = false;
                user.hp = user.hpmax;
                user.mp = user.mpmax;
                user.rankscore += 30;

                savePlayer(U, sender);
            }
        }, 1000, [sender]); // 현재 회복 시간: 1초

        return;
    }

    // 명령어: 내정보(상태창)
    if (msg === "*내정보") {
        if (user.name) {
            replier.reply(
                sender + "님의 정보"
                + "\n\n칭호 : " + user.tag_u
                + "\n\nLEVEL " + user.level
                + "\nEXP : " + user.Exp + " / " + user.Expmax
                + "\n\n전투력 : " + "업데이트 예정"
                + "\n\nHP " + user.Rhp + " / " + user.Rhpmax
                + "\n\nMP " + user.Rmp + " / " + user.Rmpmax
                + "\n\nATK " + user.Ratk + " (+0"
                + "\n\n크리티컬 확률 : " + (user.cri_per_total / 10000) + "%"
                + "\n크리티컬 데미지 : " + (user.cri_dam_total / 1000) + "X"
                + "\n\n착용중인 갑옷 : X"
                + "\n착용중인 무기 : X"
                + "\n착용중인 장신구 : X"
                +" \n\n\nGOLD / " + user.gold
                + "\nSTAR / " + user.STAR
            );
        } else {
            replier.reply(
                "회원가입이 되지 않았습니다."
                + "\n\n*회원가입 으로 계정을 만들어주세요."
            );
        }

        return;
    }

    // 명령어: 스탯(스펙)
    if (msg === "*스탯") {
        replier.reply(
            sender + "님의 스탯 정보"
            + "\n\n\n잔여 스탯포인트 : " + user.statpoint
            + "\n\n체력 : " + user.statpoint_hp
            + "\n\n공격 : " + user.statpoint_atk
            + "\n\n행운 : " + user.statpoint_luk 
            + "\n\n크리티컬 : " + user.statpoint_cri
        );

        return;
    }

    // 명령어: 스탯 분배
    if (cmd[0] === "스탯올리기") {
        if(isNaN(cmd[2])){
            replier.reply("알맞은 수를 입력해주세요.");
            return;
        }

        cmd[2] = +cmd[2] >> 0;

        // 분배할 포인트가 부족하면
        if(user.statpoint < cmd[2]){
            replier.reply("스탯포인트가 부족합니다.");
            return;
        }

        switch(cmd[1]){
            case "공격":
                user.statpoint -= cmd[2];
                user.statpoint_atk += cmd[2];
                break;
            
            case "체력":
                user.statpoint -= cmd[2];
                user.statpoint_hp += cmd[2];
                break;
                
            case "행운":
                user.statpoint -= cmd[2];
                user.statpoint_luk += cmd[2];
                break;

            case "크리티컬":
                user.statpoint -= cmd[2];
                user.statpoint_cri += cmd[2];
                break;

            default:
                replier.reply("없는 스탯입니다.");
                return;
        }

        replier.reply(cmd[1] + " 스탯을 " + cmd[2] + "만큼 올렸습니다.");
        savePlayer(user, sender);
        return;
    }
    
    // 명령어: 명령어 목록(help)
    if(cmd[0] === "명령어") {
        replier.reply(
            "전체 명령어 목록"
            + "\n\n" + "\u200b".repeat(500)
            + "\n\n*내정보 / 유저의 모든 정보를 확인합니다."
            + "\n\n*스탯올리기 (스탯명) (올릴 수치) / 해당 스탯을 원하는 수치만큼 증가시킵니다."
            + "\n\n*장소 (던전/레이드) / 해당 종류의 장소 목록을 확인합니다."
            + "\n\n*장소 정보 / 현재 위치한 장소의 정보를 확인합니다."
            + "\n\n*회복 / 유저의 HP/MP를 회복합니다."
            + "\n\n*인벤토리 (전체/보석/상자/재료/물약/직업/특수/전리품)"
            + "\n해당 종류의 아이템을 확인합니다."
            + "\n\n*장소 이동 (ID) / 해당 ID의 장소로 이동합니다."
            + "\n\n*(사냥/공격/탐색/채집/채굴) / 해당 장소에서 사냥/공격/탐색/채집/채굴을 진행합니다."
            + "\n\n*사용 (ID) / 해당 아이템을 사용합니다."
            + "\n\n*(판매/구매) (ID) (갯수) / 해당 아이템을 판매, 구매합니다."
            + "\n\n*보석 / 보석 관련 명령어를 확인합니다."
            + "\n\n*오버 스탯 / 오버 스탯 관련 명령어를 확인합니다."
            + "\n\n*퀘스트 / 현재 존재하는 퀘스트, 진행하는 퀘스트를 확인합니다."
            + "\n\n*장비 / 장비 관련 명령어를 확인합니다."
            + "\n\n*직업 / 직업 관련 명령어를 확인합니다."
            + "\n\n*길드 / 길드 관련 명령어를 확인합니다."
            + "\n\n*등급 / 현재 시즌의 등급점수를 확인합니다."
        );

        return;
    }

    // 명령어: 인벤토리
    if (cmd[0] === "인벤토리") {
        switch(cmd[1]){
            case "재료":
                replier.reply(
                    sender + "님의 인벤토리"
                    + "\n정렬 기준 / 재료"
                    + "\n" + "\u200b".repeat(500)
                    + "\n\n<재료 아이템이 존재하지 않습니다>"
                );
                break;
            
            case "전리품":
                replier.reply(
                    sender + "님의 인벤토리"
                    + "\n정렬 기준 / 전리품"
                    + "\n" + "\u200b".repeat(500)
                    + "\n\n하급 몬스터의 잔해 (id 1) : " + user.monster_1
                    + "\n중급 몬스터의 잔해 (id 2) : " + user.monster_2
                    + "\n상급 몬스터의 잔해 (id 3) : " + user.monster_3
                );
                break;

            case "상자":
                replier.reply(
                    sender + "님의 인벤토리"
                    + "\n정렬 기준 / 상자"
                    + "\n" + "\u200b".repeat(500)
                    + "\n\n스타 주머니 (id S1) : " + user.box_star1
                    + "\n : 작은 스타 박스 (id S2) : " + user.box_star2
                    + "\n거대한 스타 박스 (id S3) : " + user.box_star3
                );
                break;

            case "증표":
                replier.reply(
                    sender + "님의 인벤토리"
                    + "\n정렬 기준 / 증표"
                    + "\n" + "\u200b".repeat(500)
                    + "\n\n<증표 아이템이 존재하지 않습니다>"
                );
                break;

            case "전투":
                replier.reply(
                    sender + "님의 인벤토리"
                    + "\n정렬 기준 / 전투"
                    + "\n" + "\u200b".repeat(500)
                    + "\n\n하급 HP 물약 (id 21) : " + user.hp_potion_s
                    + "\n중급 HP 물약 (id 22) : " + user.hp_potion_m
                    + "\n상급 HP 물약 (id 23) : " + user.hp_potion_l
                );
                break;

            default:
                replier.reply("*인벤토리 (재료/전리품/상자/증표/전투) 를 사용하여 각 카테고리별 인벤토리를 확인해보세요.");
        }

        return;
    }
    
    // 명령어: 장소
    if (cmd[0] === "장소") {
        switch(cmd[1]){
            case "던전":
                replier.reply(
                    "- 일반 던전 목록 (A구역) -\n" + "\u200b".repeat(500)
                    + "\n장소 이동 방법 : *장소 이동 (ID)"
                    + "\n\n\n시작의 숲 [ID 1]"
                    + "\n필요 레벨 : 1 ~ 30"
                    + "\n획득 가능 아이템"
                    + "\n<하급 몬스터의 잔해>"
                );
                break;

            case "레이드":
                replier.reply("장소가 존재하지 않습니다.");
                break;

            case "이동": // 왠지 직접 if, else if 문으로 다 추가하실 느낌이라 미리 방지해놨습니다.
                // movable, 즉 이동 가능한 장소 ID 배열에 cmd[2]가 포함된다면 === 입력한 ID가 이동 가능한 장소 ID라면
                if(movable.includes(cmd[2])){
                    replier.reply(
                        "ID " + cmd[2] + " 장소로 이동했습니다!"
                        + "\n\n*사냥 으로 몬스터를 사냥하거나, *탐색 으로 주변 아이템을 찾아볼 수 있습니다!"
                    );

                    user.location = +cmd[2]; // 위치 정보 갱신
                    user.attack_monster = 0; // 전투 중인 몬스터 정보 초기화

                    savePlayer(user, sender);
                } else {
                    replier.reply("이동할 수 없는 장소입니다.");
                }
                break;

            default:
                replier.reply("*장소 (던전/레이드)로 장소 목록을 확인하세요!");
        }

        return;
    }
    
    // 명령어: 사냥
    // 실제 사냥 부분도 그냥 여기에 넣어버렸습니다......!
    // switchㅜㅁㄴ
    if (cmd[0] === "사냥") {
        // 사냥 대상을 지정하지 않았다면 사냥 가능 목록을 띄움
        if (!cmd[1]) {
            switch(user.location){
                case 1:
                    replier.reply(
                        "<사냥 모드>"
                        + "\n\n- 출몰 몬스터 -"
                        + "\n-> 야생 토끼 (id 1)"
                        + "\n-> 고라니 (id 2)"
                        + "\n\n획득 가능 아이템"
                        + "\n<하급 몬스터의 잔해>"
                        + "\n\n*사냥 (id)로 사냥을 시작하세요!"
                    );

                    user.monster_name1 = "야생 토끼";
                    user.monster_name2 = "야생 멧돼지";
                    user.attack_monster = 10;
            }
        } else { // 사냥 대상을 입력했으면
            switch(cmd[1]){
                case "1":
                    if(user.attack_monster !== 1 && user.attack_monster !== 2 && user.attack_monster == 10 && user.level <= 30){
                        user.monster_hp = Math.round(user.Ratk * 4 + user.location * 3);
                        user.monster_hpmax = Math.round(user.Ratk * 4 + user.location * 3);
                        user.monster_atk = Math.round(user.Rhpmax / 10);
                        user.monster_def = 1;
                        user.attack_monster = 1;
                        replier.reply(user.monster_name1 + " 사냥을 시작합니다.\n*공격 으로 몬스터에게 피해를 입히세요!\n\n\n<" + user.monster_name1 + ">\n\nM.HP { " + user.monster_hp + " / " + user.monster_hpmax + " }\nM.ATK { " + user.monster_atk + " }\nM.DEF { " + (-(user.monster_def - 1)) + "% }");
                    }
                    break;
                
                case "2":
                    if (user.attack_monster !== 1 && user.attack_monster !== 2 && user.attack_monster == 10 && user.level <= 30) {
                        user.monster_hp = Math.round(user.Ratk * 5 + user.location * 1);
                        user.monster_hpmax = Math.round(user.Ratk * 5 + user.location * 1);
                        user.monster_atk = Math.round(user.Rhpmax / 12);
                        user.monster_def = 1;
                        user.attack_monster = 2;
                        replier.reply(user.monster_name2 + " 사냥을 시작합니다.\n*공격 으로 몬스터에게 피해를 입히세요!\n\n\n<" + user.monster_name2 + ">\n\nM.HP { " + user.monster_hp + " / " + user.monster_hpmax + " }\nM.ATK { " + user.monster_atk + " }\nM.DEF { " + (-(user.monster_def - 1)) + "% }");
                    }

                    break;

                default:
                    replier.reply("존재하지 않는 대상입니다.");
            }

            savePlayer(user, sender);
        }

        return;
    }
    
    // 명령어: 탐색
    if (cmd[0] === "탐색") {
        // 왠지 직접 다 추가하실 느낌이라 미리 가독성을 위해 switch 문을 사용하였습니다.
        // 다룰 줄 모르시면 못 쓰시는 겁니당. 파이팅.
        // - Koine -
        switch(user.location){
            case 1:
                replier.reply("이 장소에서는 탐색할 아이템이 없습니다!");
                break;
        }

        return;
    }

    // 명령어: 등급
    if (cmd[0] === "등급") {
        replier.reply(
            sender + "님의 등급"
            + "\n\n\nTIER < " + user.rank_tier + " >"
            + "\n\n" + user.rankscore + " LP"
        );

        return;
    }

    // 명령어: 공격
    if (msg === "*공격" && user.attack_monster !== 10 && user.attack_monster !== 0) {
        if (user.Rhp > 0) {
            // 치명타가 확률로 적용된 최종대미지
            let dmg = Math.round(
                user.Ratk * ( // ~을 곱한다
                    user.cri_per_total < makeRnd(1, 1e6) // 치명타 미발생 시
                    ? 1 // 1을
                    : user.cri_dam_total / 1000 // (아니라면 = 발생 시) 크리댐/1000을.
                )
            );
    
            user.monster_hp -= dmg; //일단 대미지 입히고
            user.hp -= user.monster_atk // (유저도 대미지를)입고 시작

            let monster_name;
            switch(user.attack_monster){
                case 1:
                    monster_name = user.monster_name1;
                    break;
                
                case 2:
                    monster_name = user.monster_name2;
                    break;
            }
    
            // 공격 성공 메시지(일단 공격하고 시작하니까)
            replier.reply(
                "<" + montser_name + ">"
                + "\n\nM.HP { " + user.monster_hp + " / " + user.monster_hpmax + " }"
                + "\n\n[ + ] 몬스터에게 " + dmg
                + "\n데미지를 입혔습니다!"
                + "\n\n[ - ] 몬스터에게 " + user.monster_atk + "데미지를 입었습니다."
            );
    
            // 몬스터 체력이 0 이하라면, 즉 사냥에 성공했다면
            if(user.montser_hp <= 0){
                replier.reply(
                    "[" + monster_name + "] 사냥 성공!!"
                    + "\n\n<전리품>"
                    + "\nEXP + " + Math.round(user.RExpboost * Math.round(user.Expmax / 4))
                    + "\nGOLD + " + Math.round(WGOLD * 250 + (user.location * 5))
                    + "\n하급 몬스터의 잔해 × 1"
                    + "\n2 LP"
                );
    
                user.Exp += Math.round(user.RExpboost * Math.round(user.Expmax / 4));
                user.gold += Math.round(WGOLD * 250 + (user.location * 5));
                user.monster_1 += 1;
                user.rankscore += 2;
                user.attack_monster = 10;
            }
        } else {
            replier.reply(
                "체력 소진으로 인해 전투가 취소되었습니다."
                + "\n\n*회복 으로 체력을 회복해주세요!"
            );
    
            user.attack_monster = 10;
        }
    
        savePlayer(user, sender);
        return;
    }

    // 명령어: 상점
    if (msg === "*상점") {
        replier.reply("판매하는 아이템이 없습니다.");

        return;
    }

    // 명령어: 스타상점
    if (msg == "*스타상점") {
        replier.reply(
            "= STAR SHOP ="
            + "\n\n\n\n구글 기프트카드 5,000 ₩"
            + "\n-> 500,000 STAR"
            + "\n\n자유 치킨 기프티콘 20,000 ₩"
            + "\n-> 1,980,000 STAR"
        );

        return;
    }

    // 명령어: 갑옷
    if (msg === "*갑옷") {
        replier.reply("준비중인 기능입니다.");

        return;
    }

    // 명령어: 무기
    if (msg === "*무기") {
        replier.reply("준비중인 기능입니다.");

        return;
    }

    // 명령어: 해시코드
    if (msg === "*hash") {
        replier.reply(hash);

        return;
    }

    /*if (msg.startsWith("*e ")) {
        try {
          if (admin.indexOf(Hash) == -1) {
          } else {
            replier.reply(eval(msg.substr(2)));
replier.reply('Run_Time : ' + (Date.now() - time) / 1000 + 's');
          }
        }        catch (e) {
  em = "오류명 : " + e.name + "\n오류내용 : " + e.message + "\n오류난 줄 : #" + e.lineNumber;
  replier.reply(em);
}
      }*/
}