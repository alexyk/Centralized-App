import {Config} from "../../../config";
import { stopIds } from '../../../constants/constants';

export function getFilters(searchId) {
  return fetch(`${Config.getValue('apiHost')}flight/search/filter/data?searchId=${searchId}`)
    .then(res => { return res; });
}

export function sort(results, filters) {
    if (!filters.length) {
      return results;
    }

    const items = Object.values(results).filter(item => {
      const segment = item.segments;
      const segmentLength = segment.length;
      const isDirectFlight = segmentLength === 2 && filters.stops.indexOf(stopIds.D) !== -1;
      const isOneway = segmentLength === 4 && filters.stops.indexOf(stopIds.O) !== -1;
      const isMulticity = segmentLength > 4 && filters.stops.indexOf(stopIds.M) !== -1;

      if(filters.stops.length > 0) {
        if (isDirectFlight) {
          return true;
        } else if (isOneway) {
          return true;
        } else if (isMulticity) {
          return true;
        }
      }
    });

    return items;
}
