import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import PropTypes from "prop-types";
import moment from "moment";
import requester from "../../../../requester";
import { LONG } from "../../../../constants/notificationDisplayTimes.js";
import { BOOKING_UPDATED } from "../../../../constants/successMessages";
import sa from "superagent";
import "../../../../styles/css/components/profile/admin/reservations/admin-reservations-edit-form.css";
import {Config} from "../../../../config";
import * as _ from "ramda";

type FlightBooking = {
  pnr: string,
  tripId: number,
  status: string,
  email: string,
  phone: string,
  passengerInfo: string,
  tickets: number,
  fare: string,
  price: number,
  currency: string,
  transactionId: string,
  date: string,
  paymentMethod: string
}

type State = {
  booking: FlightBooking,
}

let exampleFlight = {
  "pnr": "BN34WA",
  "status": "DONE",
  // ----------------------------------------
  "transactionId": null,
  "tripId": 244,
  "date": 1554989160000,
  // ----------------------------------------
  "price": 199.25309077631056,
  "currency": "EUR",
  "paymentMethod": "SAFE_CHARGE_CREDIT_CARD",
  // ----------------------------------------
  "email": "asya.iv.dikova@gmail.com",
  "phone": "888888888",
  // contact, options, passengers
  "passengerInfo": "{\"flightReservationId\":\"244-FL\",\"flightId\":\"5caf4039e6b1481770d10309\",\"contact\":{\"title\":\"Mrs\",\"lastName\":\"Dikova-Kirova\",\"firstName\":\"Asya\",\"email\":\"asya.iv.dikova@gmail.com\",\"phone\":null,\"country\":\"BG\",\"zip\":null,\"city\":\"Sofia, Bulgaria\",\"address\":\"Test address 1\"},\"invoice\":{\"name\":null,\"country\":null,\"zip\":null,\"city\":null,\"address\":null},\"options\":[],\"passengers\":[{\"type\":\"ADT\",\"title\":\"Mrs\",\"firstName\":\"Nevena\",\"lastName\":\"Petrova\",\"birthDate\":\"1980-03-17\",\"nationality\":\"BG\",\"passport\":{\"type\":\"P\",\"number\":\"384853244\",\"issueCountry\":\"BG\",\"expiry\":\"2022-09-7\"},\"options\":[{\"id\":\"OutwardLuggageOptions\",\"value\":\"1\"}]}],\"uuid\":\"6a352aa0-3fdd-48fc-a58c-0091d5fbc2de-517235432775\"}",
  // ----------------------------------------
  "tickets": 1,
  // grouped by group - everything to be displayed
  "fare": "[{\"group\":\"0\",\"destination\":\"MCT\",\"origin\":\"MUC\",\"originDate\":\"2019-04-09\",\"originTime\":\"22:15\",\"destinationDate\":\"2019-04-10\",\"destinationTime\":\"06:40\",\"destinationTimezone\":\"+04:00\",\"originTimezone\":\"+02:00\",\"destinationName\":\"Muscat\",\"originName\":\"Munich\",\"flightNumber\":\"WY 124\",\"carrierName\":\"Oman Air\",\"className\":\"Economy\"},{\"group\":\"0\",\"destination\":\"BKK\",\"origin\":\"MCT\",\"originDate\":\"2019-04-10\",\"originTime\":\"09:00\",\"destinationDate\":\"2019-04-10\",\"destinationTime\":\"18:00\",\"destinationTimezone\":\"+07:00\",\"originTimezone\":\"+04:00\",\"destinationName\":\"Bangkok\",\"originName\":\"Muscat\",\"flightNumber\":\"WY 815\",\"carrierName\":\"Oman Air\",\"className\":\"Economy\"},{\"group\":\"1\",\"destination\":\"MCT\",\"origin\":\"BKK\",\"originDate\":\"2019-05-06\",\"originTime\":\"09:10\",\"destinationDate\":\"2019-05-06\",\"destinationTime\":\"12:00\",\"destinationTimezone\":\"+04:00\",\"originTimezone\":\"+07:00\",\"destinationName\":\"Muscat\",\"originName\":\"Bangkok\",\"flightNumber\":\"WY 818\",\"carrierName\":\"Oman Air\",\"className\":\"Economy\"},{\"group\":\"1\",\"destination\":\"MUC\",\"origin\":\"MCT\",\"originDate\":\"2019-05-06\",\"originTime\":\"14:10\",\"destinationDate\":\"2019-05-06\",\"destinationTime\":\"19:00\",\"destinationTimezone\":\"+02:00\",\"originTimezone\":\"+04:00\",\"destinationName\":\"Munich\",\"originName\":\"Muscat\",\"flightNumber\":\"WY 123\",\"carrierName\":\"Oman Air\",\"className\":\"Economy\"}]",
};

let exampleEditBody = {
  "pnr": "BN34WA",
  "reservationStatus": "DONE"
};

