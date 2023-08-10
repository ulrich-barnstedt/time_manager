import {extractTime} from "./time";
import {term} from "./index";
import config from "./config";
import storage from "./storage";

export const entryList = () : Promise<number> => {
    term.clear().moveTo(2, 2).green(`Last ${config.entryListLength} entries`);
    term.moveTo(2, 3);

    let entries = storage.get();
    let slicedEntries : [number, string][] = Object.entries(entries).slice(-config.entryListLength).reverse().map(([key, value]) => {
        let date = new Date(Number(key));
        let time = extractTime(value.time);
        let formattedTime = `${time[0]}h ${String(time[1]).padStart(2)}m`;
        let cutMessage = <number>value.message?.length > config.messageShowLength ? value.message?.slice(0, config.messageShowLength) + " ..." : value.message;

        return [Number(key), `${date.toDateString()} | ${formattedTime} | ${cutMessage}`];
    })

    return new Promise(resolve => {
        term.singleColumnMenu(
            slicedEntries.map(x => x[1] + " "),
            (err: any, res: {selectedIndex: number}) => {
                resolve(slicedEntries[res.selectedIndex][0]);
            }
        )
    })
}