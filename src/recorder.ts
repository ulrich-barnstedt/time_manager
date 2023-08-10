import {extractTime} from "./time";
import {term} from "./index";

const updateTitle = (recording: boolean) => {
    if (recording) {
        term.moveTo(2, 2).green.bold("Recording ...");
    } else {
        term.moveTo(2, 2).red.bold("Paused.      ");
    }
}

const showElapsed = (ts: number) => {
    let [h, m] = extractTime(ts);
    term.moveTo(2, 7).cyan.italic(`${h}h ${m}m elapsed   `);

    // TODO: show daily goal
}

const recordRunner = (resolve: (v: number) => void) => {
    let start = Date.now();
    let elapsed = 0;
    let running = true;
    let id : NodeJS.Timer;

    term.clear();
    term.moveTo(2, 4)("p - pause").moveTo(2, 5)("q - stop");
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
            case "q":
            case "Q":
                clearInterval(id);
                term.removeListener("key", handler);

                if (running) {
                    resolve(elapsed + (Date.now() - start));
                } else {
                    resolve(elapsed);
                }
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
