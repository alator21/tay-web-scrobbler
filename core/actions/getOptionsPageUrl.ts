import { ResponseType } from "@/core/domain/Communicator.ts";
import { UrlManager } from "@/core/domain/UrlManager.ts";

export async function getOptionsPageUrl(
  urlManager: UrlManager,
): Promise<Extract<ResponseType, { type: "GET_OPTIONS_PAGE_URL" }>> {
  return {
    type: "GET_OPTIONS_PAGE_URL",
    success: true,
    url: urlManager.optionsUrl(),
  };
}
