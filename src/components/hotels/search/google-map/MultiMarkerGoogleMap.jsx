import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MarkerInfoWindow from './MarkerInfoWindow';
import { CurrencyConverter } from '../../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../../services/utilities/roomsXMLCurrency';
import { getCurrency, getCurrencySign } from '../../../../selectors/paymentInfo';
import { getLocEurRate, getCurrencyExchangeRates } from '../../../../selectors/exchangeRatesInfo';

class MultiMarkerGoogleMap extends Component {
  componentDidMount() {
    this.lat = this.props.lat ? this.props.lat : 0;
    this.lon = this.props.lon ? this.props.lon : 0;
    this.mapInstance = new window.google.maps.Map(this.map, {
      zoom: 12,
      center: { lat: this.lat, lng: this.lon }
    });

    this.markers = [];
    this.infoWindows = [];
    if (this.props.mapInfo) {
      this.placeMarkers(this.props.mapInfo, this.infoWindows);
    }

    this.placeMarkers = this.placeMarkers.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.closeAll = this.closeAll.bind(this);
  }

  componentDidUpdate() {
    const hasNewCoordinates = this.props.lat && this.props.lon && (this.props.lat !== this.lat || this.props.lon !== this.lon);
    if (hasNewCoordinates) {
      this.clearAll();
      this.lat = this.props.lat;
      this.lon = this.props.lon;
      const latLng = new window.google.maps.LatLng(this.props.lat, this.props.lon);
      this.mapInstance.panTo(latLng);
      this.placeMarkers(this.props.mapInfo, this.infoWindows);
    } else if (this.props.mapInfo && this.props.mapInfo.length > 0) {
      this.placeSingleMarker(this.props.mapInfo[this.props.mapInfo.length - 1], this.infoWindows);
    }
  }

  componentWillUnmount() {
    this.clearAll();
  }

  placeMarkers(hotels, infoWindows) {
    if (hotels) {
      hotels.forEach(hotel => {
        this.placeSingleMarker(hotel, infoWindows);
      });
    }
  }

  placeSingleMarker(hotel, infoWindows) {
    const marker = this.createMarker(hotel);
    const infoWindow = this.createInfoWindow(hotel);
    window.google.maps.event.addListener(marker, 'mouseover', function () {
      infoWindows.forEach(i => {
        i.close();
      });

      infoWindow.open(this.mapInstance, marker);
    });

    window.google.maps.event.addListener(marker, 'click', function () {
      infoWindows.forEach(i => {
        i.close();
      });

      infoWindow.open(this.mapInstance, marker);
    });

    this.markers.push(marker);
    this.infoWindows.push(infoWindow);

    window.google.maps.event.addListener(this.mapInstance, 'click', function () {
      infoWindows[infoWindows.length - 1].close();
    });
  }

  closeAll() {
    this.markers.forEach((marker) => {
      marker.infoWindow.close(this.mapInstance, marker);
    });
  }

  clearAll() {
    this.infoWindows = [];
    if (this.markers) {
      this.markers.forEach((marker) => {
        marker.setMap(null);
      });
    }
  }

  createMarker(hotel) {
    return new window.google.maps.Marker({
      position: new window.google.maps.LatLng(hotel.lat, hotel.lon),
      title: hotel.name,
      map: this.mapInstance,
    });
  }

  createInfoWindow(hotel) {
    const { isLogged, nights, currency, currencySign, locEurRate, currencyExchangeRates, location } = this.props;
    const locPrice = ((hotel.price / locEurRate) / nights).toFixed(2);
    const fiatPrice = currencyExchangeRates && ((CurrencyConverter.convert(currencyExchangeRates, RoomsXMLCurrency.get(), currency, hotel.price)) / nights).toFixed(2);
    const isMobile = location.pathname.indexOf('/mobile') !== -1;
    const rootUrl = isMobile ? '/mobile/details' : '/hotels/listings';

    const content = ReactDOMServer.renderToString(
      <MarkerInfoWindow
        hotel={hotel}
        currencySign={currencySign}
        locPrice={locPrice}
        fiatPrice={fiatPrice}
        isLogged={isLogged}
        rootUrl={rootUrl}
        search={location.search}
      />
    );

    return new window.google.maps.InfoWindow({
      content: content,
    });
  }

  render() {
    return (
      <div ref={(map) => this.map = map} id='hotels-search-map' style={{ height: '470px', marginBottom: '80px' }}></div>
    );
  }
}

MultiMarkerGoogleMap.propTypes = {
  lat: PropTypes.number,
  lon: PropTypes.number,
  mapInfo: PropTypes.array,
  isLogged: PropTypes.bool,
  nights: PropTypes.number,

  // start Router props
  location: PropTypes.object,

  // start Redux props
  currency: PropTypes.string,
  currencySign: PropTypes.string,
  locEurRate: PropTypes.string,
  currencyExchangeRates: PropTypes.object
};


function mapStateToProps(state) {
  const { paymentInfo, exchangeRatesInfo } = state;
  return {
    currency: getCurrency(paymentInfo),
    currencySign: getCurrencySign(paymentInfo),
    locEurRate: getLocEurRate(exchangeRatesInfo),
    currencyExchangeRates: getCurrencyExchangeRates(exchangeRatesInfo),
  };
}

export default withRouter(connect(mapStateToProps)(MultiMarkerGoogleMap));