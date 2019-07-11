import React from 'react';

export default class GooglePlacesAutocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.autocomplete = null;
    this.event = null;
  }

  componentDidMount() {
    const { types = ['(cities)'], componentRestrictions, bounds, } = this.props;
    const config = {
      types,
      bounds,
      language: 'en'
    };

    if (componentRestrictions) {
      config.componentRestrictions = componentRestrictions;
    }

    this.autocomplete = new window.google.maps.places.Autocomplete(this.refs.input, config);
    this.event = this.autocomplete.addListener('place_changed', this.onSelected.bind(this));
  }

  componentDidUpdate(prevProps) {
    const { types = ['(cities)'], componentRestrictions, bounds } = this.props;
    if (JSON.stringify(prevProps.componentRestrictions) !== JSON.stringify(this.componentRestrictions)) {
      const config = {
        types,
        bounds,
        componentRestrictions
      };

      this.componentRestrictions = this.props.componentRestrictions;

      this.autocomplete.setOptions(config);
    }
  }

  componentWillUnmount() {
    this.event.remove();
  }

  onSelected() {
    if (this.props.onPlaceSelected) {
      this.props.onPlaceSelected(this.autocomplete.getPlace());
    }
  }

  render() {
    const { onPlaceSelected, types, componentRestrictions, bounds, ...rest } = this.props;

    return (
      <div>
        <input
          ref="input"
          {...rest}
        />
      </div>
    );
  }
}
