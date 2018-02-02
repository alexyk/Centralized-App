import DatePicker from '../DatePicker';
import PropTypes from 'prop-types';
import React from 'react';
import { getCountries } from '../../requester';
import moment from 'moment';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';

class Search extends React.Component {
    constructor(props) {
        super(props);

        let guests = 2;
        let countryId = '';
        let startDate = moment();
        let endDate = moment().add(1, 'days');

        if (this.props) {
            let queryParams = queryString.parse(this.props.location.search);
            if (queryParams.guests) {
                guests = queryParams.guests;
            }
            if (queryParams.countryId) {
                countryId = queryParams.countryId;
            }
            if (queryParams.startDate && queryParams.endDate) {
                startDate = moment(queryParams.startDate, 'DD/MM/YYYY');
                endDate = moment(queryParams.endDate, 'DD/MM/YYYY');
            }
        }

        this.state = {
            guests: guests,
            startDate: startDate,
            endDate: endDate,
            countryId: countryId,
            countries: [],
            nights: 0
        };

        this.handleApply = this.handleApply.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        getCountries(true).then(data => {
            this.setState({ countries: data.content });
        });

        if (this.state.startDate && this.state.endDate) {
            this.calculateNights(this.state.startDate, this.state.endDate);
        }
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        if (this.props.updateParamsMap) {
            this.props.updateParamsMap(e.target.name, e.target.value);
        }
    }

    onSubmit(e) {
        e.preventDefault();

        let queryString = '?';

        queryString += 'countryId=' + this.state.countryId;
        queryString += '&startDate=' + this.state.startDate.format('DD/MM/YYYY');
        queryString += '&endDate=' + this.state.endDate.format('DD/MM/YYYY');
        queryString += '&guests=' + this.state.guests;

        // this.setState(this.state);
        this.props.history.push('/listings' + queryString);
    }

    handleApply(event, picker) {
        this.setState({
            startDate: picker.startDate,
            endDate: picker.endDate,
        });
        this.calculateNights(picker.startDate, picker.endDate);
        if (this.props.updateParamsMap) {
            this.props.updateParamsMap('startDate', picker.startDate.format('DD/MM/YYYY'));
            this.props.updateParamsMap('endDate', picker.endDate.format('DD/MM/YYYY'));
        }
    }

    calculateNights(startDate, endDate) {
        let checkIn = moment(startDate, 'DD/MM/YYYY');
        let checkOut = moment(endDate, 'DD/MM/YYYY');

        let diffDays = checkOut.diff(checkIn, 'days');

        if (checkOut > checkIn) {
            this.setState({ nights: diffDays });
        }
        else {
            this.setState({ nights: 0 });
        }
    }

    render() {
        return (
            <form id="search" onSubmit={this.onSubmit}>
                <div className="form-group has-feedback has-feedback-left" id="location">
                    <i className="icon icon-map form-control-feedback"></i>
                    <select onChange={this.onChange}
                        value={this.state.countryId}
                        className="form-control"
                        id="location-select"
                        name="countryId"
                        required="required">
                        <option disabled value="">Location</option>
                        {this.state.countries.map((item, i) => {
                            return <option key={i} value={item.id}>{item.name}</option>;
                        })}
                    </select>
                </div>

                <DatePicker
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onApply={this.handleApply}
                    search={true}
                    nights={this.state.nights} />

                <div className="form-group has-feedback has-feedback-left" id="guests">
                    <i className="icon icon-guest form-control-feedback"></i>
                    <input type="text"
                        name="guests"
                        className="form-control"
                        onChange={this.onChange}
                        required
                        placeholder="Guests"
                        value={this.state.guests} />
                </div>

                <button className="btn btn-primary">Search</button>

            </form>
        );
    }
}

Search.propTypes = {
    updateParamsMap: PropTypes.func,
    location: PropTypes.object,
    history: PropTypes.object
};

export default withRouter(Search);