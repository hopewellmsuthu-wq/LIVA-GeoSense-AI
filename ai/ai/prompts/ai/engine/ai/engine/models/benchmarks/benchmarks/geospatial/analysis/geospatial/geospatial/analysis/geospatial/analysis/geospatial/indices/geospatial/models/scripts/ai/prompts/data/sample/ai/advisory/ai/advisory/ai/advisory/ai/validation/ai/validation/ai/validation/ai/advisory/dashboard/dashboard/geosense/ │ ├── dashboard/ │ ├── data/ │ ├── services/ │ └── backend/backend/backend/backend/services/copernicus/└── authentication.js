/**
 * =========================================================
 * LIVA GEOSENSE
 * COPERNICUS AUTHENTICATION
 * =========================================================
 */

"use strict";


let cachedToken = null;

let tokenExpiresAt = 0;


/**
 * Get a valid Copernicus access token.
 *
 * Tokens are cached so we don't request a new
 * token for every satellite request.
 */

async function getAccessToken() {

    const now =
        Date.now();


    /*
     * Reuse token while it is still valid.
     * Five-minute safety buffer.
     */

    if (
        cachedToken &&
        now <
        tokenExpiresAt - 300000
    ) {

        return cachedToken;

    }


    const clientId =
        process.env.CDSE_CLIENT_ID;


    const clientSecret =
        process.env.CDSE_CLIENT_SECRET;


    if (
        !clientId ||
        !clientSecret
    ) {

        throw new Error(
            "Copernicus credentials are not configured."
        );

    }


    const tokenUrl =
        process.env.CDSE_TOKEN_URL;


    const body =
        new URLSearchParams({

            grant_type:
                "client_credentials",

            client_id:
                clientId,

            client_secret:
                clientSecret

        });


    const response =
        await fetch(
            tokenUrl,
            {

                method:
                    "POST",

                headers: {

                    "Content-Type":
                        "application/x-www-form-urlencoded"

                },

                body:
                    body.toString()

            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            `Copernicus authentication failed (${response.status}): ${message}`
        );

    }


    const data =
        await response.json();


    cachedToken =
        data.access_token;


    tokenExpiresAt =
        now +
        (
            Number(
                data.expires_in || 3600
            ) *
            1000
        );


    return cachedToken;

}


module.exports = {

    getAccessToken

};
