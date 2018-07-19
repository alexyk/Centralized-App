import PropTypes from 'prop-types';
import React from 'react';

function Message(props) {
  return (
    <div className="body">{props.message.message}</div>
  );
}

Message.propTypes = {
  message: PropTypes.object
};

export default Message;