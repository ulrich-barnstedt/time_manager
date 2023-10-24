const data = require("./log.json");

const kontierung = 600;
const entries = Object.entries(data).map(([k, v]) => {
    let d = new Date(+k);
    let h = v.time / 1000 / 60 / 60;
    h = h.toFixed(2).replace(".", ",");
    
    return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}\t${v.message}\t${kontierung}\t${h}`
});

const strs = entries.join("\n");
console.log(strs);

