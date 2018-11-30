import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setSeconds, reset } from '../../../actions/locPriceUpdateTimerInfo';

class LocPriceUpdateTimer extends PureComponent {
  constructor(props) {
    super(props);

    this.timer = null;

    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.props.dispatch(reset());
  }

  tick() {
    let { seconds } = this.props;
    this.props.dispatch(setSeconds(seconds - 1));
  }

  render() {
    return <Fragment />;
  }
}

LocPriceUpdateTimer.propTypes = {
  // Redux props
  dispatch: PropTypes.func,
  seconds: PropTypes.number
};

const mapStateToProps = (state) => {
  const { locPriceUpdateTimerInfo } = state;

  return {
    seconds: locPriceUpdateTimerInfo.seconds
  };
};

export default connect(mapStateToProps)(LocPriceUpdateTimer);

