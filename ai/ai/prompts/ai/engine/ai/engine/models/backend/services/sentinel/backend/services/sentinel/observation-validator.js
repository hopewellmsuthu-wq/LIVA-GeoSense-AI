if (
    !isValidObservation(
        processed.statistics
    )
) {

    throw new Error(
        "Invalid NDVI observation."
    );

}
