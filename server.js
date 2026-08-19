"use strict";

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        service: "LIVA GeoSense API",
        status: "operational",
        version: "1.0.0",
        timestamp: new Date().toISOString()
    });
});

app.get("/api", (req, res) => {
    res.json({
        name: "LIVA GeoSense API",
        description: "Geospatial Agricultural Intelligence Platform",
        status: "online"
    });
});

app.use(express.static(path.join(__dirname, "app")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "app", "index.html"));
});

app.listen(PORT, () => {
    console.log("=================================");
    console.log("LIVA GeoSense");
    console.log("=================================");
    console.log(`Server running on port ${PORT}`);
});
