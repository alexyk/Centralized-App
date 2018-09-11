import {
  HotelReservationFactoryContract,
  initHotelReservationContract,
  HotelReservationFactoryContractWithWallet,
  SimpleReservationMultipleWithdrawersContract,
  SimpleReservationMultipleWithdrawersContractWithWallet,
  SimpleReservationSingleWithdrawerContract,
  SimpleReservationSingleWithdrawerContractWithWallet,
  LOCTokenContractWithWallet
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
  getGasPrice,
  arrayToUtf8BytesArrayConverter,
  getNonceNumber,
  createSignedTransaction
} from "./utils/ethFuncs"
import ethers from 'ethers';
import {
  EtherValidators
} from "./validators/etherValidators"

const gasConfig = require('./config/gas-config.json');
const errors = require('./config/errors.json');
const {
  singleReservationWithdrawGas

} = require('./config/constants.json');

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
    const locContract = await LOCTokenContractWithWallet(wallet)
    const gasPrice = await getGasPrice();
    let nonce = await getNonceNumber(wallet.address);

    let approveTxOptions = {
      gasLimit: gasConfig.approve,
      gasPrice: gasPrice,
      nonce: nonce
    };

    let createReservationTxOptions = {
      gasLimit: gasConfig.hotelReservation.create,
      gasPrice: gasPrice,
      nonce: nonce + 1
    }

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
      createReservationTxOptions.gasLimit = gasConfig.hotelReservation.complexCreate
    };

    await TokenValidators.validateLocBalance(wallet.address, reservationCostLOC, wallet, createReservationTxOptions.create);
    await EtherValidators.validateEthBalance(wallet, createReservationTxOptions.gasLimit);

    let approveTx = createSignedTransaction(locContract, 'approve', wallet, approveTxOptions, locContract.address, HotelReservationFactoryContract.address, reservationCostLOC);

    let createReservationTx = createSignedTransaction(HotelReservationFactoryContract, 'createHotelReservation', wallet, createReservationTxOptions, HotelReservationFactoryContract.address, hotelReservationIdBytes,
      reservationCostLOC,
      reservationStartDateFormatted,
      reservationEndDateFormatted,
      daysBeforeStartForRefund,
      refundPercentages,
      hotelIdBytes,
      roomIdBytes,
      numberOfTravelers)

    return [approveTx, createReservationTx];
  }

  static async cancelReservation(jsonObj,
    password,
    hotelReservationId) {

    if (!jsonObj || !password || !hotelReservationId) {
      throw new Error(errors.INVALID_PARAMS);
    }
    let wallet = await ethers.Wallet.fromEncryptedWallet(jsonObj, password);
    const gasPrice = await getGasPrice();
    let nonce = await getNonceNumber(wallet.address);

    await EtherValidators.validateEthBalance(wallet, gasConfig.hotelReservation.cancel);

    const hotelReservationIdBytes = ethers.utils.toUtf8Bytes(hotelReservationId);

    const reservation = await this.getReservation(hotelReservationId);

    ReservationValidators.validateCancellation(reservation._refundPercentages,
      reservation._daysBeforeStartForRefund,
      reservation._reservationStartDate,
      reservation._customerAddress,
      wallet.address);

    // let HotelReservationFactoryContractWithWalletInstance = HotelReservationFactoryContractWithWallet(wallet);
    const cancelReservationTxOptions = {
      gasLimit: gasConfig.hotelReservation.cancel,
      gasPrice: gasPrice,
      nonce: nonce
    };

    let cancelReservationTx = createSignedTransaction(HotelReservationFactoryContract, 'cancelHotelReservation', wallet, cancelReservationTxOptions, HotelReservationFactoryContract.address, hotelReservationIdBytes)

    // const cancelReservationTxResult = await HotelReservationFactoryContractWithWalletInstance.cancelHotelReservation(hotelReservationIdBytes, overrideOptions);

    return [cancelReservationTx];
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
    let nonce = await getNonceNumber(wallet.address);
    await EtherValidators.validateEthBalance(wallet, gasConfig.hotelReservation.dispute);

    const reservation = await this.getReservation(hotelReservationId);

    ReservationValidators.validateDispute(wallet.address, reservation._customerAddress, reservation._reservationStartDate, reservation._reservationEndDate, reservation._isDisputeOpen);

    // let HotelReservationFactoryContractWithWalletInstance = HotelReservationFactoryContractWithWallet(wallet);
    const disputeReservationTxOptions = {
      gasLimit: gasConfig.hotelReservation.dispute,
      gasPrice: gasPrice,
      nonce: nonce
    };

    let disputeReservationTx = createSignedTransaction(HotelReservationFactoryContract, 'dispute', wallet, disputeReservationTxOptions, HotelReservationFactoryContract.address, hotelReservationIdBytes)
    // const openDisputeTxResult = await HotelReservationFactoryContractWithWalletInstance.dispute(hotelReservationIdBytes, overrideOptions);

    return [disputeReservationTx];
  }

  /**
   * Function to create simple reservation where the withdrawer can be custom address passed as a parameter
   * @param {String} jsonObj  - User's wallet jsonObj as string
   * @param {String} password  - User's wallet password as string
   * @param {String} reservationId - The Id of the reservations, shouldn't be more than 32 symbols 
   * @param {String} reservationCostLOC  - The price of the reservation in Wei, as String
   * @param {Timestamp} withdrawDateInSeconds  - The date after which the funds can be withdrawn (check out date of the booking). Should be timestamp in seconds.
   * @param {String} recipientAddress - The address of the person that should withdraw the funds after reservation checkout.
   * @returns {JSONObject} createReservationMultipleWithdrawersTxResult - The result from the transaction when creating a reservation.
   */

  static async createSimpleReservationCustomWithdrawer(jsonObj,
    password,
    reservationId,
    reservationCostLOC,
    withdrawDateInSeconds,
    recipientAddress) {

    const withdrawDateFormatted = formatEndDateTimestamp(withdrawDateInSeconds);
    const reservationIdBytes = ethers.utils.toUtf8Bytes(reservationId);

    let wallet = await ethers.Wallet.fromEncryptedWallet(jsonObj, password);
    const gasPrice = await getGasPrice();
    let nonce = await getNonceNumber(wallet.address);
    const locContract = await LOCTokenContractWithWallet(wallet)

    let approveTxOptions = {
      gasLimit: gasConfig.approve,
      gasPrice: gasPrice,
      nonce: nonce
    };

    let createReservationTxOptions = {
      gasLimit: gasConfig.simpleReservationMultipleWithdrawers.create,
      gasPrice: gasPrice,
      nonce: nonce + 1
    }

    await ReservationValidators.validateSimpleReservationCustomWithdrawerParams(jsonObj, password, reservationIdBytes, reservationCostLOC, withdrawDateFormatted, recipientAddress)
    await TokenValidators.validateLocBalance(wallet.address, reservationCostLOC, wallet, gasConfig.simpleReservationMultipleWithdrawers.create);
    await EtherValidators.validateEthBalance(wallet, createReservationTxOptions.gasLimit);

    let approveTx = createSignedTransaction(locContract, 'approve', wallet, approveTxOptions, locContract.address, SimpleReservationMultipleWithdrawersContract.address, reservationCostLOC);
    let createReservationTx = createSignedTransaction(SimpleReservationMultipleWithdrawersContract, 'createReservation', wallet, createReservationTxOptions, SimpleReservationMultipleWithdrawersContract.address, reservationIdBytes, reservationCostLOC, withdrawDateFormatted, recipientAddress)

    return [approveTx, createReservationTx];
  }

  /**
   * Function to withdraw 
   * @param {String} jsonObj  - User's wallet jsonObj as string
   * @param {String} password  - User's wallet password as string 
   * @param {Array} reservationIdsArray - Array of of reservations ids, as strings.
   * @returns {JSONObject} withdrawReservationTxResult - The result from the transaction when withdrawing funds.
   */
  static async withdrawFundsFromReservation(jsonObj, password, reservationIdsArray) {

    let reservationIdsArrayBytes = await arrayToUtf8BytesArrayConverter(reservationIdsArray);
    let wallet = await ethers.Wallet.fromEncryptedWallet(jsonObj, password);
    const gasPrice = await getGasPrice();
    let nonce = await getNonceNumber(wallet.address);

    await ReservationValidators.validateWithdrawFunds(jsonObj, password, reservationIdsArrayBytes, wallet.address);

    let gasLimitWithdraw = gasConfig.simpleReservationMultipleWithdrawers.withdrawInitial + (reservationIdsArray.length * singleReservationWithdrawGas);
    let withdrawTxOptions = {
      gasLimit: gasLimitWithdraw,
      gasPrice: gasPrice,
      nonce: nonce
    };

    await EtherValidators.validateEthBalance(wallet, withdrawTxOptions.gasLimit);
    let withdrawTx = createSignedTransaction(SimpleReservationMultipleWithdrawersContract, 'withdraw', wallet, withdrawTxOptions, SimpleReservationMultipleWithdrawersContract.address, reservationIdsArrayBytes);

    return [withdrawTx];
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
    let nonce = await getNonceNumber(wallet.address);
    const locContract = await LOCTokenContractWithWallet(wallet)

    let approveTxOptions = {
      gasLimit: gasConfig.approve,
      gasPrice: gasPrice,
      nonce: nonce
    };

    let createReservationTxOptions = {
      gasLimit: gasConfig.simpleReservationSingleWithdrawer.create,
      gasPrice: gasPrice,
      nonce: nonce + 1
    }

    await ReservationValidators.validateSimpleReservationSingleWithdrawerParams(jsonObj, password, reservationCostLOC, withdrawDateFormatted)

    await TokenValidators.validateLocBalance(wallet.address, reservationCostLOC, wallet, gasConfig.simpleReservationSingleWithdrawer.create);
    await EtherValidators.validateEthBalance(wallet, createReservationTxOptions.gasLimit);

    let approveTx = createSignedTransaction(locContract, 'approve', wallet, approveTxOptions, locContract.address, SimpleReservationSingleWithdrawerContract.address, reservationCostLOC)
    let createReservationTx = createSignedTransaction(SimpleReservationSingleWithdrawerContract, 'createReservation', wallet, createReservationTxOptions, SimpleReservationSingleWithdrawerContract.address, reservationCostLOC, withdrawDateFormatted)

    return [approveTx, createReservationTx];
  }
}
