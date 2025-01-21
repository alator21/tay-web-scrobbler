
export interface LastFmAuthenticator {
  authenticate(): Promise<string>;
}
