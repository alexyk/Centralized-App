import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import PropTypes from "prop-types";

import RuleComponent from "./RuleComponent";
import Axios from "axios";
import {Config} from "../../../../../config";
import {getAxiosConfig} from "../../utils/adminUtils";

import "../../../../../styles/css/components/modals/modal.css";


export default class RulesModal extends Component {
  constructor(props) {
    super(props);

    /**
     * uiState - used in key when rendering items
     */
    this.state = {
      uiState: 0,
      rules: []
    }

    this.onRuleToggle = this.onRuleToggle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (this.props.isActive) {
      this.serviceGetRules();
    }
  }

  serviceGetRules(props) {
    const apiHost = Config.getValue('apiHost');
    const {user} = this.props;
    const url = `${apiHost}admin/users/${user}/rules`;

    Axios.get(url, getAxiosConfig())
      .then(response => {
        const {data: responseData} = response;
        console.log(`[SERVER] getRules response`, {responseData, response})

        let rules = [];
        for (let name in responseData) {
          rules.push({name, value: responseData[name]})
        }
        this.setState({rules});
      })
      .catch(error => {
        console.warn(`[SERVER] getRules error: ${error.message}`, {error});
      });
  }

  serviceSetRules(props) {
    const apiHost = Config.getValue('apiHost');
    const {user} = props;
    const url = `${apiHost}admin/users/${user}/rules`;

    // prepare post data
    const postData = {};
    this.state.rules.forEach(({name, value}, index) => postData[name] = value);
    console.log(postData);

    Axios.post(url, postData, getAxiosConfig())
      .then(response => {
        const {data:responseData} = response;
        console.log(`[SERVER] setting rules`, {responseData,postData,response})

        let rules = [];
        for (let name in responseData) {
          rules.push({name, value: responseData[name]})
        }
        this.setState({rules});
      })
      .catch(error => {
        console.warn(`[SERVER] setting rules error: ${error.message}`, {error});
      });
  }


  onRuleToggle(value, index) {
    const rules = this.state.rules.concat(); // make a shallow copy
    rules[index].value = !value;

    this.setState({rules, uiState: this.state.uiState+1});
  }


  onSubmit(e) {
    if (e) {
      e.preventDefault();
    }

    this.serviceSetRules(this.props);
    this.props.onClose(this.props);
  }


  _renderItems() {
    if (this.state.rules.length == 0) {
      return <span>{"Loading available rules ..."}</span>;
    }

    return (
      this.state.rules.map((item, index) => {
        const {name, value} = item;
        return <RuleComponent
                key={`${index}_${this.state.uiState}`}
                name={name}
                value={value}
                onToggle={() => this.onRuleToggle(value, index)}
        />
      })
    )
  }


  render() {
    const { user:userId, email } = this.props;

    return (
      <Modal
        show={this.props.isActive}
        className="modal fade myModal"
        onHide={this.props.onClose}
      >
        <Modal.Header>
          <button type="button" className="close" onClick={this.props.onClose}>&times;</button>
          <h1>Edit User Rules</h1>
          <hr />
          <span className="subtitle-label-text">E-mail</span>:
          <span className="subtitle-value-text"> {email}</span> &nbsp;&nbsp;
          <span className="subtitle-label-text">User Id</span>:
          <span className="subtitle-value-text"> {userId}</span>
          <hr />
        </Modal.Header>
        <Modal.Body>
          {this._renderItems()}
          <br/> <br/>
          <hr />
          <div className="btn" onClick={this.onSubmit}>Apply</div>
        </Modal.Body>
      </Modal>
    )
  }
}

RulesModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  user: PropTypes.number.isRequired
}
