const express = require("express");

express()
  .get("/", (req, res) => {
    res.send("ok");
  })
  .get("/data", (req, res) => {
    res.json({ some: "data" });
  })
  .get("/error/:code", (req, res) => {
    res.status(req.params.code).send("Boom!");
  })
  .get("/close", (req, res) => {
    setTimeout(() => req.socket.destroy(), 1000);
  })
  .listen(5000, () => {
    console.log("Listening at http://localhost:5000");
  });