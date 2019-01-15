import type { IRequester } from "./requester.flow";
import Requester from "locktrip-svc-layer";
import { Config } from "./config";

let config = {
  domainPrefix: Config.getValue("domainPrefix"),
  apiHost: Config.getValue("apiHost")
};

let requester: IRequester = new Requester(localStorage, config);

export default requester;
