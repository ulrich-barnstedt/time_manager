import {readJSON} from "./utils";
import {extractTime} from "./time";
import {term} from "./index";

const messageShowLength = 45;

export const entryList = () : Promise<number> => {
    term.clear().moveTo(2, 2).green("Last 10 entries");
    term.moveTo(2, 3);

    let entries = readJSON();
    let slicedEntries : [number, string][] = Object.entries(entries).slice(-10).map(([key, value]) => {
        let date = new Date(Number(key));
        let time = extractTime(value.time);
        let formattedTime = `${time[0]}h ${String(time[1]).padStart(2)}m`;
        let cutMessage = <number>value.message?.length > messageShowLength ? value.message?.slice(0, messageShowLength) + " ..." : value.message;

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