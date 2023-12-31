import {formatTime} from "./time";
import {term} from "./index";
import config from "./config";
import storage from "./storage";

export const entryList = () : Promise<number> => {
    term.clear()
        .moveTo(2, 2)
        .green.bold(`Last ${config.entryListLength} entries`);
    term.moveTo(2, 3);

    let entries = Object.entries(storage.get());
    if (entries.length === 0) {
        term.moveTo(2, 4)("No entries.")

        return new Promise(resolve => {
            term.once("key", () => resolve(-1));
        })
    }

    let slicedEntries : [number, string][] = entries
        .slice(-config.entryListLength)
        .reverse()
        .map(([key, value]) => {
            let date = new Date(Number(key));
            let formattedTime = formatTime(value.time, true);
            let category = value.category !== undefined ? config.categories[value.category] : undefined;
            let cutMessage;
            if (config.messageShowLength === -1) {
                cutMessage = value.message;
            } else {
                cutMessage = <number>value.message?.length > config.messageShowLength ? value.message?.slice(0, config.messageShowLength) + " ..." : value.message;
            }

            return [Number(key), `${date.toDateString()} | ${formattedTime} | ${category?.displayId} | ${cutMessage}`];
        });

    return new Promise(resolve => {
        term.singleColumnMenu(
            slicedEntries.map(x => x[1] + " "),
            {
                oneLineItem: true
            },
            (err: any, res: {selectedIndex: number}) => {
                resolve(slicedEntries[res.selectedIndex][0]);
            }
        )
    })
}