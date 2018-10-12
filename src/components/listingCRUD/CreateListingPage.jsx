import {
  INVALID_ADDRESS,
  INVALID_SUMMARY,
  INVALID_TITLE,
  MISSING_ADDRESS,
  MISSING_CITY,
  MISSING_COUNTRY,
  MISSING_PICTURE,
} from '../../constants/warningMessages.js';
import { Route, Switch, withRouter } from 'react-router-dom';

import { Config } from '../../config';
import { LONG } from '../../constants/notificationDisplayTimes.js';
import ListingAccommodations from './steps/ListingAccommodations';
import ListingChecking from './steps/ListingChecking';
import ListingDescription from './steps/ListingDescription';
import ListingFacilities from './steps/ListingFacilities';
import ListingHouseRules from './steps/ListingHouseRules';
import ListingLandingPage from './steps/ListingLandingPage';
import ListingLocAddress from './steps/ListingLocAddress';
import ListingLocation from './steps/ListingLocation';
import ListingPhotos from './steps/ListingPhotos';
import ListingPlaceType from './steps/ListingPlaceType';
import ListingPrice from './steps/ListingPrice';
import ListingSafetyFacilities from './steps/ListingSafetyFacilities';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';
import React from 'react';
import { arrayMove } from 'react-sortable-hoc';
import moment from 'moment';
import request from 'superagent';
import requester from '../../initDependencies';
import update from 'react-addons-update';
import NoEntriesMessage from '../common/messages/NoEntriesMessage';
import { CREATE_WALLET } from '../../constants/modals';
import NavProfile from '../profile/NavProfile';
import { connect } from 'react-redux';
import { openModal } from '../../actions/modalsInfo';

const host = Config.getValue('apiHost');
const LOCKTRIP_UPLOAD_URL = `${host}images/upload`;

class CreateListingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      progressId: null,
      listingType: '1',
      country: '',
      countryCode: '',
      propertyType: '1',
      roomType: 'entire',
      dedicatedSpace: 'true',
      propertySize: '',
      guestsIncluded: 1,
      bedroomsCount: '1 bedroom',
      bedrooms: [this.createBedroom(),],
      bathrooms: 1,
      facilities: new Set(),
      street: '',
      state: '',
      city: '',
      apartment: '',
      zipCode: '',
      name: '',
      text: '',
      interaction: '',
      uploadedFiles: [],
      uploadedFilesUrls: [],
      uploadedFilesThumbUrls: [],
      suitableForChildren: 'false',
      suitableForInfants: 'false',
      suitableForPets: 'false',
      smokingAllowed: 'false',
      eventsAllowed: 'false',
      otherRuleText: '',
      otherHouseRules: new Set(),
      checkinStart: '14:00',
      checkinEnd: '20:00',
      checkoutStart: '00:00',
      checkoutEnd: '13:00',
      defaultDailyPrice: '0',
      cleaningFee: '0',
      depositRate: '0',
      currency: '2',
      loading: false,
      countries: [],
      categories: [],
      propertyTypes: [],
      cities: [],
      currencies: [],

      isAddressSelected: false,
      locAddress: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.updateCounter = this.updateCounter.bind(this);
    this.updateBedrooms = this.updateBedrooms.bind(this);
    this.updateBedCount = this.updateBedCount.bind(this);
    this.toggleFacility = this.toggleFacility.bind(this);
    this.addHouseRule = this.addHouseRule.bind(this);
    this.removeHouseRule = this.removeHouseRule.bind(this);
    this.createListing = this.createListing.bind(this);
    this.updateCountries = this.updateCountries.bind(this);
    this.updateCities = this.updateCities.bind(this);
    this.onImageDrop = this.onImageDrop.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.removePhoto = this.removePhoto.bind(this);
    this.updateLocAddress = this.updateLocAddress.bind(this);
    this.createProgress = this.createProgress.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.finish = this.finish.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
  }

  componentDidMount() {
    requester.getAmenitiesByCategory().then(res => {
      res.body.then(data => {
        this.setState({ categories: data.content });
      });
    });

    requester.getPropertyTypes().then(res => {
      res.body.then(data => {
        this.setState({ propertyTypes: data.content });
      });
    });

    requester.getCurrencies().then(res => {
      res.body.then(data => {
        this.setState({ currencies: data });
      });
    });
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  toggleCheckbox(event) {
    this.setState({
      [event.target.name]: event.target.checked
    });
  }

  updateCounter(event) {
    const name = event.target.name;
    let value = Number(event.target.value);
    if (value < 1) { value = 1; }
    this.setState({ [name]: value });
  }

  updateBedrooms(event) {
    let bedroomsCount = Number(this.state.bedroomsCount.split(' ')[0]);
    let value = Number(event.target.value.split(' ')[0]);
    if (value < 0) { value = 0; }

    let newBedrooms = JSON.parse(JSON.stringify(this.state.bedrooms));

    if (value > bedroomsCount) {
      for (let i = bedroomsCount; i < value; i++) {
        newBedrooms.push(this.createBedroom());
      }
    } else {
      newBedrooms = newBedrooms.slice(0, value);
    }

    // console.log(value + ' ' + event.target.value.split(' ')[1]);
    // console.log(newBedrooms);

    this.setState({
      bedroomsCount: value + ' ' + event.target.value.split(' ')[1],
      bedrooms: newBedrooms,
    });
  }

  updateBedCount(bedroom, e) {
    const bedrooms = JSON.parse(JSON.stringify(this.state.bedrooms));
    const name = e.target.name;
    let value = Number(e.target.value);
    if (value < 0) { value = 0; }
    bedrooms[bedroom][name] = value;
    this.setState({
      bedrooms: bedrooms,
    });
  }

  toggleFacility(item) {
    let fac = this.state.facilities;
    if (fac.has(item)) {
      fac.delete(item);
    } else {
      fac.add(item);
    }

    this.setState({
      facilities: fac,
    });
  }

  addHouseRule() {
    const rules = this.state.otherHouseRules;
    const value = this.state.otherRuleText;
    if (value && value.length > 0) {
      rules.add(value);
      this.setState({
        otherHouseRules: rules,
        otherRuleText: '',
      });
    }
  }

  removeHouseRule(value) {
    const rules = this.state.otherHouseRules;
    rules.delete(value);
    this.setState({
      otherHouseRules: rules,
    });
  }

  createBedroom() {
    return {
      singleBedCount: 0,
      doubleBedCount: 0,
      kingBedCount: 0,
    };
  }

  updateCities() {
  }

  updateCountries() {
  }

  onSelect(name, option) {
    this.setState({
      [name]: option.value
    });
  }

  getPhotos() {
    let photos = [];
    for (let i = 0; i < this.state.uploadedFilesUrls.length; i++) {
      let photo = {
        sortOrder: i,
        original: this.state.uploadedFilesUrls[i],
        thumbnail: this.state.uploadedFilesThumbUrls[i]
      };

      photos.push(photo);
    }

    return photos;
  }

  createProgress() {
    let listing = this.createListingObject();
    let data = {
      step: 1,
      data: JSON.stringify(listing)
    };

    requester.createListingProgress(data).then(res => {
      if (res.success) {
        res.body.then(res => {
          const id = res.id;
          this.setState({ progressId: id });
        });
      }
    });
  }

  updateProgress(step) {
    const progressId = this.state.progressId;
    if (!progressId) {
      this.createProgress();
    } else {
      let listing = this.createListingObject();
      let data = {
        step: step,
        data: JSON.stringify(listing),
      };

      requester.updateListingProgress(progressId, data);
    }
  }

  handleLocationChange({ position, address }) {
    this.setState({ lat: position.lat, lng: position.lng, mapAddress: address });
  }

  createListing(captchaToken) {

    let listing = this.createListingObject();
    this.setState({ loading: true });

    requester.createListing(listing, captchaToken).then(res => {
      if (res.success) {
        this.setState({ loading: false });
        res.body.then(data => {
          const id = data.id;
          const path = `/profile/listings/calendar/${id}`;
          this.props.history.push(path);
        });
      }
      else {
        this.setState({ loading: false });
        res.errors.then(data => {
          const errors = data.errors;
          for (let key in errors) {
            if (typeof errors[key] !== 'function') {
              NotificationManager.warning(errors[key].message, '', LONG);
            }
          }
        });
      }
    });
  }

  createListingObject() {
    let listing = {
      progressId: this.state.progressId,
      listingType: this.state.listingType,
      type: this.state.propertyType,
      location: `${this.state.city}, ${this.state.state}, ${this.state.country}, ${this.state.countryCode}`,
      description: {
        street: this.state.street,
        text: this.state.text,
        interaction: this.state.interaction,
        houseRules: Array.from(this.state.otherHouseRules).join('\r\n'),
      },
      details: [
        {
          value: this.state.roomType,
          detail: { name: 'roomType' }
        },
        {
          value: this.state.propertySize,
          detail: { name: 'size' }
        },
        {
          value: this.state.bedroomsCount,
          detail: { name: 'bedroomsCount' }
        },
        {
          value: this.state.bathrooms,
          detail: { name: 'bathrooms' }
        },
        {
          value: this.state.suitableForChildren,
          detail: { name: 'suitableForChildren' }
        },
        {
          value: this.state.suitableForInfants,
          detail: { name: 'suitableForInfants' }
        },
        {
          value: this.state.suitableForPets,
          detail: { name: 'suitableForPets' }
        },
        {
          value: this.state.smokingAllowed,
          detail: { name: 'smokingAllowed' }
        },
        {
          value: this.state.eventsAllowed,
          detail: { name: 'eventsAllowed' }
        },
        {
          value: this.state.dedicatedSpace,
          detail: { name: 'dedicatedSpace' }
        },
        {
          value: this.state.lng,
          detail: { name: 'lng' }
        },
        {
          value: this.state.lat,
          detail: { name: 'lat' }
        },
      ],
      guestsIncluded: this.state.guestsIncluded,
      rooms: this.state.bedrooms,
      amenities: this.state.facilities,
      name: this.state.name,
      pictures: this.getPhotos(),
      checkinStart: moment(this.state.checkinStart, 'HH:mm').format('YYYY-MM-DDTHH:mm:ss.SSS'),
      checkinEnd: moment(this.state.checkinEnd, 'HH:mm').format('YYYY-MM-DDTHH:mm:ss.SSS'),
      checkoutStart: moment(this.state.checkoutStart, 'HH:mm').format('YYYY-MM-DDTHH:mm:ss.SSS'),
      checkoutEnd: moment(this.state.checkoutEnd, 'HH:mm').format('YYYY-MM-DDTHH:mm:ss.SSS'),
      defaultDailyPrice: this.state.defaultDailyPrice,
      cleaningFee: this.state.cleaningFee,
      depositRate: this.state.depositRate,
      currency: this.state.currency,
    };

    return listing;
  }

  onImageDrop(files) {
    this.handleImageUpload(files);

    this.setState({
      uploadedFiles: files
    });
  }

  handleImageUpload(files) {
    files.forEach((file) => {
      let upload = request.post(LOCKTRIP_UPLOAD_URL)
        .field('image', file);

      upload.end((err, response) => {
        if (response.body.secure_url !== '') {
          this.setState(previousState => ({
            uploadedFilesUrls: [...previousState.uploadedFilesUrls, response.body.original],
            uploadedFilesThumbUrls: [...previousState.uploadedFilesThumbUrls, response.body.thumbnail]
          }));
        }
      });
    });
  }

  removePhoto(e) {
    e.preventDefault();

    let imageUrl = e.target.nextSibling;

    if (imageUrl.src !== null) {
      let indexOfImage = this.state.uploadedFilesUrls.indexOf(imageUrl.getAttribute('src'));

      this.setState({
        uploadedFilesUrls: update(this.state.uploadedFilesUrls, { $splice: [[indexOfImage, 1]] }),
        uploadedFilesThumbUrls: update(this.state.uploadedFilesThumbUrls, { $splice: [[indexOfImage, 1]] })
      });
    }
  }

  onSortEnd({ oldIndex, newIndex }) {
    this.setState({
      uploadedFilesUrls: arrayMove(this.state.uploadedFilesUrls, oldIndex, newIndex),
      uploadedFilesThumbUrls: arrayMove(this.state.uploadedFilesThumbUrls, oldIndex, newIndex)
    });
  }


  updateLocAddress(captchaToken) {
    requester.getUserInfo().then(res => {
      res.body.then(data => {
        let userInfo = {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          preferredLanguage: data.preferredLanguage,
          preferredCurrency: data.preferredCurrency.id,
          gender: data.gender,
          country: data.country.id,
          city: data.city.id,
          birthday: moment(data.birthday).format('DD/MM/YYYY'),
          locAddress: this.state.locAddress
        };
        requester.updateUserInfo(userInfo, captchaToken).then(() => {
          this.componentDidMount();
        });
      });
    });
  }

  convertGoogleApiAddressComponents(place) {
    let addressComponents = place.address_components;
    let addressComponentsArr = [];

    for (let i = 0; i < addressComponents.length; i++) {
      let addressComponent = {
        name: addressComponents[i].long_name,
        shortName: addressComponents[i].short_name,
        type: addressComponents[i].types[0]
      };
      addressComponentsArr.push(addressComponent);
    }

    return addressComponentsArr;
  }

  finish() {
    const { name, street, city, country, isAddressSelected, text, uploadedFilesUrls } = this.state;
    if (name.length < 2) {
      NotificationManager.warning(INVALID_TITLE, '', LONG);
      this.props.history.push('/profile/listings/create/landing/');
    } else if (!isAddressSelected) {
      NotificationManager.warning(MISSING_ADDRESS, '', LONG);
      this.props.history.push('/profile/listings/create/location/');
    } else if (street.length < 6) {
      NotificationManager.warning(INVALID_ADDRESS, '', LONG);
      this.props.history.push('/profile/listings/create/location/');
    } else if (!city || city.trim() === '') {
      NotificationManager.warning(MISSING_CITY, '', LONG);
      this.props.history.push('/profile/listings/create/location/');
    } else if (!country || country.trim() === '') {
      NotificationManager.warning(MISSING_COUNTRY, '', LONG);
      this.props.history.push('/profile/listings/create/location/');
    } else if (text.length < 6) {
      NotificationManager.warning(INVALID_SUMMARY, '', LONG);
      this.props.history.push('/profile/listings/create/description/');
    } else if (uploadedFilesUrls.length < 1) {
      NotificationManager.warning(MISSING_PICTURE, '', LONG);
      this.props.history.push('/profile/listings/create/photos/');
    } else {
      this.captcha.execute();
    }
  }

  openModal(modal, e) {
    if (e) {
      e.preventDefault();
    }

    this.props.dispatch(openModal(modal));
  }

  render() {
    if (this.state.countries === [] || this.state.currencies === [] ||
      this.state.propertyTypes === [] || this.state.categories === [] ||
      this.state.cities === []) {
      return <div className="loader"></div>;
    }

    if (!this.props.userInfo.locAddress) {
      return (
        <React.Fragment>
          <NavProfile />
          <div className='container'>
            <NoEntriesMessage text='You need to create a wallet first'>
              <a href="" className="btn" onClick={(e) => this.openModal(CREATE_WALLET, e)} style={{ minWidth: '200px' }}>Create Wallet</a>
            </NoEntriesMessage>
          </div>
        </React.Fragment>
      );
    }

    return (
      <div>
        <Switch>
          <Route exact path={routes.loc} render={() => <ListingLocAddress
            values={this.state}
            onChange={this.onChange}
            routes={routes}
            next={routes.landing} />} />
          <Route exact path={routes.landing} render={() => <ListingLandingPage
            values={this.state}
            onChange={this.onChange}
            updateProgress={this.updateProgress}
            routes={routes}
            next={routes.placetype} />} />
          <Route exact path={routes.placetype} render={() => <ListingPlaceType
            values={this.state}
            toggleCheckbox={this.toggleCheckbox}
            onChange={this.onChange}
            updateProgress={this.updateProgress}
            routes={routes}
            prev={routes.landing}
            next={routes.accommodation} />} />
          <Route exact path={routes.accommodation} render={() => <ListingAccommodations
            values={this.state}
            updateCounter={this.updateCounter}
            updateBedrooms={this.updateBedrooms}
            updateBedCount={this.updateBedCount}
            updateProgress={this.updateProgress}
            routes={routes}
            prev={routes.placetype}
            next={routes.facilities} />} />
          <Route exact path={routes.facilities} render={() => <ListingFacilities
            values={this.state}
            toggle={this.toggleFacility}
            updateProgress={this.updateProgress}
            routes={routes}
            prev={routes.accommodation}
            next={routes.safetyamenities} />} />
          <Route exact path={routes.safetyamenities} render={() => <ListingSafetyFacilities
            values={this.state}
            toggle={this.toggleFacility}
            updateProgress={this.updateProgress}
            routes={routes}
            prev={routes.facilities}
            next={routes.location} />} />
          <Route exact path={routes.location} render={() => <ListingLocation
            values={this.state}
            onChangeLocation={this.onChangeLocation}
            onChange={this.onChange}
            onSelect={this.onSelect}
            updateCountries={this.updateCountries}
            updateCities={this.updateCities}
            updateProgress={this.updateProgress}
            routes={routes}
            prev={routes.safetyamenities}
            handleLocationChange={this.handleLocationChange}
            convertGoogleApiAddressComponents={this.convertGoogleApiAddressComponents}
            next={routes.description} />} />
          <Route exact path={routes.description} render={() => <ListingDescription
            values={this.state}
            onChange={this.onChange}
            updateProgress={this.updateProgress}
            routes={routes}
            prev={routes.location}
            next={routes.photos} />} />
          <Route exact path={routes.photos} render={() => <ListingPhotos
            values={this.state}
            onImageDrop={this.onImageDrop}
            removePhoto={this.removePhoto}
            onSortEnd={this.onSortEnd}
            updateProgress={this.updateProgress}
            routes={routes}
            prev={routes.description}
            next={routes.houserules} />} />
          <Route exact path={routes.houserules} render={() => <ListingHouseRules
            values={this.state}
            onChange={this.onChange}
            addRule={this.addHouseRule}
            removeRule={this.removeHouseRule}
            updateProgress={this.updateProgress}
            routes={routes}
            prev={routes.photos}
            next={routes.checking} />} />
          <Route exact path={routes.checking} render={() => <ListingChecking
            values={this.state}
            updateDropdown={this.onChange}
            updateProgress={this.updateProgress}
            routes={routes}
            prev={routes.houserules}
            next={routes.price} />} />
          <Route exact path={routes.price} render={() => <ListingPrice
            values={this.state}
            onChange={this.onChange}
            finish={this.finish}
            routes={routes}
            prev={routes.checking} />} />
        </Switch>

        <ReCAPTCHA
          ref={(el) => this.captcha = el}
          size="invisible"
          sitekey={Config.getValue('recaptchaKey')}
          onChange={token => { this.createListing(token); this.captcha.reset(); }}
        />
      </div>
    );
  }
}

const routes = {
  loc: '/profile/listings/create/loc',
  landing: '/profile/listings/create/landing/',
  placetype: '/profile/listings/create/placetype/',
  accommodation: '/profile/listings/create/accommodation/',
  facilities: '/profile/listings/create/facilities/',
  safetyamenities: '/profile/listings/create/safetyamenities/',
  location: '/profile/listings/create/location/',
  description: '/profile/listings/create/description/',
  photos: '/profile/listings/create/photos/',
  houserules: '/profile/listings/create/houserules/',
  checking: '/profile/listings/create/checking/',
  price: '/profile/listings/create/price/',
};

CreateListingPage.propTypes = {
  // Router props
  location: PropTypes.object,
  history: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func,
  userInfo: PropTypes.object
};

const mapStateToProps = ({ userInfo }) => ({ userInfo });	

export default withRouter(connect(mapStateToProps)(CreateListingPage));