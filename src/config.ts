import {Category} from "./Category";

export default {

    // path to JSON file for storing logs
    filePath : "./data/log.json",

    // file browser to use when showing storage location
    fileBrowser : "nautilus",

    // if daily worked time should be shown in progress and while recording
    showDailyTime : true,

    // if JSON should be cached or read from disk everytime
    // (RECOMMENDED)
    allowJSONCache : true,

    // max length of message when shown in lists
    messageShowLength : 45,

    // how many logs to show in lists
    entryListLength : 15,

    // target of hours for project
    totalHours : 180,

    // show banner on startup
    showBanner : true,

    // work categories for entries
    // keys must be unique, but actual display IDs can be the same
    categories : {
        100: new Category(100, "Projektantrag"),
        200: new Category(200, "Vorstudie"),
        300: new Category(300, "Projektplanung"),
        400: new Category(400, "Individueller Teil"),
        450: new Category(450, "Individueller Teil - Implementierung"),
        600: new Category(600, "Implementierung"),
        700: new Category(700, "Code Refactoring"),
        800: new Category(800, "Testing"),
        900: new Category(900, "Diplomarbeit allgemein"),
        1000: new Category(1000, "Besprechung AG"),
        1100: new Category(1100, "Besprechung BL"),
        1200: new Category(1200, "Besprechung Teamintern"),
    } as Record<number, Category>,

    // default category to pre-select
    defaultCategory : 600
}