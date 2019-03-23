import { stopIds } from '../../../constants/constants';

export function getStopName(stopId) {
  switch (stopId) {
    case stopIds.D:
      return 'Direct Flight';
      break;
    case stopIds.O:
      return 'One stop';
      break;
    case stopIds.M:
      return 'Multi stop';
      break;
    default:
      return 'All';
      break;
  }
}
