import {recordTime} from "./recorder";
import {queryForm} from "./queryForm";
import {Entry} from "./Entry";
import {entryList} from "./entryList";
import {progressDisplay} from "./progessDisplay";
import storage from "./storage";
import {exec} from "child_process";
import config from "./config";
export const term = require("terminal-kit").terminal;

term.on("key", (key : string) => {
    if (key == "CTRL_C") term.processExit();
})

const mainMenu : [string, Function][] = [
    ["Start recording", async () => {
        let time = await recordTime();
        let entry = await queryForm(new Entry(time), true);

        await storage.with(es => {
            es[Date.now()] = entry;
        })
    }],
    ["Add past log", async () => {
        let entry = await queryForm(new Entry(0), false);

        await storage.with(es => {
            es[Date.now()] = entry;
        })
    }],
    ["Append time to log", async () => {
        let index = await entryList();
        let time = await recordTime();

        await storage.with(async (es) => {
            let entry = es[index];
            entry.time += time;

            es[index] = await queryForm(entry, true);
        });
    }],
    ["Edit logs", async () => {
        let index = await entryList();

        await storage.with(async (es) => {
            es[index] = await queryForm(es[index], true);
        })
    }],
    ["Delete log", async () => {
        let index = await entryList();

        await storage.with((es) => {
            delete es[index];
        })
    }],
    ["Open folder containing logs", () => {
        exec(config.fileBrowser + " " + config.filePath);
    }],
    ["View progress", async () => {
        await progressDisplay();
    }],
    ["View past logs", async () => {
        await entryList(); // TODO: use form read-only mode
    }],
    ["Quit", () => {
        term.processExit();
    }]
]

const main = async () => {
    term.clear();

    if (config.showBanner) {
        term.moveTo(0, 2).bold.green(`  █▀▄ ▀█▀ ▀█▀   ▀▀▄ \n  █ █  █   █    ▄▀  \n  ▀▀   ▀   ▀    ▀▀▀ `);
        term.moveTo(3, 5).italic.gray("(c) Ulrich Barnstedt 2023")
        term.moveTo(2, 6);
    } else {
        term.moveTo(2, 2).bold.green("Diplomarbeit time tracker 2");
        term.moveTo(2, 3);
    }

    await new Promise<void>(resolve => {
        term.singleColumnMenu(
            mainMenu.map(x => x[0] + " "),
            async (err: any, res: {selectedIndex: number}) => {
                await mainMenu[res.selectedIndex][1]();
                resolve();
            }
        )
    });
}

(async () => {
    while (true) await main();
})();
