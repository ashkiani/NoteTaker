// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");


// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
// =============================================================

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", function (req, res) {
    let jsonContent = getJSONData();
    return res.json(jsonContent);
    // res.sendFile(path.join(__dirname, "db", "db.json"));
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Create New Note - takes in JSON input
app.post("/api/notes", function (req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    let newNote = req.body;
    newNote.id = Date.now();
    console.log(newNote);
    let jsonContent = getJSONData();
    jsonContent.push(newNote);
    fs.writeFileSync(path.join(__dirname, "db", "db.json"), JSON.stringify(jsonContent));
    res.json(jsonContent);
});

// DELETE implementation
app.delete("/api/notes/:id",
    function (req, res) {
        console.log("Deleting id:" + req.params.id);
        let jsonContent = getJSONData();
        //Remove the record with the matching id 
        let updatedJSON = jsonContent.filter(function (definition) {
            return definition.id != req.params.id;
        });
        //Save the updated JSON back to the file
        fs.writeFileSync(path.join(__dirname, "db", "db.json"), JSON.stringify(updatedJSON));
        res.json(updatedJSON); //sending the updated response back to client app.
    });

function getJSONData() {
    let contents = fs.readFileSync(path.join(__dirname, "db", "db.json"));
    return JSON.parse(contents);
}

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
