import { Config } from "../../../../config";

export function getAxiosConfig(url,methodIsPost,data=null) {
  let result = {
    url,
    method: (methodIsPost ? 'post' : 'get'),
    headers: {
      Authorization: localStorage[Config.getValue("domainPrefix") + ".auth.locktrip"]
    }
  }

  if (methodIsPost) result.data = data;

  return result;
}
