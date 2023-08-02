type splitTime = [h: number, m: number];

export const extractTime = (ts: number) : splitTime => {
    let h = Math.floor(ts / 1000 / 60 / 60);
    let m = Math.ceil(ts / 1000 / 60) - h * 60;
    return [h, m];
}

export const condenseTime = (parts: splitTime) : number => {
    return parts[0] * 1000 * 60 * 60 + parts[1] * 1000 * 60;
}