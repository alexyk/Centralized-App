import {
  HotelReservationFactoryContract,
  initHotelReservationContract,
  HotelReservationFactoryContractWithWallet,
  SimpleReservationMultipleWithdrawersContract,
  SimpleReservationMultipleWithdrawersContractWithWallet,
  SimpleReservationSingleWithdrawerContract,
  SimpleReservationSingleWithdrawerContractWithWallet
} from "./config/contracts-config";
import {
  ReservationValidators
} from "./validators/reservationValidators";
import {
  formatEndDateTimestamp,
  formatStartDateTimestamp,
  formatTimestampToDays
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

    const createReservationTxResult = await HotelReservationFactoryContractWithWalletInstance.createHotelReservation(hotelReservationIdBytes,
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

    return createReservationTxResult;
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

    const cancelReservationTxResult = await HotelReservationFactoryContractWithWalletInstance.cancelHotelReservation(hotelReservationIdBytes, overrideOptions);

    return cancelReservationTxResult;
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

    const openDisputeTxResult = await HotelReservationFactoryContractWithWalletInstance.dispute(hotelReservationIdBytes, overrideOptions);

    return openDisputeTxResult;
  }

  /**
   * Function to create simple reservation with multiple withdrawers
   * @param {String} jsonObj  - User's wallet jsonObj as string
   * @param {String} password  - User's wallet password as string
   * @param {String} hotelReservationId - The Id of the reservations, shouldn't be more than 32 symbols 
   * @param {String} reservationCostLOC  - The price of the reservation in Wei, as String
   * @param {Timestamp} withdrawDateInSeconds  - The date after which the funds can be withdrawn (check out date of the booking). Should be timestamp in seconds.
   * @param {String} recipientAddress - The address of the person that should withdraw the funds after reservation checkout.
   * @returns {JSONObject} createReservationMultipleWithdrawersTxResult - The result from the transaction when creating a reservation.
   */

  static async createSimpleReservationMultipleWithdrawers(jsonObj,
    password,
    hotelReservationId,
    reservationCostLOC,
    withdrawDateInSeconds,
    recipientAddress) {

    const withdrawDateFormatted = formatEndDateTimestamp(withdrawDateInSeconds);
    const hotelReservationIdBytes = ethers.utils.toUtf8Bytes(hotelReservationId);

    let wallet = await ethers.Wallet.fromEncryptedWallet(jsonObj, password);
    const gasPrice = await getGasPrice();
    let overrideOptions = {
      gasLimit: gasConfig.simpleReservationMultipleWithdrawers.create,
      gasPrice: gasPrice
    };

    await ReservationValidators.validateSimpleReservationMultipleWithdrawersParams(jsonObj, password, hotelReservationIdBytes, reservationCostLOC, withdrawDateFormatted, recipientAddress)

    await TokenValidators.validateLocBalance(wallet.address, reservationCostLOC, wallet, gasConfig.simpleReservationMultipleWithdrawers.create);
    await EtherValidators.validateEthBalance(wallet, overrideOptions.gasLimit);

    let approve = await approveContract(wallet, reservationCostLOC, SimpleReservationMultipleWithdrawersContract.address, gasPrice);

    let reservationMultipleWithWalletInstance = SimpleReservationMultipleWithdrawersContractWithWallet(wallet);

    const createReservationMultipleWithdrawersTxResult = await reservationMultipleWithWalletInstance.createReservation(hotelReservationIdBytes,
      reservationCostLOC,
      withdrawDateFormatted,
      recipientAddress,
      overrideOptions
    );

    return createReservationMultipleWithdrawersTxResult;
  }

  /**
   * Function to create simple reservation with one withdrawer
   * @param {String} jsonObj  - User's wallet jsonObj as string
   * @param {String} password  - User's wallet password as string 
   * @param {String} reservationCostLOC  - The price of the reservation in Wei, as String
   * @param {Timestamp} withdrawDateInSeconds  - The date after which the funds can be withdrawn (check out date of the booking). Should be timestamp in seconds.
   * @returns {JSONObject} createReservationSingleWithdrawerTxResult - The result from the transaction when creating a reservation.
   */

  static async createSimpleReservationSingleWithdrawer(jsonObj, password, reservationCostLOC, withdrawDateInSeconds) {

    const withdrawDateFormatted = formatTimestampToDays(withdrawDateInSeconds);

    let wallet = await ethers.Wallet.fromEncryptedWallet(jsonObj, password);
    const gasPrice = await getGasPrice();
    let overrideOptions = {
      gasLimit: gasConfig.simpleReservationSingleWithdrawer.create,
      gasPrice: gasPrice
    };
    await ReservationValidators.validateSimpleReservationSingleWithdrawerParams(jsonObj, password, reservationCostLOC, withdrawDateFormatted)

    await TokenValidators.validateLocBalance(wallet.address, reservationCostLOC, wallet, gasConfig.simpleReservationSingleWithdrawer.create);
    await EtherValidators.validateEthBalance(wallet, overrideOptions.gasLimit);

    let approve = await approveContract(wallet, reservationCostLOC, SimpleReservationSingleWithdrawerContract.address, gasPrice);

    let reservationWithWalletInstance = SimpleReservationSingleWithdrawerContractWithWallet(wallet);

    const createReservationSingleWithdrawerTxResult = await reservationWithWalletInstance.createReservation(
      reservationCostLOC,
      withdrawDateFormatted,
      overrideOptions
    );

    return createReservationSingleWithdrawerTxResult;
  }
}
