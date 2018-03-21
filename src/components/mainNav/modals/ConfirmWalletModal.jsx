import { NotificationManager } from 'react-notifications';

import { Config } from '../../../config';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { updateUserInfo, getCurrentLoggedInUserInfo } from '../../../requester';
import ReCAPTCHA from 'react-google-recaptcha';
import { CONFIRM_WALLET, SAVE_WALLET } from '../../../constants/modals.js';
import { MNEMONIC_LAST_CALL, WRONG_MNEMONIC_WORDS } from '../../../constants/warningMessages.js';
import { PROFILE_SUCCESSFULLY_UPDATED } from '../../../constants/successMessages.js';
import { PROFILE_UPDATE_ERROR } from '../../../constants/errorMessages.js';

export default class CreateWalletModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mnemonic: '',
            jsonFile: '',
        };

        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onWordsForget = this.onWordsForget.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onWordsForget() {
        NotificationManager.warning(MNEMONIC_LAST_CALL);
        this.props.closeModal(CONFIRM_WALLET);
        this.props.openModal(SAVE_WALLET);
    }

    handleSubmit(token) {
        if (this.state.mnemonic.trim() !== localStorage.walletMnemonic) {
            NotificationManager.warning(WRONG_MNEMONIC_WORDS);
            this.props.closeModal(CONFIRM_WALLET);
            this.props.openModal(SAVE_WALLET);
        } else {
            this.props.closeModal(CONFIRM_WALLET);
            this.captcha.execute();
        }
    }

    render() {
        return (
            <div>
                <Modal show={this.props.isActive} onHide={e => this.props.closeModal(CONFIRM_WALLET, e)} className="modal fade myModal">
                    <Modal.Header>
                        <h1>Confirm Wallet Information</h1>
                        <button type="button" className="close" onClick={(e) => this.props.closeModal(CONFIRM_WALLET, e)}>&times;</button>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Enter your wallet mnemonic words:</p>
                        <textarea name="mnemonic" className="form-control" onChange={this.onChange} onFocus={this.handleFocus} value={this.state.mnemonic}/>
                        <br/>
                        {/* <p>Enter your wallet JSON:</p>
                        <input type="text" name="jsonFile" className="form-control" onChange={this.onChange} onFocus={this.handleFocus} value={this.state.jsonFile}/>
                        <br/> */}
                        <button className="btn btn-primary" onClick={this.handleSubmit}>Confirm Wallet</button>
                        <button className="btn btn-primary" onClick={this.onWordsForget}>Sorry, I did not save them</button>
                    </Modal.Body>
                </Modal>
                
                <ReCAPTCHA
                    ref={el => this.captcha = el}
                    size="invisible"
                    sitekey="6LdCpD4UAAAAAPzGUG9u2jDWziQUSSUWRXxJF0PR"
                    onChange={token => {
                        console.log(this.props);
                        console.log("items");
                        console.log(localStorage);
                        if (this.props.userName !== '' && this.props.userToken !== '') {
                            if (localStorage.getItem('walletAddress') && localStorage.getItem('walletJson')) {
                                localStorage[Config.getValue('domainPrefix') + '.auth.lockchain'] = this.props.userToken;
                                localStorage[Config.getValue('domainPrefix') + '.auth.username'] = this.props.userName;
                                getCurrentLoggedInUserInfo().then(info => {
                                    let userInfo = {
                                        firstName: info.firstName,
                                        lastName: info.lastName,
                                        phoneNumber: info.phoneNumber,
                                        preferredLanguage: info.preferredLanguage,
                                        preferredCurrency: info.preferredCurrency != null ? info.preferredCurrency.id : null,
                                        gender: info.gender,
                                        country: info.country != null ? info.country.id : null,
                                        city: info.city != null ? info.city.id : null,
                                        birthday: info.birthday,
                                        locAddress: localStorage.getItem('walletAddress'),
                                        jsonFile:  localStorage.getItem('walletJson')
                                    };

                                    updateUserInfo(userInfo, token).then((res) => {
                                        if (res.success) {
                                            NotificationManager.success(PROFILE_SUCCESSFULLY_UPDATED);
                                            localStorage[Config.getValue('domainPrefix') + '.auth.lockchain'] = this.props.userToken;
                                            localStorage[Config.getValue('domainPrefix') + '.auth.username'] = this.props.userName;
                                        } else {
                                            localStorage.removeItem(Config.getValue('domainPrefix') + '.auth.lockchain');
                                            localStorage.removeItem(Config.getValue('domainPrefix') + '.auth.username');
                                            NotificationManager.error(PROFILE_UPDATE_ERROR);
                                        }

                                        this.props.setUserInfo();
                                    });
                                });
                            }
                        } else { 
                            this.props.register(token); 
                        }
                        this.captcha.reset(); 
                    }
                    }
                />
            </div>
        );
    }
}

CreateWalletModal.propTypes = {
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
    isActive: PropTypes.bool
};