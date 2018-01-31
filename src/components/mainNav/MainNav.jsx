import { Link, withRouter } from 'react-router-dom';
import { MenuItem, Modal, Nav, NavDropdown, NavItem, Navbar } from 'react-bootstrap';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { getCountOfUnreadMessages, login, register } from '../../requester';

import ChangePasswordModal from './modals/ChangePasswordModal';
import { Config } from '../../config';
import EnterRecoveryTokenModal from './modals/EnterRecoveryTokenModal';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';
import React from 'react';
import SendRecoveryEmailModal from './modals/SendRecoveryEmailModal';

class MainNav extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showSignUpModal: false,
            showLoginModal: false,
            signUpEmail: '',
            signUpFirstName: '',
            signUpLastName: '',
            signUpPassword: '',
            signUpLocAddress: '',
            signUpError: null,
            loginEmail: '',
            loginPassword: '',
            loginError: null,
            userName: '',
            sendRecoveryEmail: false,
            enterRecoveryToken: false,
            changePassword: false,
            recoveryToken: '',
            unreadMessages: ''
        };

        this.closeSignUp = this.closeSignUp.bind(this);
        this.openSignUp = this.openSignUp.bind(this);
        this.closeLogIn = this.closeLogIn.bind(this);
        this.openLogIn = this.openLogIn.bind(this);
        this.onChange = this.onChange.bind(this);
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.messageListener = this.messageListener.bind(this);
        this.getCountOfMessages = this.getCountOfMessages.bind(this);
    }

    componentDidMount() {
        const search = this.props.location.search;
        const searchParams = search.split('=');
        if (searchParams[0] === '?token') {
            this.setState({
                recoveryToken: searchParams[1],
                enterRecoveryToken: true,
            });
        }


        this.messageListener();
    }

    closeSignUp() {
        this.setState({ showSignUpModal: false });
        this.setState({
            showSignUpModal: false,
            signUpEmail: '',
            signUpFirstName: '',
            signUpLastName: '',
            signUpPassword: ''
        });
    }

    openSignUp(e) {
        e.preventDefault();
        this.setState({ showSignUpModal: true });
    }

    closeLogIn() {
        this.setState({ showLoginModal: false });

        this.setState({
            showLoginModal: false,
            loginEmail: '',
            loginPassword: '',
            loginError: ''
        });
    }

    openLogIn(e) {
        if (e) {
            e.preventDefault();
        }

        this.setState({ showLoginModal: true });
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    register(captchaToken) {
        let user = {
            email: this.state.signUpEmail,
            firstName: this.state.signUpFirstName,
            lastName: this.state.signUpLastName,
            password: this.state.signUpPassword,
            locAddress: this.state.signUpLocAddress,
            image: Config.getValue('basePath') + 'images/default.png'
        };

        register(user, captchaToken).then((res) => {
            if (res.success) {
                this.closeSignUp();
                this.openLogIn();
            }
            else {
                res.response.then(res => {
                    const errors = res.errors;
                    for (let key in errors) {
                        if (typeof errors[key] !== 'function') {
                            NotificationManager.warning(errors[key].message);
                        }
                    }
                });

                this.captcha.reset();
            }
        });
    }

    login(captchaToken) {
        let user = {
            email: this.state.loginEmail,
            password: this.state.loginPassword
        };

        login(user, captchaToken).then((res) => {
            if (res.success) {
                res.response.json().then((data) => {
                    localStorage[Config.getValue('domainPrefix') + '.auth.lockchain'] = data.Authorization;
                    // TODO Get first name + last name from response included with Authorization token (Backend)

                    localStorage[Config.getValue('domainPrefix') + '.auth.username'] = user.email;
                    this.setState({ userName: user.email });

                    if (this.state.recoveryToken !== '') {
                        this.props.history.push('/');
                    } else {
                        // this won't reload components in <main>
                        // this.props.history.push(window.location.pathname + window.location.search); 
                        window.location.reload();
                    }

                    this.closeLogIn();
                });
            } else {
                res.response.then(res => {
                    const errors = res.errors;
                    for (let key in errors) {
                        if (typeof errors[key] !== 'function') {
                            NotificationManager.warning(errors[key].message);
                        }
                    }
                });

                this.captcha.reset();
            }
        });
    }

    logout(e) {
        e.preventDefault();

        localStorage.removeItem(Config.getValue('domainPrefix') + '.auth.lockchain');
        localStorage.removeItem(Config.getValue('domainPrefix') + '.auth.username');

        this.setState({ userName: '' });

        this.props.history.push('/');
    }

    openModal(modal, e) {
        if (e) {
            e.preventDefault();
        }

        this.setState({
            [modal]: true
        });
    }

    closeModal(modal, e) {
        if (e) {
            e.preventDefault();
        }

        this.setState({
            [modal]: false
        });
    }

    messageListener() {
        this.getCountOfMessages();

        setInterval(() => {
            this.getCountOfMessages();
        }, 120000);
    }

    getCountOfMessages() {
        if (localStorage[Config.getValue('domainPrefix') + '.auth.lockchain']) {
            getCountOfUnreadMessages().then(data => {
                this.setState({ unreadMessages: data.count });
            });
        }
    }

    render() {
        return (
            <nav id="main-nav" className="navbar">
                <div style={{ background: 'rgba(255,255,255, 0.8)' }}>
                    <NotificationContainer />
                    <Modal show={this.state.showLoginModal} onHide={this.closeLogIn} className="modal fade myModal">
                        <Modal.Header>
                            <h1>Login</h1>
                            <button type="button" className="close" onClick={this.closeLogIn}>&times;</button>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.loginError !== null ? <div className="error">{this.state.loginError}</div> : ''}
                            <form onSubmit={(e) => { e.preventDefault(); this.captcha.execute(); }}>
                                <div className="form-group">
                                    <img src={Config.getValue('basePath') + 'images/login-mail.png'} alt="mail" />
                                    <input type="email" name="loginEmail" value={this.state.loginEmail} onChange={this.onChange} className="form-control" placeholder="Email address" />
                                </div>
                                <div className="form-group">
                                    <img src={Config.getValue('basePath') + 'images/login-pass.png'} alt="pass" />
                                    <input type="password" name="loginPassword" value={this.state.loginPassword} onChange={this.onChange} className="form-control" placeholder="Password" />
                                </div>
                                <div className="checkbox login-checkbox pull-left">
                                    <label><input type="checkbox" value="" id="login-remember" />Remember me</label>
                                </div>

                                <ReCAPTCHA
                                    ref={el => this.captcha = el}
                                    size="invisible"
                                    sitekey="6LdCpD4UAAAAAPzGUG9u2jDWziQUSSUWRXxJF0PR"
                                    onChange={token => { this.login(token); this.captcha.reset(); }}
                                />

                                <button type="submit" className="btn btn-primary">Login</button>
                                <div className="clearfix"></div>
                            </form>

                            <hr />
                            <div className="login-sign">Don’t have an account? <a onClick={(e) => { this.closeLogIn(e); this.openSignUp(e); }}>Sign up</a>. Forgot your password? <a onClick={(e) => { this.closeLogIn(e); this.openModal('sendRecoveryEmail', e); }}>Recover</a></div>
                        </Modal.Body>
                    </Modal>

                    <Modal show={this.state.showSignUpModal} onHide={this.closeSignUp} className="modal fade myModal">
                        <Modal.Header>
                            <h1>Sign up</h1>
                            <button type="button" className="close" onClick={this.closeSignUp}>&times;</button>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.signUpError !== null ? <div className="error">{this.state.signUpError}</div> : ''}
                            <form onSubmit={(e) => { e.preventDefault(); this.captcha.execute(); }}>
                                <div className="form-group">
                                    <img src={Config.getValue('basePath') + 'images/login-mail.png'} alt="email" />
                                    <input type="email" name="signUpEmail" value={this.state.signUpEmail} onChange={this.onChange} className="form-control" placeholder="Email address" />
                                </div>
                                <div className="form-group">
                                    <img src={Config.getValue('basePath') + 'images/login-user.png'} alt="user" />
                                    <input type="text" required="required" name="signUpFirstName" value={this.state.signUpFirstName} onChange={this.onChange} className="form-control" placeholder="First Name" />
                                </div>
                                <div className="form-group">
                                    <img src={Config.getValue('basePath') + 'images/login-user.png'} alt="user" />
                                    <input type="text" required="required" name="signUpLastName" value={this.state.signUpLastName} onChange={this.onChange} className="form-control" placeholder="Last Name" />
                                </div>
                                <div className="form-group">
                                    <img src={Config.getValue('basePath') + 'images/login-wallet.png'} alt="ETH wallet" />
                                    <input type="text" name="signUpLocAddress" value={this.state.signUpLocAddress} onChange={this.onChange} className="form-control" placeholder="Your LOC/ETH Wallet Address" />
                                </div>
                                <div className="form-group">
                                    <img src={Config.getValue('basePath') + 'images/login-pass.png'} alt="pass" />
                                    <input type="password" required="required" name="signUpPassword" value={this.state.signUpPassword} onChange={this.onChange} className="form-control" placeholder="Password" />
                                </div>

                                <ReCAPTCHA
                                    ref={el => this.captcha = el}
                                    size="invisible"
                                    sitekey="6LdCpD4UAAAAAPzGUG9u2jDWziQUSSUWRXxJF0PR"
                                    onChange={token => { this.register(token); this.captcha.reset(); }}
                                />

                                <button type="submit" className="btn btn-primary">Sign up</button>
                                <div className="clearfix"></div>
                            </form>

                            <div className="signup-rights">
                                <p>By creating an account, you are agreeing with our Terms and Conditions and Privacy Statement.</p>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <SendRecoveryEmailModal isActive={this.state.sendRecoveryEmail} openModal={this.openModal} closeModal={this.closeModal} />
                    <EnterRecoveryTokenModal isActive={this.state.enterRecoveryToken} openModal={this.openModal} closeModal={this.closeModal} onChange={this.onChange} recoveryToken={this.state.recoveryToken} />
                    <ChangePasswordModal isActive={this.state.changePassword} openModal={this.openModal} closeModal={this.closeModal} recoveryToken={this.state.recoveryToken} />

                    <Navbar>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <Link className="navbar-brand" to="/">
                                    <img src={Config.getValue('basePath') + 'images/logo.png'} alt='logo' />
                                </Link>
                            </Navbar.Brand>
                            <Navbar.Toggle />
                        </Navbar.Header>

                        <Navbar.Collapse>
                            {localStorage[Config.getValue('domainPrefix') + '.auth.lockchain'] ?
                                <Nav>
                                    <NavItem componentClass={Link} href="/profile/reservations" to="/profile/reservations">Hosting</NavItem>
                                    <NavItem componentClass={Link} href="/profile/trips" to="/profile/trips">Traveling</NavItem>
                                    <NavItem componentClass={Link} href="/profile/messages" to="/profile/messages">
                                        <div className={(this.state.unreadMessages === 0 ? 'not ' : '') + 'unread-messages-box'}>
                                            {this.state.unreadMessages > 0 && <span className="bold unread" style={{ right: this.state.unreadMessages.toString().split('').length === 2 ? '2px' : '4px' }}>{this.state.unreadMessages}</span>}
                                        </div>
                                    </NavItem>
                                    <NavDropdown title={localStorage[Config.getValue('domainPrefix') + '.auth.username']} id="main-nav-dropdown">
                                        <MenuItem componentClass={Link} className="header" href="/profile/dashboard" to="/profile/dashboard">View Profile<img src={Config.getValue('basePath') + 'images/icon-dropdown/icon-user.png'} alt="view profile" /></MenuItem>
                                        <MenuItem componentClass={Link} href="/profile/me/edit" to="/profile/me/edit">Edit Profile</MenuItem>
                                        <MenuItem componentClass={Link} href="/profile/dashboard/#profile-dashboard-reviews" to="/profile/dashboard/#profile-dashboard-reviews">Reviews</MenuItem>
                                        <MenuItem componentClass={Link} className="header" href="/" to="/" onClick={this.logout}>Logout<img src={Config.getValue('basePath') + 'images/icon-dropdown/icon-logout.png'} style={{ top: 25 + 'px' }} alt="logout" /></MenuItem>
                                    </NavDropdown>
                                </Nav> :
                                <Nav pullRight>
                                    <NavItem componentClass={Link} href="/login" to="/login" onClick={this.openLogIn}>Login</NavItem>
                                    <NavItem componentClass={Link} href="/signup" to="/signup" onClick={this.openSignUp}>Register</NavItem>
                                </Nav>
                            }
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </nav>
        );
    }
}

export default withRouter(MainNav);

MainNav.propTypes = {
    location: PropTypes.object,
    history: PropTypes.object
};