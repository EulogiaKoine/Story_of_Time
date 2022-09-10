/**
 * @name Story of Time
 * @author Koinē
 * @started 2022. 9. 9, Fri. 00:00
 */
// -------------------- Preprocessing --------------------
Log.d("- preprocessing......")

const bot = BotManager.getCurrentBot();
const koine = require('koine/index');
koine.init(this);
koine.boost();

// 기존 리스너 모두 제거
bot.listeners(Event.MESSAGE).forEach(v => bot.removeListener(Event.MESSAGE, v));
Log.d("cleared message listeners");

const SD = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
const PATH = SD + '/' + bot.getName();

String.prototype.format = function (args) {
    return this.replace(/{(.*?)}/g, (_, p1) => args[p1]);
};

Log.d(" > completed.");
// -------------------- Preprocessing --------------------


// -------------------- Database --------------------
Log.d("- loading database......");

const DB = new Directory(PATH);
DB.load();

Log.d(" > completed.")
// -------------------- Database --------------------


// -------------------- Structure --------------------

// -------------------- Structure --------------------


// -------------------- UI --------------------
const { AccountManager, UIManager, guest_cmds } = require('rpg/ui/index');
// -------------------- UI --------------------


// -------------------- Operator --------------------
Log.d("- setting for operating......");
const admin = DB.read('system/admin.json');

const evaluate = require('util/evaluate');
admin.hash.forEach(v => evaluate.admin.push(v));
evaluate.prefix.splice(0, 1, 'r'); // evaluating 접두사 'r'로 설정

bot.addListener(
    Event.MESSAGE,
    (function(chat){
        if(!chat.isGroupChat || chat.room.endsWith("★")){
            this(chat);
        }
    }).bind(evaluate.listener("legacy"))
);

Log.d(" > completed.");
// -------------------- Operator --------------------