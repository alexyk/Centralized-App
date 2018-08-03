import { modalsInfo } from './actionTypes';

export function openModal(modal) {
  return {
    type: modalsInfo.OPEN_MODAL,
    payload: modal
  };
}

export function closeModal(modal) {
  return {
    type: modalsInfo.CLOSE_MODAL,
    payload: modal
  };
}


export function airdropModals(modal) {
  return {
    type: modalsInfo.AIRDROP_MODALS,
    payload: modal
  };
}
