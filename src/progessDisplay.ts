import {term} from "./index";
import {dailyTime, extractTime, formatTime, totalTime} from "./time";
import storage from "./storage";
import config from "./config";

const barSize = 36;

export const progressDisplay = async () => {
    let entries = storage.get();
    let total = totalTime(entries);
    let parts = extractTime(total);
    let progress = parts[0] / config.totalHours;

    term.clear();
    term.moveTo(2, 2).bold("Total time worked: ");
    term.moveTo(2, 3).green(formatTime(total));

    term.moveTo(2, 5).bold("Total progress: ");
    term.bar(progress, {innerSize: barSize, barStyle: term.green.bgGray});
    term.move(2, 0)(`${(progress * 100).toFixed(2)}%`);

    if (config.showDailyTime) {
        let dailyTotal = dailyTime(entries);

        term.moveTo(25, 2).italic.gray("Daily progress: ");
        term.moveTo(25, 3).italic.cyan(formatTime(dailyTotal));
    }

    term.moveTo(1, 7);
    await new Promise<void>(resolve => {
        term.once("key", resolve);
    })
}