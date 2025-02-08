# How to publish to chrome web store

Kinda follow this guide https://developer.chrome.com/docs/webstore/using-api#setup

<hr>

1. Go to https://console.cloud.google.com/auth/overview?inv=1&invt=AbpCDg&project=tay-web-scrobbler
2. Clients -> Press your client
3. Grab clientId and clientSecret
4. Go to https://developers.google.com/oauthplayground
5. Click on the settings icon on the top right and "use your own credentials"
6. Enter your client id and secret
7. Add https://www.googleapis.com/auth/chromewebstore to the "Input your own scopes" field.
8. "Authorize APIs"
9. "Exchange authorization code for tokens"
10. Grab the refresh token
11. The following variables must be available when publishing the extension
    1. CHROME_EXTENSION_ID (dodeagheafpgcfcblodiacfjbcfnfgcj)
    2. CHROME_CLIENT_ID
    3. CHROME_CLIENT_SECRET
    4. CHROME_REFRESH_TOKEN
