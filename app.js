const express = require("express");
const app = express();
const mongoose = require("mongoose");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Database connection successful");
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req,res) => {
    res.send("Hello World");
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