class AdminReservationsFlightsEditForm extends Component <State> {
  constructor(props) {
    super(props);

    this.state = {
      // booking: ""
      booking: ""
    };

    this.requestBookingById = this.requestBookingById.bind(this);
    this.onChange = this.onChange.bind(this);
    this.editBooking = this.editBooking.bind(this);
  }

  componentDidMount() {
    this.requestBookingById(this.props.match.params.id);
  }

  onChange(e) {
    const { booking } = this.state;
    this.setState({
      booking: {
        ...booking,
        [e.target.name]: e.target.value
      }
    });
  }

  requestBookingById(id) {
    sa
      .get(`${Config.getValue('apiHost')}/admin/panel/flights/${id}`)
      .set('Authorization', localStorage[Config.getValue('domainPrefix') + '.auth.locktrip'])
      .then(res => {
        if (res.success) {
          res.body.then((data: FlightBooking) => {
            this.setState({
              booking: data
            });
          });
        }
      });
  }

  editBooking(e) {
    if (e) {
      e.preventDefault();
    }
    sa
      .post(`/admin/panel/flights/${this.props.match.params.id}`)
      .set('Authorization', localStorage[Config.getValue('domainPrefix') + '.auth.locktrip'])
      .send({
        "pnr": this.state.pnr,
        "reservationStatus":  this.state.reservationStatus,
      })
      .then(res => {
        if (res.success) {
          res.body.then((data: FlightBooking) => {
            this.setState({
              booking: data
            });
          });
        }
      });
  }

