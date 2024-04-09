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

const getStack = (e) => {
    const regex = /\((.*):(\d+):(\d+)\)$/
    const match = regex.exec(e.stack.split("\n")[2]);
    return {
      filepath: match[1],
      line: match[2],
      column: match[3]
    };
  }

const log = (color, type, message, e, note = "no notes.") => {
    let stack = getStack(e);
    console.log(
        `${color}[${type}] - ${RESET}[ at: ${PURPLE}${stack.filepath}${RESET} - line: ${PURPLE}${stack.line}${RESET}]  \n - \t${message} - [${note}]`
    )
}

module.exports = {log, GREEN, YELLOW, RED, CYAN, BLUE, PURPLE, WHITE, BOLD, DIM, UNDERLINE, INVERT, BLINK, REVERSE, HIDDEN, RESET}