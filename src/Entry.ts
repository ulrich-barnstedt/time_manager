export class Entry {
    message: string | undefined;
    time: number;
    category: number | undefined;

    constructor(time: number, category: number | undefined = undefined, message: string | undefined = undefined) {
        this.message = message;
        this.time = time;
        this.category = category;
    }
}