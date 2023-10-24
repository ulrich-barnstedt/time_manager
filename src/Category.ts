export class Category {
    name: string;
    displayId: string;

    constructor(id: number, name: string) {
        this.name = name;
        this.displayId = String(id).padStart(4, " ");
    }
}
