import React from 'react';
import './style.css';

class DateInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { text, date } = this.props;
    const openClass = (this.props.calendar && this.props.calendar.state.open) ? 'opened' : 'closed';
    return (
      <React.Fragment>
        <div className={`check-in ${openClass}`} onClick={this.props.onClick} onBlur={() => {console.log('kur')}}>
          <div>
            <img src="/images/icon-calendar.png" alt="icon-calendar" />
          </div>
          <div className="row-container">
            <p>{text}</p>
            <div className="date-mon-day">
              <p><span>{date.format('DD')} </span>{date.format('MMM, ddd').toUpperCase()}</p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default DateInput;
