import { UrlManager } from "../UrlManager.ts";

export class BrowserUrlManager implements UrlManager {
  optionsUrl(): string {
    return browser.runtime.getURL("/options.html");
  }
}
