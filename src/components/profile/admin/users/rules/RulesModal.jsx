import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";

import RuleComponent from "./RuleComponent";
import Axios from "axios";
import { Config } from "../../../../../config";

import "../../../../../styles/css/components/modals/modal.css";
import { getAxiosConfig } from "../../utils/adminUtils";


export default class RulesModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: true,
      rules: [ ]
    }

    this.onHide = this.onHide.bind(this);
    this.onRuleToggle = this.onRuleToggle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.getRules(props);
  }

  getRules(props) {
    const apiHost = Config.getValue('apiHost');
    const { user } = props;
    const url = `${apiHost}admin/users/${user}/rules`;

    Axios.get(url, getAxiosConfig())
      .then( data => {
        console.log(`[SERVER] getRules: ${data}`, {data})
        let rules = [];
        for (let name in data) {
          rules.push({name, value:data[name]})
        }
        this.setState({rules});
      })
      .catch(error => {
        console.warn(`[SERVER] getRules error: ${error.message}`, {error});
      });
  }


  setRules(props) {
    const apiHost = Config.getValue('apiHost');
    const { user } = props;
    const url = `${apiHost}admin/users/${user}/rules`;
    const data = {};
    this.state.rules.forEach(({name,value},index) => data[name] = value);

    Axios.post(url, data, getAxiosConfig())
      .then( data => {
        console.log(`[SERVER] setting rules: ${data}`, {data})
      })
      .catch(error => {
        console.warn(`[SERVER] setting rules error: ${error.message}`, {error});
      });
  }


  onHide() {
    // nothing so far
  }


  onRuleToggle(value,index) {
    const rules = this.state.rules.concat(); // make a shallow copy
    rules[index].value = !value;

    this.setState({rules});
  }


  onSubmit(e) {
    if (e) e.preventDefault();
    // TODO sumbit
  }


  _renderItems() {
    if (this.state.rules.length == 0) {
      return <span>{"Loading ..."}</span>;
    }

    return (
      this.state.rules.map( (item,index) => {
        const { name, value, } = item;
        return <RuleComponent key={`${index}_${this.state.isActive}`} name={name} value={value} onToggle={() => this.onRuleToggle(value,index)} />
      })
    )
  }


  render() {
    return (
      <Modal
        show={this.props.isActive}
        className="modal fade myModal"
        onHide={this.props.onClose}
      >
        <Modal.Header>
          <h1>Edit Rules</h1><br />
          <h5>{this.props.user}</h5>
          <button type="button" className="close" onClick={this.props.onClose}>
            &times;
          </button>
        </Modal.Header>
        <Modal.Body>
          { this._renderItems() }
          <br /> <br />
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
