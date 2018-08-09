import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

function MessagesChatDay(props) {
  return (
    <div className="stamp">
      <hr />
      <span>{moment(props.date, 'DD/MM/YYYY').format('dddd, D MMM, YYYY')}</span>
    </div>
  );
}

MessagesChatDay.propTypes = {
  date: PropTypes.string
};

export default MessagesChatDay;