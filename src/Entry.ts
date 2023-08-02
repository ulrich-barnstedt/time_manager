export class Entry {
    message: string | undefined;
    time: number;

    constructor(time: number, message: string | undefined = undefined) {
        this.message = message;
        this.time = time;
    }
}