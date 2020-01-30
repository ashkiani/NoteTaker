// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");


// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
// =============================================================

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", function (req, res) {
    // Get content from file
    let contents = fs.readFileSync(path.join(__dirname, "db", "db.json"));
    // Define to JSON type
    var jsonContent = JSON.parse(contents);
    return res.json(jsonContent);
    // res.sendFile(path.join(__dirname, "db", "db.json"));
});

// Create New Note - takes in JSON input
app.post("/api/notes", function (req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    var newNote = req.body;
    console.log(newNote);
    let contents = fs.readFileSync(path.join(__dirname, "db", "db.json"));
    // Define to JSON type
    var jsonContent = JSON.parse(contents);
    jsonContent.push(newNote);
    fs.writeFileSync(path.join(__dirname, "db", "db.json"), JSON.stringify(jsonContent));
    res.json(jsonContent);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
