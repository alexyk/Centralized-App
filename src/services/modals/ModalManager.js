import { openModal, closeModal } from '../../actions/modalsInfo';

export default class ModalManager {
  static open(modal, dispatch) {
    dispatch(openModal(modal));
  }

  static close(modal, dispatch) {
    dispatch(closeModal(modal));
  }
}