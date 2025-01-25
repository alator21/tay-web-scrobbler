import { UrlManager } from "../../core/UrlManager";

export class ChromeUrlManager implements UrlManager {
  optionsUrl(): string {
    return chrome.runtime.getURL('options.html')
  }
}
