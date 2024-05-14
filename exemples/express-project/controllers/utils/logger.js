const path = require("path");
const fs = require("fs");

const logsFilePath = path.join(__dirname + "../../../logs/log.txt");

const GREEN = "\u001b[32m";
const YELLOW = "\u001b[33m";
const RED = "\u001b[31m";
const CYAN = "\u001b[36m";
const BLUE = "\u001b[34m";
const PURPLE = "\u001b[35m";
const WHITE = "\u001b[37m";
const BOLD = "\u001b[1m";
const DIM = "\u001b[2m";
const UNDERLINE = "\u001b[4m";
const INVERT = "\u001b[7m";
const BLINK = "\u001b[5m";
const REVERSE = "\u001b[7m";
const HIDDEN = "\u001b[8m";
const RESET = "\u001b[0m";

const log = (color, type, message, note = "") => {
    console.log(`${color}[${type}] - [${message}] ${note}${RESET}`);
};

const write = (type, message, note = "") => {

    let content =   new Date().toLocaleDateString() + " " +  
                    new Date().toLocaleTimeString() + ` - [${type}] - [${message}] ${note}\n`;

    fs.writeFile(logsFilePath, content, { flag: 'a+' }, (err) => {
        if(err) {
            console.log(err);
        }
    })
}


module.exports = {
    log,
    write,
    GREEN,
    YELLOW,
    RED,
    CYAN,
    BLUE,
    PURPLE,
    WHITE,
    BOLD,
    DIM,
    UNDERLINE,
    INVERT,
    BLINK,
    REVERSE,
    HIDDEN,
    RESET,
};
