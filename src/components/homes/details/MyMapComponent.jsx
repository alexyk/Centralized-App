import {
  withGoogleMap,
  GoogleMap,
  Circle
} from 'react-google-maps';
import { compose, withProps } from 'recompose';
import React from 'react';
import PropTypes from 'prop-types';

class MyMapComponent extends React.Component {
  
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const MyMapComponent = compose(
      withProps({
        loadingElement: <div style={{ height: '100%' }} />,
        containerElement: <div style={{ height: '400px' }} />,
        mapElement: <div style={{ height: '100%' }} />
      }),
      withGoogleMap
    )(() => {
      return (
        <GoogleMap options={{
          fullscreenControl: false, mapTypeControl: false, rotateControl: false, zoomControl: true, zoomControlOptions: { position: 3, style: 4 },
          styles: [
            {
              'elementType': 'geometry',
              'stylers': [
                {
                  'color': '#f5f5f5'
                }
              ]
            },
            {
              'elementType': 'labels.icon',
              'stylers': [
                {
                  'visibility': 'off'
                }
              ]
            },
            {
              'elementType': 'labels.text.fill',
              'stylers': [
                {
                  'color': '#616161'
                }
              ]
            },
            {
              'elementType': 'labels.text.stroke',
              'stylers': [
                {
                  'color': '#f5f5f5'
                }
              ]
            },
            {
              'featureType': 'administrative.land_parcel',
              'elementType': 'labels.text.fill',
              'stylers': [
                {
                  'color': '#bdbdbd'
                }
              ]
            },
            {
              'featureType': 'poi',
              'elementType': 'geometry',
              'stylers': [
                {
                  'color': '#eeeeee'
                }
              ]
            },
            {
              'featureType': 'poi',
              'elementType': 'labels.text.fill',
              'stylers': [
                {
                  'color': '#757575'
                }
              ]
            },
            {
              'featureType': 'poi.park',
              'elementType': 'geometry',
              'stylers': [
                {
                  'color': '#e5e5e5'
                }
              ]
            },
            {
              'featureType': 'poi.park',
              'elementType': 'labels.text.fill',
              'stylers': [
                {
                  'color': '#9e9e9e'
                }
              ]
            },
            {
              'featureType': 'road',
              'elementType': 'geometry',
              'stylers': [
                {
                  'color': '#ffffff'
                }
              ]
            },
            {
              'featureType': 'road.arterial',
              'elementType': 'labels.text.fill',
              'stylers': [
                {
                  'color': '#757575'
                }
              ]
            },
            {
              'featureType': 'road.highway',
              'elementType': 'geometry',
              'stylers': [
                {
                  'color': '#dadada'
                }
              ]
            },
            {
              'featureType': 'road.highway',
              'elementType': 'labels.text.fill',
              'stylers': [
                {
                  'color': '#616161'
                }
              ]
            },
            {
              'featureType': 'road.local',
              'elementType': 'labels.text.fill',
              'stylers': [
                {
                  'color': '#9e9e9e'
                }
              ]
            },
            {
              'featureType': 'transit.line',
              'elementType': 'geometry',
              'stylers': [
                {
                  'color': '#e5e5e5'
                }
              ]
            },
            {
              'featureType': 'transit.station',
              'elementType': 'geometry',
              'stylers': [
                {
                  'color': '#eeeeee'
                }
              ]
            },
            {
              'featureType': 'water',
              'elementType': 'geometry',
              'stylers': [
                {
                  'color': '#c9c9c9'
                }
              ]
            },
            {
              'featureType': 'water',
              'elementType': 'labels.text.fill',
              'stylers': [
                {
                  'color': '#9e9e9e'
                }
              ]
            }
          ]
        }} defaultZoom={15} defaultCenter={{ lat: Number(this.props.longitude), lng: Number(this.props.latitude) }}>
          <Circle options={{
            strokeColor: '#a1c5bf',
            strokeWeight: 4,
            strokeOpacity: 0.5,
            fillOpacity: 0.5,
            fillColor: '#a1c5bf'
          }}
          center={{ lat: Number(this.props.longitude), lng: Number(this.props.latitude) }}
          radius={300}
          />
        </GoogleMap>
      );
    });
    return <MyMapComponent />;
  }
}

MyMapComponent.propTypes = {
  latitude: PropTypes.string,
  longitude: PropTypes.string
};

export default MyMapComponent;
