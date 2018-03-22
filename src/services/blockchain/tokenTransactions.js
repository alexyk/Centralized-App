import {
	jsonFileToKeys,
} from './utils/jsonFileToKeys.js'
import {
	validateAddress
} from './validators/base-validators';
import {
	validateLocBalance
} from './validators/token-validators';
import {
	LOCTokenContract
} from './config/contracts-config.js';
import {
	signTransaction
} from './utils/signTransaction.js';
import {
	web3
} from './config/contracts-config.js';

import {
	fundTransactionAmountIfNeeded
} from './utils/ethFuncs.js'
const gasConfig = require('./config/gas-config.json');
const errors = require('./config/errors.json');

export class TokenTransactions {

	static async sendTokens(jsonObj, password, recipient, amount) {
		validateAddress(recipient, errors.INVALID_ADDRESS);

		let result = jsonFileToKeys(jsonObj, password);

		let callOptions = {
			from: result.address,
			gas: gasConfig.transferTokens,
		};

		await fundTransactionAmountIfNeeded(
			result.address,
			result.privateKey,
			gasConfig.transferTokens
		);

		await validateLocBalance(result.address, amount);

		const transferLOCMethod = LOCTokenContract.methods.transfer(recipient, amount);
		const funcData = transferLOCMethod.encodeABI(callOptions);
		const signedData = await signTransaction(
			LOCTokenContract._address,
			result.address,
			result.privateKey,
			gasConfig.transferTokens,
			funcData,
		);

		return new Promise(function (resolve, reject) {
			web3.eth.sendSignedTransaction(signedData)
				.once(
					'transactionHash',
					transactionHash => {
						resolve({
							transactionHash
						});
					}
				)
				.once(
					'error',
					err => {
						reject({
							err
						});
					}
				);
		});    
	};

	static async getLOCBalance(address) {
		return await LOCTokenContract.methods.balanceOf(address).call();
	}

	static async getETHBalance(address) {
		return await web3.eth.getBalance(address);
	}
}