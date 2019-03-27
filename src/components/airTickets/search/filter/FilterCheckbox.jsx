import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';


class FilterCheckbox extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(name, value) {
    this.setState({
      [name]: value
    }, () => { this.props.applyFilters(this.state)});
  }

  render() {
      const { stops } = this.props;
      let items = [];

      {stops.length > 0 &&
        stops.map(item => {
          items.push(
            <Fragment>
              <label htmlFor={item.changesName}>
                  <input type="checkbox" value={item.changesId} id={item.changesName} />
                  <span className="stop-name">{item.changesName}</span>
              </label>
            </Fragment>
          );

        });
      }

      return (
        {items}
      );
  }
}


FilterCheckbox.propTypes = {
  stops: PropTypes.object,
  applyFilters: PropTypes.func
};

export default FilterCheckbox;
