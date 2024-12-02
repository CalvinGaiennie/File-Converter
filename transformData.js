const fs = require("fs");
const csv = require("csv-parser");
const { v4: uuidv4 } = require("uuid"); // For generating unique IDs

// Read CSV
const results = [];
fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", (row) => {
    const transformedRow = {
      _id: uuidv4(),
      OrderNumber: row["Order Number"],
      Date: row["Timestamp"].split(" ")[0], // Extract date
      OrderContent: row["Content"],
      OrderPuller: row["Content"].split("/")[0], // Example logic
      OrderStatus:
        row["Error or Correct?"] === "It was Correct" ? "correct" : "incorrect",
      OrderChecker: row["REMINDER: Signed by Checker?"], // Adjust as needed
      ...(row["Error or Correct?"] !== "It was Correct" && {
        mistakeType: "count-error", // Replace with logic if needed
      }),
      __v: 0,
    };
    results.push(transformedRow);
  })
  .on("end", () => {
    // Save to JSON
    fs.writeFileSync("output.json", JSON.stringify(results, null, 2));
    console.log("Data transformed and saved to output.json");
  });
