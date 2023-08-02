import config from "./config";
import fs from "fs";
import {term} from "./index";
import {Entry} from "./Entry";

type EntryStorage = {[key: number] : Entry};

export const readJSON = () : EntryStorage => {
    return JSON.parse(fs.readFileSync(config.filePath, "utf-8"));
}

export const writeJSON = (data: EntryStorage) => {
    fs.writeFileSync(config.filePath, JSON.stringify(data, null, 2));
}

export const saveNewEntry = (entry: Entry) => {
    let storage = readJSON();
    storage[Date.now()] = entry;
    writeJSON(storage);
}

export const asyncInput = async (...params : any[]) : Promise<string> => {
    return await term.inputField(...params).promise;
}
