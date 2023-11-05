import storage, {EntryStorage} from "./storage";
import {term} from "./index";
import {Entry} from "./data/Entry";

export const monthPicker = async () : Promise<EntryStorage> => {
    term.clear()
        .moveTo(2, 2)
        .green(`Select month`);
    term.moveTo(2, 3);

    let groups : {[key: string]: EntryStorage} = {};
    Object.entries(storage.get())
        .map(([key, value]) : [number, Date, Entry] => [+key, new Date(+key), value])
        .sort((a, b) => b[1].valueOf() - a[1].valueOf())
        .map(([key, date, value]) : [number, string, Entry] => [key, date.toLocaleString("default", {month: "long", year: "numeric"}), value])
        .forEach(([key, month, value]) => {
            if (!(month in groups)) {
                groups[month] = {};
            }

            groups[month] = {[key]: value, ...groups[month]};
        });

    let lines : [string, number][] = Object.entries(groups).map(([key, value]) => [key, Object.keys(value).length]);
    let month = await new Promise<string>(resolve => {
        term.singleColumnMenu(
            lines.map(([k, v]) => `${k.padEnd(15, " ")} | ${v} entries `),
            (err: any, res: {selectedIndex: number}) => {
                resolve(lines[res.selectedIndex][0]);
            }
        )
    })

    return groups[month];
}

export const toTabulatedValues = (entries: EntryStorage) : string => {
    return Object.entries(entries).map(([k, v]) => {
        let d = new Date(+k);
        let h = v.time / 1000 / 60 / 60;
        let h_string = h.toFixed(2).replace(".", ",");

        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}\t${v.message}\t${v.category}\t${h_string}`
    }).join("\n");
}