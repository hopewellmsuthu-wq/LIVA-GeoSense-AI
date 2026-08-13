"""
LIVA GeoSense
Response Validator Test
"""

from ai.validation import ResponseValidator


def main():

    context = {

        "observed_data": {

            "current_ndvi": 0.49,

            "previous_ndvi": 0.68,

            "rainfall_mm": 42.0,

            "soil_moisture": 31.5
        },

        "risk_assessment": {

            "level": "MODERATE"
        }
    }

    good_response = """
    ## Situation

    The available data shows that NDVI has declined
    from 0.68 to 0.49.

    ## What the data may indicate

    This may indicate vegetation stress, but the
    available data cannot determine the exact cause.

    ## What we cannot determine

    The available information cannot confirm whether
    the cause is disease, pests, nutrients or another
    environmental factor.

    ## Recommended next steps

    Inspect the field and verify the crop condition.
    Additional information from the farmer or an
    agronomist may help identify the cause.

    ## Confidence

    MODERATE
    """

    validator = ResponseValidator(
        context
    )

    result = validator.validate(
        good_response
    )

    print()
    print("=" * 60)
    print("LIVA GEOSENSE RESPONSE VALIDATOR")
    print("=" * 60)
    print()

    print(
        f"Status: {result['status']}"
    )

    print(
        f"Passed: {result['passed']}"
    )

    if result["issues"]:

        print()
        print("Issues:")

        for issue in result["issues"]:

            print(
                f" - {issue}"
            )

    print()
    print("=" * 60)


if __name__ == "__main__":
    main()
