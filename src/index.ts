import {recordTime} from "./recorder";
import {queryForm} from "./queryForm";
import {Entry} from "./data/Entry";
import {entryList} from "./entryList";
import {progressDisplay} from "./progessDisplay";
import {exec} from "child_process";
import storage from "./storage";
import config from "./config";
export const term = require("terminal-kit").terminal;


term.on("key", (key : string) => {
    if (key == "CTRL_C") term.processExit(0);
})

const mainMenu : [string, Function][] = [
    ["Start recording time", async () => {
        let time = await recordTime();
        if (time === -1) return;
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
        if (index === -1) return;

        let time = await recordTime();
        if (time === -1) return;

        await storage.with(async (es) => {
            let entry = es[index];
            entry.time += time;

            es[index] = await queryForm(entry, true);
        });
    }],
    ["Edit log", async () => {
        let index = await entryList();
        if (index === -1) return;

        await storage.with(async (es) => {
            es[index] = await queryForm(es[index], true);
        })
    }],
    ["Delete log", async () => {
        let index = await entryList();
        if (index === -1) return;

        await storage.with((es) => {
            delete es[index];
        })
    }],
    ["Open folder containing files", () => {
        exec(config.fileBrowser + " " + config.filePath);
    }],
    ["View progress", async () => {
        await progressDisplay();
    }],
    ["View past logs", async () => {
        await entryList(); // TODO: use form read-only mode
    }],
    ["Quit", () => {
        term.processExit(0);
    }]
]

const main = async () => {
    term.clear();

    if (!config.allowJSONCache) {
        term.moveTo(34, 2).red.bold("JSON cache disabled.");
    }

    if (config.showBanner) {
        term.moveTo(0, 2).bold().blue(`  █▀▄ ▀█▀ ▀█▀   ▀▀▄ \n  █ █  █   █    ▄▀  \n  ▀▀   ▀   ▀    ▀▀▀ `).styleReset();
        term.moveTo(3, 5).italic.gray("(c) Ulrich Barnstedt 2023")
        term.moveTo(2, 6);
    } else {
        term.moveTo(2, 2).bold.green("Diplomarbeit time tracker 2");
        term.moveTo(2, 3);
    }

    await new Promise<void>(resolve => {
        term.singleColumnMenu(
            mainMenu.map(x => x[0] + " "),
            {
                selectedStyle : term.inverse,
                style: term.bold,
            },
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
