import {condenseTime, extractTime} from "./time";
import {term} from "./index";
import {Entry} from "./data/Entry";
import config from "./config";

const asyncInput = (...params : any[]) : Promise<string> => {
    return term.inputField(...params).promise;
}

// TODO: implement read-only mode
export const queryForm = async (entry: Entry, showZeroes: boolean) : Promise<Entry> => {
    term.clear();

    let [hours, minutes] = extractTime(entry.time);
    term.moveTo(2, 2).brightBlue.bold("Hours worked: ");
    hours = Number(
        await asyncInput({default: showZeroes ? String(hours) : hours && String(hours)})
    );
    term.moveTo(2, 3).brightBlue.bold("Minutes worked: ");
    minutes = Number(
        await asyncInput({default: showZeroes ? String(minutes) : minutes && String(minutes)})
    );
    entry.time = condenseTime([hours, minutes]);

    term.moveTo(2, 4).brightBlue.bold("Work category: ");
    term.moveTo(2, 5);
    let categoryMap = Object.entries(config.categories);
    let selectedIndex = entry.category === undefined ? config.defaultCategory : entry.category;
    selectedIndex = categoryMap.findIndex(([k, _]) => +k === selectedIndex);
    entry.category = await new Promise<number>(resolve => {
        term.singleColumnMenu(
            categoryMap.map(([id, c]) => ` ${c.displayId} ${c.name} `),
            {
                selectedIndex
            },
            (err: any, res: { selectedIndex: number }) => {
                resolve(+categoryMap[res.selectedIndex][0]);
            }
        )
    });
    term.moveTo(2, 5).eraseDisplayBelow();
    term.move(2, 0)(`${config.categories[entry.category].displayId} ${config.categories[entry.category].name}`);

    term.moveTo(2, 7).brightGreen.bold("Work log:");
    term.moveTo(1, 9);
    entry.message = await asyncInput({default: entry.message});

    return entry;
}
