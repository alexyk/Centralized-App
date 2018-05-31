import ethers from 'ethers';
import {
  getGasPrice
} from "../utils/ethFuncs"

const ERROR = require('./../config/errors.json');
const gasConfig = require('./../config/gas-config.json');


export class EtherValidators {
  static validateEtherAddress(address) {
    if (address === '0x0000000000000000000000000000000000000000') return false;
    else if (address.substring(0, 2) !== '0x') return false;
    else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) return false;
    else if (/^(0x)?[0-9a-f]{40}$/.test(address) ||
      /^(0x)?[0-9A-F]{40}$/.test(address)) return true;
    else
      return true;
  }

  static async validateEthBalance(wallet, actionGas = 0) {

    let customerBallance = wallet.getBalance();
    const gasPrice = await getGasPrice();

    const gasAmountApprove = gasPrice.mul(gasConfig.approve);
    const gasAmountAction = gasPrice.mul(actionGas);
    const gasAmountNeeded = gasAmountApprove.add(gasAmountAction);

    if (gasAmountNeeded.gt(customerBallance)) {
      throw new Error(ERROR.INSUFFICIENT_AMOUNT_ETH);
    }

  }
}
