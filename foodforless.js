"use strict;"

const express = require("express");
const app = express();
const fs = require("fs");

app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));

app.get("/", (req, res) => {
  let file = fs.readFileSync("./app/html/index.html", "utf-8");
    res.send(file);
});

const port = 8000;
app.listen(port, () => {
  console.log("Application is listening on port 8000!");
});