import {
  HotelReservationFactoryContract,
  initHotelReservationContract,
  HotelReservationFactoryContractWithWallet
} from "./config/contracts-config";
import {
  ReservationValidators
} from "./validators/reservationValidators";
import {
  formatEndDateTimestamp,
  formatStartDateTimestamp,
} from "./utils/timeHelper";
import {
  TokenValidators
} from "./validators/tokenValidators";
import {
  approveContract
} from "./utils/approveContract";
import {
  getGasPrice
} from "./utils/ethFuncs"
import ethers from 'ethers';
import {
  EtherValidators
} from "./validators/etherValidators"

const gasConfig = require('./config/gas-config.json');
const errors = require('./config/errors.json');

export class HotelReservation {
  static async createReservation(jsonObj,
    password,
    hotelReservationId,
    reservationCostLOC,
    reservationStartDate,
    reservationEndDate,
    daysBeforeStartForRefund,
    refundPercentages,
    hotelId,
    roomId,
    numberOfTravelers) {

    const reservationStartDateFormatted = formatStartDateTimestamp(reservationStartDate);
    const reservationEndDateFormatted = formatEndDateTimestamp(reservationEndDate);
    const hotelReservationIdBytes = ethers.utils.toUtf8Bytes(hotelReservationId);
    const hotelIdBytes = ethers.utils.toUtf8Bytes(hotelId);
    const roomIdBytes = ethers.utils.toUtf8Bytes(roomId);
    let wallet = await ethers.Wallet.fromEncryptedWallet(jsonObj, password);
    const gasPrice = await getGasPrice();
    let overrideOptions = {
      gasLimit: gasConfig.hotelReservation.create,
      gasPrice: gasPrice
    };

    await ReservationValidators.validateReservationParams(jsonObj,
      password,
      hotelReservationIdBytes,
      reservationCostLOC,
      reservationStartDateFormatted,
      reservationEndDateFormatted,
      daysBeforeStartForRefund,
      refundPercentages,
      hotelIdBytes,
      roomIdBytes,
      numberOfTravelers);

    if (daysBeforeStartForRefund.length > 2) {
      overrideOptions.gasLimit = gasConfig.hotelReservation.complexCreate
    };


    await TokenValidators.validateLocBalance(wallet.address, reservationCostLOC, wallet, gasConfig.hotelReservation.create);
    await EtherValidators.validateEthBalance(wallet, overrideOptions.gasLimit);

    await approveContract(wallet, reservationCostLOC, HotelReservationFactoryContract.address, gasPrice);

    let HotelReservationFactoryContractWithWalletInstance = HotelReservationFactoryContractWithWallet(wallet);

    const createReservationTxHash = await HotelReservationFactoryContractWithWalletInstance.createHotelReservation(hotelReservationIdBytes,
      reservationCostLOC,
      reservationStartDateFormatted,
      reservationEndDateFormatted,
      daysBeforeStartForRefund,
      refundPercentages,
      hotelIdBytes,
      roomIdBytes,
      numberOfTravelers,
      overrideOptions
    );

    return createReservationTxHash;
  }

  static async cancelReservation(jsonObj,
    password,
    hotelReservationId) {

    if (!jsonObj || !password || !hotelReservationId) {
      throw new Error(errors.INVALID_PARAMS);
    }
    let wallet = await ethers.Wallet.fromEncryptedWallet(jsonObj, password);
    const gasPrice = await getGasPrice();

    await EtherValidators.validateEthBalance(wallet, gasConfig.hotelReservation.cancel);

    const hotelReservationIdBytes = ethers.utils.toUtf8Bytes(hotelReservationId);

    const reservation = await this.getReservation(hotelReservationId);

    ReservationValidators.validateCancellation(reservation._refundPercentages,
      reservation._daysBeforeStartForRefund,
      reservation._reservationStartDate,
      reservation._customerAddress,
      wallet.address);

    let HotelReservationFactoryContractWithWalletInstance = HotelReservationFactoryContractWithWallet(wallet);
    const overrideOptions = {
      gasLimit: gasConfig.hotelReservation.cancel,
      gasPrice: gasPrice
    };

    const cancelReservationTxHash = await HotelReservationFactoryContractWithWalletInstance.cancelHotelReservation(hotelReservationIdBytes, overrideOptions);

    return cancelReservationTxHash;
  }

  static async getReservation(hotelReservationId) {
    const hotelReservationContractAddress = await ReservationValidators.validateBookingExists(hotelReservationId);
    const hotelReservationContract = initHotelReservationContract(hotelReservationContractAddress);
    const reservation = await hotelReservationContract.getHotelReservation();
    return reservation;
  }

  static async disputeReservation(jsonObj,
    password,
    hotelReservationId) {

    if (!jsonObj || !password || !hotelReservationId) {
      throw new Error(errors.INVALID_PARAMS);
    }

    let wallet = await ethers.Wallet.fromEncryptedWallet(jsonObj, password);
    const hotelReservationIdBytes = ethers.utils.toUtf8Bytes(hotelReservationId);
    const gasPrice = await getGasPrice();
    await EtherValidators.validateEthBalance(wallet, gasConfig.hotelReservation.dispute);

    const reservation = await this.getReservation(hotelReservationId);

    ReservationValidators.validateDispute(wallet.address, reservation._customerAddress, reservation._reservationStartDate, reservation._reservationEndDate, reservation._isDisputeOpen);

    let HotelReservationFactoryContractWithWalletInstance = HotelReservationFactoryContractWithWallet(wallet);
    const overrideOptions = {
      gasLimit: gasConfig.hotelReservation.dispute,
      gasPrice: gasPrice
    };

    const openDisputeTxHash = await HotelReservationFactoryContractWithWalletInstance.dispute(hotelReservationIdBytes, overrideOptions);

    return openDisputeTxHash;
  }
}
