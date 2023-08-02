import {record} from "./recorder";
import {queryForm} from "./queryForm";
import {modifyEntryStorage} from "./utils";
import {Entry} from "./Entry";
import {entryList} from "./entryList";
import {progressDisplay} from "./progessDisplay";
export const term = require("terminal-kit").terminal;

term.on("key", (key : string) => {
    if (key == "CTRL_C") term.processExit();
})

const mainMenu : [string, Function][] = [
    ["Start recording", async () => {
        let time = await record();
        let entry = await queryForm(new Entry(time), true);

        await modifyEntryStorage(es => {
            es[Date.now()] = entry;
        })
    }],
    ["Add past log", async () => {
        let entry = await queryForm(new Entry(0), false);

        await modifyEntryStorage(es => {
            es[Date.now()] = entry;
        })
    }],
    ["Edit logs", async () => {
        let index = await entryList();

        await modifyEntryStorage(async (es) => {
            es[index] = await queryForm(es[index], true);
        })
    }],
    ["Delete log", async () => {
        let index = await entryList();

        await modifyEntryStorage((es) => {
            delete es[index];
        })
    }],
    ["Open folder containing logs", () => {
        // TODO
    }],
    ["View progress", async () => {
        await progressDisplay();
    }],
    ["View past logs", async () => {
        await entryList();
    }],
    ["Quit", () => {
        term.processExit();
    }]
]

const main = async () => {
    term.clear();
    term.moveTo(2, 2).bold.green("Diplomarbeit time tracking tool");
    term.moveTo(2, 3);

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
