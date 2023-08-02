import {record} from "./recorder";
import {queryForm} from "./queryForm";
import {readJSON, saveNewEntry, writeJSON} from "./utils";
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

        saveNewEntry(entry);
    }],
    ["Add past log", async () => {
        let entry = await queryForm(new Entry(0), false);

        saveNewEntry(entry);
    }],
    ["Edit logs", async () => {
        let index = await entryList();

        let entryStorage = readJSON();
        entryStorage[index] = await queryForm(entryStorage[index], true);
        writeJSON(entryStorage);
    }],
    ["Open folder containing logs", () => {

    }],
    ["View progress", async () => {
        await progressDisplay();
    }]
]

const main = () => {
    term.clear();
    term.moveTo(2, 2).bold.green("Diplomarbeit time tracking tool");
    term.moveTo(2, 3);

    term.singleColumnMenu(
        mainMenu.map(x => x[0] + " "),
        async (err: any, res: {selectedIndex: number}) => {
            await mainMenu[res.selectedIndex][1]();
            term.processExit();
        }
    )
}

main();