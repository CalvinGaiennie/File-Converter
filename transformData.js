const fs = require("fs");
const csv = require("csv-parser");
const { v4: uuidv4 } = require("uuid"); // For generating unique IDs

// Define a mapping of error statuses to mistake types
const mistakeTypesMap = {
  "Major Count": "Count Error",
  "Minor Count": "Count Error",
  Packaging: "Packaging Error",
  Profile: "Wrong Item",
  "missing-item": "Missing Item",
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
        mistakeType:
          mistakeTypesMap[errorStatus.toLowerCase()] || "Unknown Error",
      }),
    };
    results.push(transformedRow);
  })
  .on("end", () => {
    // Save to JSON
    fs.writeFileSync("output.json", JSON.stringify(results, null, 2));
    console.log("Data transformed and saved to output.json");
  });
