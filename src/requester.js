import Requester from "locktrip-service-layer";
import { Config } from "./config";
import type { IRequester } from "./requester.flow";

let config = {
  domainPrefix: Config.getValue("domainPrefix"),
  apiHost: Config.getValue("apiHost")
};

let requester: IRequester = new Requester(localStorage, config);

export default requester;
