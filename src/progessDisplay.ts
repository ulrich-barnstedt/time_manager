import {term} from "./index";
import {readJSON} from "./utils";
import {extractTime} from "./time";

const totalHours = 180;
const barSize = 36;

export const progressDisplay = async () => {
    let entryStorage = readJSON();
    let totalTime = Object.entries(entryStorage).map(([key, value]) => value.time).reduce((acc, v) => acc + v, 0);
    let parts = extractTime(totalTime);
    let progress = parts[0] / totalHours;

    term.clear();
    term.moveTo(2, 2).bold("Total time worked: ");
    term.moveTo(2, 3).green(`${parts[0]}h ${parts[1]}m`);

    term.moveTo(2, 5).bold("Total progress: ");
    term.bar(progress, {innerSize: barSize, barStyle: term.green});
    term.move(2, 0)(`${(progress * 100).toFixed(2)}%`);
    term.moveTo(1, 7);

    await new Promise<void>(resolve => {
        term.once("key", resolve);
    })
}