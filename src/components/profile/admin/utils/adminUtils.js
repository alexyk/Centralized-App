import { Config } from "../../../../config";

export function getAxiosConfig() {
  let result = {
    headers: {
      Authorization: localStorage[Config.getValue("domainPrefix") + ".auth.locktrip"]
    }
  }

  return result;
}
