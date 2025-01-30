import { LastFmAuthenticator } from "../LastFmAuthenticator.ts";

export class BrowserLastFmAuthenticator implements LastFmAuthenticator {
  private static readonly LAST_FM_AUTH_URL = "https://www.last.fm/api/auth/";
  private readonly _clientId: string;

  constructor(clientId: string) {
    this._clientId = clientId;
  }

  authenticate(): Promise<string> {
    return new Promise((resolve, reject) => {
      const authUrl = new URL(BrowserLastFmAuthenticator.LAST_FM_AUTH_URL);
      const redirectUrl = browser.identity.getRedirectURL();
      authUrl.searchParams.append("api_key", this._clientId);
      authUrl.searchParams.append("cb", redirectUrl);

      browser.identity.launchWebAuthFlow(
        {
          url: authUrl.toString(),
          interactive: true,
        },
        (redirectUrl) => {
          if (browser.runtime.lastError) {
            reject(browser.runtime.lastError);
          } else if (redirectUrl) {
            const url = new URL(redirectUrl);
            const token = url.searchParams.get("token");
            if (token) {
              resolve(token);
            } else {
              reject(new Error("Authentication failed"));
            }
          } else {
            reject(new Error("No redirect URL"));
          }
        },
      );
    });
  }
}
