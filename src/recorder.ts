import {dailyTime, formatTime} from "./time";
import {term} from "./index";
import config from "./config";
import storage from "./storage";
import {run} from "node:test";

const updateTitle = (recording: boolean) => {
    if (recording) {
        term.moveTo(2, 2).green.bold("Recording ...");
    } else {
        term.moveTo(2, 2).red.bold("Paused.      ");
    }
}

let daily: number;
const showElapsed = (ts: number) => {
    term.moveTo(2, 8).cyan.italic(`${formatTime(ts)} elapsed   `);
    term.moveTo(2, 9).gray.italic(`${formatTime(ts + daily)} daily   `);
}

const recordRunner = (resolve: (v: number) => void) => {
    let start = Date.now();
    let elapsed = 0;
    let running = true;
    let id : NodeJS.Timer;

    if (config.showDailyTime) {
        daily = dailyTime(storage.get());
    }

    term.clear();
    term.moveTo(2, 4)("p - pause")
        .moveTo(2, 5)("q - stop")
        .moveTo(2, 6)("c - cancel");
    updateTitle(running);

    const handler = (key : string) => {
        switch (key) {
            case "p":
            case "P":
                if (running) {
                    elapsed += Date.now() - start;
                    running = false;
                } else {
                    start = Date.now();
                    running = true;
                }

                updateTitle(running);
                break;
            case "c":
            case "C":
                running = false;
                elapsed = -1;
            case "q":
            case "Q":
                clearInterval(id);
                term.removeListener("key", handler);

                if (running) {
                    resolve(elapsed + (Date.now() - start));
                } else {
                    resolve(elapsed);
                }
                break;
        }
    }

    term.on("key", handler);
    id = setInterval(() => {
        if (!running) return;
        showElapsed(elapsed + Date.now() - start);
    }, 1000 * 60);
}

export const recordTime = async () => {
    return new Promise(recordRunner);
}
