const fs = require("fs");
const csv = require("csv-parser");
const { v4: uuidv4 } = require("uuid"); // For generating unique IDs
const test = "git test";
// Define a mapping of error statuses to mistake types
const mistakeTypesMap = {
  "Major Count": "Major Count",
  "Minor Count": "Minor Count",
  "Major Count (off by 6% or more) (To calculate divide the ammount off by the total they shouldve pulled) (Ex. shouldve pulled 17 but actually pulled 14. they were three short so 3/17 =.176. .176x100 is 17.6 so they were 17.6% off so this is a major count error.)":
    "Major Count",
  "Minor Count (off by 5% or less) (To calculate divide the ammount off by the total they shouldve pulled then multiply by 100) (Ex. shouldve pulled 21 but actually pulled 20. they were three short so 1/21 =.047. .047x100 in 4.7  so they were 4.7% off so this is a minor count error.)":
    "Minor Count",
  Packaging: "Packaging",
  Profile: "Profile",
  Damage: "Damage",
  // Add more as needed
};

// Read CSV
const results = [];
fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", (row) => {
    const errorStatus = row["Error or Correct?"];

    const transformedRow = {
      _id: uuidv4(),
      OrderNumber: row["Order Number"],
      Date: row["Timestamp"].split(" ")[0], // Extract date
      OrderContent: row["Content"],
      OrderPuller: row["Puller"], // Example logic
      OrderStatus: errorStatus === "It was Correct" ? "correct" : "incorrect",
      OrderChecker: row["Checker"], // Adjust as needed
      __v: 0,
      // Add mistake type dynamically based on the error status
      ...(errorStatus !== "It was Correct" && {
        mistakeType: mistakeTypesMap[errorStatus] || "Unknown Error",
      }),
    };
    results.push(transformedRow);
  })
  .on("end", () => {
    // Save to JSON
    fs.writeFileSync("output.json", JSON.stringify(results, null, 2));
    console.log("Data transformed and saved to output.json");
  });

("mistakeTypesMap[errorStatus.toLowerCase()]");
