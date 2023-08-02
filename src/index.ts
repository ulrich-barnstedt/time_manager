import {record} from "./recorder";
import {queryForm} from "./queryForm";
import {readJSON, saveNewEntry, writeJSON} from "./utils";
import {Entry} from "./Entry";
import {entryList} from "./entryList";
export const term = require("terminal-kit").terminal;

term.on("key", (key : string) => {
    if (key == "CTRL_C") term.processExit();
})

const mainMenu : [string, Function][] = [
    ["Start recording", async () => {
        let time = await record();
        let entry = await queryForm(new Entry(time), true);

        saveNewEntry(entry);
        term.processExit();
    }],
    ["Add past log", async () => {
        let entry = await queryForm(new Entry(0), false);

        saveNewEntry(entry);
        term.processExit();
    }],
    ["Edit logs", async () => {
        let index = await entryList();

        let entryStorage = readJSON();
        entryStorage[index] = await queryForm(entryStorage[index], true);
        writeJSON(entryStorage);
        term.processExit();
    }],
    ["Open folder containing logs", () => {

    }],
]

const main = () => {
    term.clear();
    term.moveTo(2, 2).bold.green("Diplomarbeit time tracking tool");
    term.moveTo(2, 3);

    term.singleColumnMenu(
        mainMenu.map(x => x[0] + " "),
        (err: any, res: {selectedIndex: number}) => {
            mainMenu[res.selectedIndex][1]();
        }
    )
}

main();