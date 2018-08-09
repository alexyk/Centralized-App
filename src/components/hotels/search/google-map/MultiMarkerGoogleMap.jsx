import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import MarkerInfoWindow from './MarkerInfoWindow';
import { withRouter } from 'react-router-dom';
import { ROOMS_XML_CURRENCY } from '../../../../constants/currencies.js';

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

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(props) {
    const hasNewCoordinates = props.lat && props.lon && (props.lat !== this.lat || props.lon !== this.lon);
    if (hasNewCoordinates) {
      this.clearAll();
      this.lat = props.lat;
      this.lon = props.lon;
      const latLng = new window.google.maps.LatLng(props.lat, props.lon);
      this.mapInstance.panTo(latLng);
      this.placeMarkers(props.mapInfo, this.infoWindows);
    } else if (props.mapInfo && props.mapInfo.length > 0) {
      this.placeSingleMarker(props.mapInfo[props.mapInfo.length - 1], this.infoWindows);
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
    // console.log(hotel);
    const { locRate, rates, isLogged, nights } = this.props;
    const { currency, currencySign } = this.props.paymentInfo;
    const locPrice = ((hotel.price / locRate) / this.props.nights).toFixed(2);
    const fiatPrice = rates && ((hotel.price * (rates[ROOMS_XML_CURRENCY][currency])) / nights).toFixed(2);
    const isMobile = this.props.location.pathname.indexOf('/mobile') !== -1;
    const rootUrl = isMobile ? '/mobile/details' : '/hotels/listings';

    const content = ReactDOMServer.renderToString(
      <MarkerInfoWindow
        hotel={hotel}
        currencySign={currencySign}
        locPrice={locPrice}
        fiatPrice={fiatPrice}
        isLogged={isLogged}
        rootUrl={rootUrl}
        search={this.props.location.search}
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

export default withRouter(MultiMarkerGoogleMap);