  render() {
    const { booking } = this.state;

    if (!booking) {
      return <div className="loading" />;
    }

    let passengerInfo = JSON.parse(booking.passengerInfo);
    let fare = JSON.parse(booking.fare);

    return (
      <div className="container reservations-edit-form">
        <h2>Edit Booking</h2>
        <form onSubmit={this.editBooking}>
          <div className="booking-ref-id">
            <label htmlFor="pnr">Booking ID</label>
            <input
              id="pnr"
              name="pnr"
              value={booking.pnr || ""}
              onChange={this.onChange}
              type="text"
              required
            />
          </div>

          <div className="status">
            <label htmlFor="status">Current booking status:</label>
            <div className="select">
              <select
                name="status"
                className="select"
                id="status"
                onChange={this.onChange}
                value={booking.status}
              >
                <option disabled value="">
                  ------------------
                </option>
                <option value="DONE">DONE</option>
                <option value="FAILED">FAILED</option>
                <option value="FAIL">FAIL</option>
                <option value="PENDING">PENDING</option>
                <option value="QUEUED_FOR_CONFIRMATION">
                  QUEUED_FOR_CONFIRMATION
                </option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="QUEUED">QUEUED</option>
              </select>
            </div>
          </div>

          <h4>Transaction</h4>
          <div>
            <span>Transaction Id</span>{": "}
            <span>{booking.transactionId}</span>
          </div>
          <div>
            <span>Trip Id</span>{": "}
            <span>{booking.tripId}</span>
          </div>
          <div>
            <span>Date</span>{": "}
            <span>{booking.date}</span>
          </div>
          <div>
            <span>Price</span>{": "}
            <span>{booking.price}</span>
          </div>
          <div>
            <span>Currency</span>{": "}
            <span>{booking.currency}</span>
          </div>
          <div>
            <span>Payment Method</span>{": "}
            <span>{booking.paymentMethod}</span>
          </div>

          <div>
            {/*"passengerInfo": "{\"flightReservationId\":\"244-FL\",\"flightId\":\"5caf4039e6b1481770d10309\",\"contact\":{\"title\":\"Mrs\",\"lastName\":\"Dikova-Kirova\",\"firstName\":\"Asya\",\"email\":\"asya.iv.dikova@gmail.com\",\"phone\":null,\"country\":\"BG\",\"zip\":null,\"city\":\"Sofia, Bulgaria\",\"address\":\"Test address 1\"},\"invoice\":{\"name\":null,\"country\":null,\"zip\":null,\"city\":null,\"address\":null},\"options\":[],\"passengers\":[{\"type\":\"ADT\",\"title\":\"Mrs\",\"firstName\":\"Nevena\",\"lastName\":\"Petrova\",\"birthDate\":\"1980-03-17\",\"nationality\":\"BG\",\"passport\":{\"type\":\"P\",\"number\":\"384853244\",\"issueCountry\":\"BG\",\"expiry\":\"2022-09-7\"},\"options\":[{\"id\":\"OutwardLuggageOptions\",\"value\":\"1\"}]}],\"uuid\":\"6a352aa0-3fdd-48fc-a58c-0091d5fbc2de-517235432775\"}",*/}
            <br/>
          <h4>Passenger Info</h4>
          <div>
            <span>Email</span>{": "}
            <span>{booking.email}</span>
          </div>
          <div>
            <span>Phone</span>{": "}
            <span>{booking.phone}</span>
          </div>
          <div>
            <span>Flight Reservation Id</span>{": "}
            <span>{passengerInfo.flightReservationId}</span>
          </div>
           <div>
             <span>Flight Id</span>{": "}
             <span>{passengerInfo.flightId}</span>
           </div>

            <br/>
            <h5>Contact</h5>
            <div>
              <span>Title</span>{": "}
              <span>{passengerInfo.contact.title}</span>
            </div>
            <div>
              <span>First Name</span>{": "}
              <span>{passengerInfo.contact.firstName}</span>
            </div>
            <div>
              <span>Last Name</span>{": "}
              <span>{passengerInfo.contact.lastName}</span>
            </div>
            <div>
              <span>Email</span>{": "}
              <span>{passengerInfo.contact.email}</span>
            </div>
            <div>
              <span>Phone</span>{": "}
              <span>{passengerInfo.contact.phone}</span>
            </div>
            <div>
              <span>Country</span>{": "}
              <span>{passengerInfo.contact.country}</span>
            </div>
            <div>
              <span>Zip</span>{": "}
              <span>{passengerInfo.contact.zip}</span>
            </div>
            <div>
              <span>City</span>{": "}
              <span>{passengerInfo.contact.city}</span>
            </div>
            <div>
              <span>Address</span>{": "}
              <span>{passengerInfo.contact.address}</span>
            </div>

            <br/>
            <h5>Passengers</h5>
            <div>
              {passengerInfo.passengers.map(passenger=>{
                return <div>
                  <div>
                    <span>Title</span>{": "}
                    <span>{passenger.title}</span>
                  </div>
                  <div>
                    <span>Type</span>{": "}
                    <span>{passenger.type}</span>
                  </div>
                  <div>
                    <span>Birth Date</span>{": "}
                    <span>{passenger.birthDate}</span>
                  </div>
                  <div>
                    <span>First Name</span>{": "}
                    <span>{passenger.firstName}</span>
                  </div>
                  <div>
                    <span>First Name</span>{": "}
                    <span>{passenger.firstName}</span>
                  </div>
                  <div>
                    <span>Last Name</span>{": "}
                    <span>{passenger.lastName}</span>
                  </div>
                  <div>
                    <span>Nationality</span>{": "}
                    <span>{passenger.nationality}</span>
                  </div>

                  <div>
                    <br/>
                    <h6>Options</h6>
                    <span>{Object.values(passenger.options).map(prop=>{
                      return  <div>
                        <span>{prop.id}</span>{": "}
                        <span>{prop.value}</span>
                      </div>
                    })}</span>
                  </div>
                  <div>
                    <br/>
                    <h6>Passport</h6>
                    <div>
                      <span>Expiry</span>{": "}
                      <span>{passenger.passport.expiry}</span>
                    </div>
                    <div>
                      <span>Issue Country</span>{": "}
                      <span>{passenger.passport.issueCountry}</span>
                    </div>
                    <div>
                      <span>Number</span>{": "}
                      <span>{passenger.passport.number}</span>
                    </div>
                    <div>
                      <span>Type</span>{": "}
                      <span>{passenger.passport.type}</span>
                    </div>

                  </div>
                  <hr/>
                </div>
              })}
            </div>

          </div>

          <br/>
          <div>
            <span>Tickets</span>{": "}
            <span>{booking.tickets}</span>
          </div>

          <br/>
          <div>
            <br/>
            <h4>Fare</h4>{": "}
            <span>{_.sortBy(_.prop("group"), fare).map(f=>{
              return <div>
                <div>
                  <span>Carrier Name</span>{": "}
                  <span>{f.carrierName}</span>
                </div>
                <div>
                  <span>Class Name</span>{": "}
                  <span>{f.className}</span>
                </div>
                <div>
                  <span>Destination</span>{": "}
                  <span>{f.destination}</span>
                </div>
                <div>
                  <span>Destination Date</span>{": "}
                  <span>{f.destinationDate}</span>
                </div>
                <div>
                  <span>Destination Name</span>{": "}
                  <span>{f.destinationName}</span>
                </div>
                <div>
                  <span>Destination Time</span>{": "}
                  <span>{f.destinationTime}</span>
                </div>
                <div>
                  <span>Destination Time Zone</span>{": "}
                  <span>{f.destinationTimezone}</span>
                </div>
                <div>
                  <span>Flight Number</span>{": "}
                  <span>{f.flightNumber}</span>
                </div>
                <div>
                  <span>Group</span>{": "}
                  <span>{f.group}</span>
                </div>
                <div>
                  <span>Origin</span>{": "}
                  <span>{f.origin}</span>
                </div>
                <div>
                  <span>Origin Date</span>{": "}
                  <span>{f.originDate}</span>
                </div>
                <div>
                  <span>Origin Name</span>{": "}
                  <span>{f.originName}</span>
                </div>
                <div>
                  <span>Origin Time</span>{": "}
                  <span>{f.originTime}</span>
                </div>
                <div>
                  <span>Origin Time Zone</span>{": "}
                  <span>{f.originTimezone}</span>
                </div>
                <hr/>
              </div>
            })}</span>
          </div>
        </form>
      </div>
      )
  }
}

AdminReservationsFlightsEditForm.propTypes = {
  // Router props
  match: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(AdminReservationsFlightsEditForm);
