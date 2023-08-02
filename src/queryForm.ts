import {condenseTime, extractTime} from "./time";
import {asyncInput} from "./utils";
import {term} from "./index";
import {Entry} from "./Entry";

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

    term.moveTo(2, 5).brightGreen.bold("Work log:");
    term.moveTo(1, 7);
    entry.message = await asyncInput({default: entry.message});
    term("\n");

    return entry;
}
