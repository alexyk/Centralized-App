import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.css';

const DEFAULT_PLACEHOLDER = 'Choose an option';

class SelectFlex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelectToggle: false
    };

    this.closeAllSelect = this.closeAllSelect.bind(this);
    this.toggleSelect = this.toggleSelect.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.closeAllSelect);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeAllSelect);
  }

  getSelectedValue() {
    const selectElement = this.props.children;
    const options = selectElement.props.children;
    const selectedOption = options.filter(option => option.props.value === this.props.value)[0];

    return selectedOption && selectedOption.props.children;
  }

  toggleSelect(e) {
    e.preventDefault();
    const { isSelectToggle } = this.state;

    this.setState({
      isSelectToggle: !isSelectToggle
    });
  }

  handleOnChange(e) {
    this.props.onChange(e.target.dataset.value);

    this.setState({
      isSelectToggle: !this.state.isSelectToggle
    });
  }

  closeAllSelect(e) {
    if (e.target.dataset.value !== this.props.value) {
      this.setState({
        isSelectToggle: false
      });
    }
  }

  render() {
    const selectElement = this.props.children;
    const { placeholder } = this.props;
    const { isSelectToggle } = this.state;

    const selectedValue = this.getSelectedValue();

    return (
      <div className={`${this.props.className ? this.props.className + ' ' : ''}custom-select`}>
        <div className={`select-selected${isSelectToggle ? ' select-arrow-active' : ''}`} onClick={this.toggleSelect} data-value={this.props.value}>
          {selectedValue}
        </div>
        <div className={`select-items${isSelectToggle ? '' : ' select-hide'}`}>
          <div className="placeholder">{placeholder || DEFAULT_PLACEHOLDER}</div>
          {selectElement.props.children.map((option, i) => {
            return <div className="option" key={i} onClick={this.handleOnChange} data-value={option.props.value}>{option.props.children}</div>;
          })}
        </div>
      </div >
    );
  }
}

SelectFlex.propTypes = {
  children: PropTypes.object,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default SelectFlex;