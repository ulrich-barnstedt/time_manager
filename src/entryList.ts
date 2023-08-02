import {readJSON} from "./utils";

export const entryList = () => {
    let entries = readJSON();
    let slicedEntries = Object.fromEntries(Object.entries(entries).slice(-10));

    /*
    FMT :   [DATE dd.mm.yy hh:mm] [xh xm] [15 char msg]
     */
}