import React from 'react';
import './style.css';

function DateInput(props) {
  const { text, date } = props;
  const openClass = (props.calendar && props.calendar.state.open) ? 'opened' : 'closed';
  return (
    <React.Fragment>
      <div className={`check-in ${openClass}`} onClick={props.onClick}>
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

export default DateInput;
