import fs from "fs";

// Write data to the file
fs.writeFile("sample.txt", "Welcome to Node.js File System Module.\n", (err) => {
    if (err) throw err;
    console.log("File created and data written successfully.");

    // Append data to the file
    fs.appendFile("sample.txt", "This line is appended using appendFile().\n", (err) => {
        if (err) throw err;
        console.log("Data appended successfully.");

        // Read the file
        fs.readFile("sample.txt", (err, data) => {
            if (err) throw err;
            console.log("\nFile Content:");
            console.log(data.toString());

            // Rename the file
            fs.rename("sample.txt", "newSample.txt", (err) => {
                if (err) throw err;
                console.log("File renamed successfully.");

                // Delete the renamed file
                fs.unlink("newSample.txt", (err) => {
                    if (err) throw err;
                    console.log("File deleted successfully.");
                });
            });
        });
    });
});