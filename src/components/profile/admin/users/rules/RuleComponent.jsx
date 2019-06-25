import React, { Component } from "react";
import PropTypes from "prop-types";

import "../../../../../styles/css/components/modals/modal.css";


export default class RuleComponent extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const { name, value, onToggle } = this.props;

    return (
      <div style={{height: 25}}>
        <input
          type="checkbox"
          onChange={onToggle}
          checked={value}
        />
        <span>{name}</span>
      </div>
    )
  }
}

RuleComponent.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
}

