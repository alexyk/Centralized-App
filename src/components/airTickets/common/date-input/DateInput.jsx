import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

class DateInput extends React.Component {
  render() {
    const { text, date } = this.props;
    // const openClass = (this.props.calendar && this.props.calendar.state.open) ? 'opened' : 'closed';
    return (
      <React.Fragment>
        {/* <div className={`check-in ${openClass}`} onClick={this.props.onClick}> */}
        <div className="check-in" onClick={this.props.onClick}>
          <span className='icon-calendar'></span>
          <div className="date-container">
            <div className="text">{text}</div>
            <div className="date">
              <span>{date.format('DD')} </span>{date.format('MMM, ddd')}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

DateInput.propTypes = {
  text: PropTypes.string,
  date: PropTypes.object,
  calendar: PropTypes.object,
  onClick: PropTypes.func
};

export default DateInput;
