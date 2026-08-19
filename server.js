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


app.get("/api/ndvi", (req, res) => {
    const nir = Number(req.query.nir);
    const red = Number(req.query.red);

    if (!Number.isFinite(nir) || !Number.isFinite(red)) {
        return res.status(400).json({
            success: false,
            error: "Provide valid nir and red values"
        });
    }

    const denominator = nir + red;

    if (denominator === 0) {
        return res.status(400).json({
            success: false,
            error: "Invalid reflectance values"
        });
    }

    const ndvi = (nir - red) / denominator;

    let classification;

    if (ndvi < 0) {
        classification = "Water / Non-vegetation";
    } else if (ndvi < 0.2) {
        classification = "Bare soil / Sparse vegetation";
    } else if (ndvi < 0.4) {
        classification = "Moderate vegetation";
    } else if (ndvi < 0.6) {
        classification = "Healthy vegetation";
    } else {
        classification = "Very healthy vegetation";
    }

    res.json({
        success: true,
        ndvi: Number(ndvi.toFixed(4)),
        classification,
        inputs: { nir, red }
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
