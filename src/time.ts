import {EntryStorage} from "./storage";

type splitTime = [h: number, m: number];

export const extractTime = (ts: number) : splitTime => {
    let h = Math.floor(ts / 1000 / 60 / 60);
    let m = Math.ceil(ts / 1000 / 60) - h * 60;
    return [h, m];
}

export const condenseTime = (parts: splitTime) : number => {
    return parts[0] * 1000 * 60 * 60 + parts[1] * 1000 * 60;
}

export const totalTime = (es: EntryStorage) : number => {
    return Object.entries(es)
        .map(([key, value]) => value.time)
        .reduce((acc, v) => acc + v, 0);
}

export const dailyTime = (es: EntryStorage) : number => {
    let today = new Date();

    return Object.entries(es)
        .filter(([key]) => {
            let then = new Date(Number(key));

            return today.getDate() == then.getDate() &&
                today.getMonth() == then.getMonth() &&
                today.getFullYear() == then.getFullYear();
        })
        .map(([key, value]) => value.time)
        .reduce((acc, v) => acc + v, 0);
}

export const formatTime = (time: number, padding: boolean = false) : string => {
    let parts = extractTime(time);

    if (padding) {
        return `${parts[0]}h ${String(parts[1]).padStart(2)}m`;
    } else {
        return `${parts[0]}h ${parts[1]}m`;
    }
}