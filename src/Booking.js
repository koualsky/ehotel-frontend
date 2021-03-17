import React, { Component } from 'react';
import './Booking.css';
import axios from 'axios';
import { UncontrolledCollapse, Button, CardBody, Card } from 'reactstrap';

let backend_url = 'https://eeehotel.herokuapp.com/api/'

export default class Booking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {bookings: []};

    this.getBooking = this.getBooking.bind(this);

    this.handleBookingFirstName = this.handleBookingFirstName.bind(this);
    this.handleBookingLastName = this.handleBookingLastName.bind(this);
    this.handleBookingReservationFrom = this.handleBookingReservationFrom.bind(this);
    this.handleBookingReservationTo = this.handleBookingReservationTo.bind(this);
    this.handleBookingRooms = this.handleBookingRooms.bind(this);

    this.handleBookingPost = this.handleBookingPost.bind(this);
    this.handleBookingEditTrigger = this.handleBookingEditTrigger.bind(this);
    this.handleBookingEditPost = this.handleBookingEditPost.bind(this);
    this.handleBookingDelete = this.handleBookingDelete.bind(this);
  }

  getBooking() {
    let url = backend_url + 'booking/';
    axios.get(url)
      .then(res => {
        const response = res.data;
        this.setState({ bookings: response });
        this.setState({'booking_warning': ''});
        document.getElementById('first_name').value = '';
        document.getElementById('last_name').value = '';
        document.getElementById('reservation_from').value = '';
        document.getElementById('reservation_to').value = '';
        document.getElementById('rooms').value = '';
      })
  }

  handleBookingFirstName(event) {this.setState({'first_name': event.target.value});}
  handleBookingLastName(event) {this.setState({'last_name': event.target.value});}
  handleBookingReservationFrom(event) {this.setState({'reservation_from': event.target.value});}
  handleBookingReservationTo(event) {this.setState({'reservation_to': event.target.value});}
  handleBookingRooms(event) {this.setState({'rooms': event.target.value});}

  handleBookingPost() {
    let url = backend_url + 'booking/';
    let rooms_list = this.state.rooms.replace(/ /g,'')
    rooms_list = rooms_list.split(',');
    var data = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      reservation_from: this.state.reservation_from,
      reservation_to: this.state.reservation_to,
      rooms: rooms_list,
    }
    axios.post(url, data)
      .then(res => {
        // console.log(res.data);
        this.getBooking();
      }).catch(error => {
        let error_response = error.response.request.response;
        this.setState({'booking_warning': error_response});
        console.log(error_response);
      }
    )
  }
  handleBookingEditTrigger(event, first_name, last_name, reservation_from, reservation_to, rooms) {
      let booking_id = event.target.value;
      rooms = rooms.map((element) => (element["room_number"]));
      rooms = rooms.toString();

      if (booking_id != this.state.booking_for_edit) {
          this.setState({
              'booking_for_edit': booking_id,
              'first_name': first_name,
              'last_name': last_name,
              'reservation_from': reservation_from,
              'reservation_to': reservation_to,
              'rooms': rooms,
          })
      } else {
          this.setState({
              'booking_for_edit': '',
              'first_name': '',
              'last_name': '',
              'reservation_from': '',
              'reservation_to': '',
              'rooms': '',
          })
      }
  }
  handleBookingEditPost(event) {
    let booking_id = event.target.value;
    let url = backend_url + 'booking/' + booking_id + '/';
    let rooms_list = this.state.rooms.replace(/ /g,'')
    rooms_list = rooms_list.split(',');
    var data = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      reservation_from: this.state.reservation_from,
      reservation_to: this.state.reservation_to,
      rooms: rooms_list,
    }
    axios.put(url, data)
      .then(res => {
        // console.log(res.data);
          this.setState({'booking_for_edit': ''});
        this.getBooking();
      }).catch(error => {
        let error_response = error.response.request.response;
        this.setState({'booking_warning': error_response});
        console.log(error_response);
      }
    )
  }
  handleBookingDelete(event) {
    let url = backend_url + 'booking/' + event.target.value;
    axios.delete(url)
      .then(res => {
        // console.log(res.data);
        this.getBooking();
      }).catch(error => {
        let error_response = error.response.request.response;
        this.setState({'booking_warning': error_response});
        console.log(error_response);
      }
    )
  }

  componentDidMount() {
      this.getBooking();
  }

  render() {

    const listBookings = this.state.bookings.map((booking) => <li key={booking["id"]}>
        {booking["first_name"]} {booking["last_name"]}
        ({booking["reservation_from"]}
        - {booking["reservation_to"]})
        {/*reserved rooms: {JSON.stringify(booking["rooms"])}*/}
        reserved rooms:
        {/*Show rooms for booking record*/}
        { typeof booking['rooms'] == 'object' && booking['rooms'].map((room) => (room['room_number'] + ', ')) }

        <button value={booking["id"]} onClick={(event) => this.handleBookingEditTrigger(
            event,
            booking["first_name"],
            booking["last_name"],
            booking["reservation_from"],
            booking["reservation_to"],
            booking["rooms"],
        )}>Edit</button>
        <button value={booking["id"]} onClick={this.handleRoomDelete}>Delete</button>
        <span>
          {this.state.booking_for_edit == booking["id"] ? (
            <div>
              <form>
                <label>
                    Booking first name:
                    <input type="text" name="first_name" id="first_name_edit" value={this.state.first_name} onChange={this.handleBookingFirstName} />
                </label>
                <label>
                    Booking last name:
                    <input type="text" name="last_name" id="last_name_edit" value={this.state.last_name} onChange={this.handleBookingLastName} />
                </label>
                <label>
                    Booking reservation from:
                    <input type="text" name="reservation_from" id="reservation_from_edit" value={this.state.reservation_from} onChange={this.handleBookingReservationFrom} />
                </label>
                <label>
                    Booking reservation to:
                    <input type="text" name="reservation_to" id="reservation_to_edit" value={this.state.reservation_to} onChange={this.handleBookingReservationTo} />
                </label>
                <label>
                    Booking rooms:
                    <input type="text" name="rooms" id="rooms_edit" value={this.state.rooms} onChange={this.handleBookingRooms} />
                </label>
                <button type="button" value={booking["id"]} onClick={this.handleBookingEditPost}>Save</button>
              </form>
            </div>
          ) : (
            // <LoginButton onClick={this.handleLoginClick} />
              <span></span>
          )}
        </span>
    </li>);

    return (
      <div>

        <h1>Bookings</h1>

        <form>
          <label>
                    Booking first name:
                    <input type="text" name="first_name" id="first_name" placeholder="John" onChange={this.handleBookingFirstName} />
                </label>
                <label>
                    Booking last name:
                    <input type="text" name="last_name" id="last_name" placeholder="Doe" onChange={this.handleBookingLastName} />
                </label>
                <label>
                    Booking reservation from:
                    <input type="text" name="reservation_from" id="reservation_from" placeholder="2021-12-20T13:50" onChange={this.handleBookingReservationFrom} />
                </label>
                <label>
                    Booking reservation to:
                    <input type="text" name="reservation_to" id="reservation_to" placeholder="2021-12-31T12:00" onChange={this.handleBookingReservationTo} />
                </label>
                <label>
                    Booking rooms:
                    <input type="text" name="rooms" id="rooms" placeholder="305, 306" onChange={this.handleBookingRooms} />
                </label>
          <input type="button" value="Add" onClick={this.handleBookingPost} />
        </form>

        {/*This line below will show only when we receive error, like existing booking */}
        <p>{this.state.booking_warning}</p>

        <ul className="fortest">{listBookings}</ul>

        {/*<button onClick={this.getBooking}>Get bookings</button>*/}

      </div>
    );
  }

}
