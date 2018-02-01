import { paymentInfo } from '../actions/actionTypes';

const initialState = {
    currency: 'USD',
    currencySign: '$'
};

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case paymentInfo.SET_CURRENCY:
            return {
                ...state,
                currency: action.currency,
                currencySign: getCurrencySign(action.currency)
            };

        default:
            return state;
    }
}

function getCurrencySign(currency) {
    let currencySign = '$';
    if (currency === 'GBP') currencySign = '£';
    if (currency === 'EUR') currencySign = '€';
    return currencySign;
}