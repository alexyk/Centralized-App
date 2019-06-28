import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import NextArrow from '../../../styles/images/icon-next.png';

import './style.css';

export default class BookingStepsMobile extends Component {
  static propTypes = {
    /** String names of steps */
    steps: PropTypes.arrayOf(PropTypes.string),
    currentStepIndex: PropTypes.number,
    skipStepNumber: PropTypes.bool
  };
  static defaultProps = {
    skipStepNumber: true
  }


  constructor(props) {
    super(props);
  }


  render() {
    const { steps, currentStepIndex, skipStepNumber } = this.props;
    const commonStyle = {fontFamily: 'FuturaStd-Light', fontSize: "10px"};

    return (
      <div style={{
        // flexDirection:'row',
        // flexWrap:'wrap',
        // justifyContent: 'center',
        textAlign: 'center',
        width:'100%',
        paddingTop: "3px",
        paddingBottom: "3px",
        borderTop: '1px solid',
        borderBottom: '1px solid',
        backgroundColor: '#0001'
      }}>
        {steps && steps.map((step, index) => {
          const isStepActive = (currentStepIndex >= index);
          const isSelected = (currentStepIndex == index);
          const isLast = (steps.length == index+1);

          const separatorStyle = {...commonStyle, color: 'grey'};
          const textStyle = (
            isSelected
              ? {...commonStyle, fontWeight: 'bold'}
              : {...commonStyle}
          );

          const no = (skipStepNumber ? '' : `${index + 1}. `);

          return (
            <Fragment key={index}>
              <span style={textStyle}>{no}{step}</span>
              { !isLast && <span style={separatorStyle}>&nbsp;>&nbsp;</span> }
            </Fragment>
          );
        })}
      </div>
    );
  }
}
