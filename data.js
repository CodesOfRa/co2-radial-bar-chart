const fs = require("fs")
const constants = require("./constants.js")
// import data from "data.json"
let data = fs.readFileSync("public/grouped-data.json")
var newData = JSON.parse(data);
Object.keys(newData).map(x => {
    // console.log(newData[x])
    var a = newData[x].filter((value) => constants.COUNTRIES.includes(value.Code))
    // console.log(a["Consumption_Emissions"]);
    // a["Consumption_Emissions"] = a["Consumption_Emissions"] * 3.664
    // console.log(a["Consumption_Emissions"]);
    a.map((x) => {
        x["Consumption_Emissions"] = x["Consumption_Emissions"] * 3.664
    })
    a.sort((x, y) => {
        if (x.Code > y.Code) {
            return 1
        } else if (x.Code < y.Code) {
            return -1
        }
    })
    newData[x] = a;
})

// // console.log(newData["1990"]);
fs.writeFile("newData.json", JSON.stringify(newData), 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }

    console.log("JSON file has been saved.");
});
// console.log(newData["1990"])