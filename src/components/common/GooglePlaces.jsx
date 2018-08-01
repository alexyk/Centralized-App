import React from 'react';
import { withRouter } from 'react-router-dom';
import { Config } from '../../config';
import Autocomplete from './ReactGoogleAutocomplete';

class GooglePlaces extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      country: 'BG',
      city: 'Yambol',
      search: '',
      countries: []
    };

    this.onChange = this.onChange.bind(this);
    this.handleCountrySelect = this.handleCountrySelect.bind(this);
    this.handleCitySelect = this.handleCitySelect.bind(this);
    this.handleAddressSelect = this.handleAddressSelect.bind(this);
  }

  async componentDidMount() {
    const headers = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': localStorage[Config.getValue('domainPrefix') + '.auth.locktrip']
      }
    };

    const data = await fetch('http://localhost:8080/countries', headers)
      .then(response => response.json())
      .then(data => data)
      .catch();

    this.setState({
      countries: data,
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleCountrySelect(e) {
    this.setState({ country: e.target.value, city: '' });
  }

  handleCitySelect(place) {
    if (place) {
      this.setState({ city: place.formatted_address });
    }
  }

  handleAddressSelect(place) {
    if (place) {
      console.log(place);
    }
  }

  render() {
    return (
      <div className='container'>
        <div className='select'>
          <select name='country' onChange={this.handleCountrySelect} value={this.state.country}>
            <option value={''} disabled>Pick a country</option>
            {this.state.countries && this.state.countries.map(country => {
              return (<option key={country.id} value={country.code}>{country.name}</option>);
            })}
          </select>
        </div>

        <div className='select'>
          <Autocomplete
            style={{ width: '100%' }}
            value={this.state.city}
            onChange={this.onChange}
            name="city"
            onPlaceSelected={this.handleCitySelect}
            types={['(cities)']}
            componentRestrictions={{ country: this.state.country.toLowerCase() }}
            disabled={!this.state.country}
            placeholder='Choose your city'
          />
        </div>

        {/* <div className='select'>
          <Autocomplete
            style={{ width: '100%' }}
            value={this.state.street}
            onChange={this.onChange}
            name="street"
            onPlaceSelected={this.handleAddressSelect}
            types={['address']}
            componentRestrictions={{ country: this.state.country.toLowerCase(), administrative_level_1: this.state.city }}
            disabled={!this.state.country}
            placeholder='Enter your address'
          />
        </div> */}
      </div>
    );
  }
}

export default withRouter(GooglePlaces);