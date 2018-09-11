import ethers from 'ethers';
import {
  BaseValidators
} from './validators/baseValidators';
import {
  TokenValidators
} from './validators/tokenValidators';
import {
  EtherValidators
} from './validators/etherValidators'
import {
  getNonceNumber,
  createSignedTransaction
} from './utils/ethFuncs'
import {
  LOCTokenContract,
  LOCTokenContractWithWallet,
  getNodeProvider
} from './config/contracts-config.js';
import {
  getGasPrice
} from "./utils/ethFuncs";
const gasConfig = require('./config/gas-config.json');
const errors = require('./config/errors.json');

export class TokenTransactions {

  static async sendTokens(jsonObj, password, recipient, amount) {
    BaseValidators.validateAddress(recipient, errors.INVALID_ADDRESS);

    let wallet = await ethers.Wallet.fromEncryptedWallet(jsonObj, password);
    let gasPrice = await getGasPrice();

    await TokenValidators.validateLocBalance(wallet.address, amount, wallet, gasConfig.transferTokens);
    await EtherValidators.validateEthBalance(wallet, gasConfig.transferTokens);
    let nonce = await getNonceNumber(wallet.address);

    const LOCTokenContractWallet = LOCTokenContractWithWallet(wallet);
    var overrideOptions = {
      gasLimit: gasConfig.transferTokens,
      gasPrice: gasPrice,
      nonce: nonce
    };

    let transferTokensTx = await createSignedTransaction(LOCTokenContractWallet, 'transfer', wallet, overrideOptions, LOCTokenContractWallet.address, recipient, amount)

    return [transferTokensTx];

  };

  static async getLOCBalance(address) {
    return await LOCTokenContract.balanceOf(address);
  }

  static async getETHBalance(address) {
    const nodeProvider = getNodeProvider();
    return await nodeProvider.getBalance(address);

  }
}
