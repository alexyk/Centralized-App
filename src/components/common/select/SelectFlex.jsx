import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.css';

const DEFAULT_PLACEHOLDER = 'Choose an option';

class SelectFlex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelectToggle: false,
      optionName: this.props.placeholder
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
      isSelectToggle: !this.state.isSelectToggle,
      optionName: e.target.innerHTML
    });
  }

  closeAllSelect(e) {
    if (e.target.innerHTML !== this.state.optionName) {
      this.setState({
        isSelectToggle: false
      });
    }
  }

  render() {
    const selectElement = this.props.children;
    const { placeholder } = this.props;
    const { isSelectToggle, optionName,  } = this.state;

    return (
      <div className={`${this.props.className ? this.props.className + ' ' : ''}custom-select`}>
        <div className={`select-selected${isSelectToggle ? ' select-arrow-active' : ''}`} onClick={this.toggleSelect}>
          {optionName}
        </div>
        <div className={`select-items${isSelectToggle ? '' : ' select-hide'}`}>
          <div className="placeholder">{placeholder || DEFAULT_PLACEHOLDER}</div>
          {selectElement.props.children.map((option, i) => {
            if (option.length && option.length > 0) {
              return option.map((element, j) => {
                return <div className="option" key={j} onClick={this.handleOnChange} data-value={element.props.value}>{element.props.children}</div>;
              });
            }
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
  onChange: PropTypes.func
};

export default SelectFlex;