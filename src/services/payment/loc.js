import { NotificationManager } from 'react-notifications';
import { PROCESSING_TRANSACTION } from '../../constants/infoMessages.js';
import { TRANSACTION_SUCCESSFUL } from '../../constants/successMessages.js';
import { LONG } from '../../constants/notificationDisplayTimes';
import { TokenTransactions } from '../../services/blockchain/tokenTransactions';
import requester from '../../requester';
import { Config } from '../../config';

function tokensToWei(tokens) {
  let index = tokens.indexOf('.');
  let trailingZeroes = 0;
  let wei = '';
  if (index === -1) {
    trailingZeroes = 18;
  } else {
    trailingZeroes = 18 - (tokens.length - 1 - index);
  }

  wei = tokens.replace(/[.,]/g, '');
  if (trailingZeroes >= 0) {
    wei = wei + '0'.repeat(trailingZeroes);
  } else {
    wei = wei.substring(0, index + 18);
  }

  return wei;
}

export function sendTokens(password, recipientAddress, locAmount, flightReservationId, callback) {
  console.log(recipientAddress, locAmount);
  const wei = (tokensToWei(locAmount.toString()));

  NotificationManager.info(PROCESSING_TRANSACTION, 'Transactions', LONG);

  requester.getMyJsonFile().then(res => res.body).then(data => {
    const { jsonFile } = data;

    TokenTransactions.signTransaction(
      jsonFile,
      password,
      recipientAddress,
      wei.toString(),
      flightReservationId
    ).then((data) => {
        NotificationManager.success(TRANSACTION_SUCCESSFUL, 'Send Tokens', LONG);

        fetch(`${Config.getValue('apiHost')}flight/sendTransactionData`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'Authorization': localStorage[Config.getValue('domainPrefix') + '.auth.locktrip']
          },
          body: JSON.stringify(data)
        }).then (res => {
          if (callback) {
            callback();
          }
        }).catch(err => {
          const errors = err.errors;
          let message = '';

          if (errors) {
            if (errors.hasOwnProperty('NotActiveException')) {
              message = errors.NotActiveException.message;
            } else if (errors.hasOwnProperty('MissingFlightReservationException')) {
              message = errors.MissingFlightReservationException.message;
            } else if (errors.hasOwnProperty('MissingPassengerInfoException')) {
                message = errors.MissingPassengerInfoException.message;
            } else if (errors.hasOwnProperty('UserNotFoundException')) {
              message = errors.UserNotFoundException.message;
            } else if (errors.hasOwnProperty('FlightProviderUnavailableException')) {
              message = errors.FlightProviderUnavailableException.message;
            }
          } else {
            message = err.message
          }

          NotificationManager.warning(message, 'Warning', LONG);
        });
    }).catch(error => {
      if (error.hasOwnProperty('message')) {
        NotificationManager.warning(error.message, 'Send Tokens', LONG);
      } else if (error.hasOwnProperty('err') && error.err.hasOwnProperty('message')) {
        NotificationManager.warning(error.err.message, 'Send Tokens', LONG);
      } else if (typeof error === 'string') {
        NotificationManager.warning(error, 'Send Tokens', LONG);
      }
    });
  });
}
