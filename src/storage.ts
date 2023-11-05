import config from "./config";
import fs from "fs";
import path from "path";
import {Entry} from "./data/Entry";

export type EntryStorage = {[key: number] : Entry};

class StorageManager {
    private cache: EntryStorage | undefined;

    private ensureFolder () {
        fs.mkdirSync(path.dirname(config.filePath), {
            recursive: true
        })
    }

    private read () : EntryStorage {
        this.ensureFolder();
        if (!fs.existsSync(config.filePath)) return {};

        return JSON.parse(fs.readFileSync(config.filePath, "utf-8"));
    }

    public get () : EntryStorage {
        if (config.allowJSONCache) {
            if (this.cache === undefined) {
                this.cache = this.read();
            }

            return this.cache;
        }

        return this.read();
    }

    public write (data: EntryStorage) {
        if (config.allowJSONCache) {
            this.cache = data;
        }

        this.ensureFolder();
        fs.writeFileSync(config.filePath, JSON.stringify(data, null, 2));
    }

    public async with (fn : (es: EntryStorage) => EntryStorage | void | Promise<void> | Promise<EntryStorage>) {
        let storage = this.get();

        let result = await fn(storage);
        if (result !== undefined) storage = result;

        this.write(storage);
    }

    public modifyEntryStorage = this.with;
}

export default new StorageManager();
