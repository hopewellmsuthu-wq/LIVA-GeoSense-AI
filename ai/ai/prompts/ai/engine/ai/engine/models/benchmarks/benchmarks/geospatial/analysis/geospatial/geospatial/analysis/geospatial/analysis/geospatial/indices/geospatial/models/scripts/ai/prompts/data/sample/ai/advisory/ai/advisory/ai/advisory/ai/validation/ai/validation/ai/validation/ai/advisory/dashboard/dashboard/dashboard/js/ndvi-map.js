"use strict";


let ndviLayer = null;


/**
 * NDVI colour scale
 */
function ndviColor(value) {

    if (
        value === null ||
        !Number.isFinite(value)
    ) {

        return "transparent";

    }


    if (value < 0.10) {
        return "#b91c1c";
    }


    if (value < 0.20) {
        return "#ef4444";
    }


    if (value < 0.35) {
        return "#f97316";
    }


    if (value < 0.50) {
        return "#eab308";
    }


    if (value < 0.65) {
        return "#84cc16";
    }


    if (value < 0.80) {
        return "#22c55e";
    }


    return "#15803d";

}


/**
 * Render NDVI raster on Leaflet map
 */
async function displayNDVIRaster(
    map,
    rasterBuffer
) {

    if (!map) {

        throw new Error(
            "GeoSense map instance is required."
        );

    }


    if (!rasterBuffer) {

        throw new Error(
            "NDVI raster data is required."
        );

    }


    const georaster =
        await parseGeoraster(
            rasterBuffer
        );


    if (ndviLayer) {

        map.removeLayer(
            ndviLayer
        );

    }


    ndviLayer =
        new GeoRasterLayer({

            georaster,

            opacity:
                0.72,

            resolution:
                256,

            pixelValuesToColorFn:
                values => {

                    const value =
                        values[0];

                    return ndviColor(
                        value
                    );

                }

        });


    ndviLayer.addTo(
        map
    );


    try {

        map.fitBounds(
            ndviLayer.getBounds(),
            {
                padding:
                    [30, 30]
            }
        );

    }

    catch (error) {

        console.warn(
            "Could not fit NDVI layer bounds.",
            error
        );

    }


    return ndviLayer;

}


window.GeoSenseNDVIMap = {

    displayNDVIRaster,

    ndviColor

};
