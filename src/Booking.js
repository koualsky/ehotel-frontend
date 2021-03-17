import React, { Component } from 'react';
import './Booking.css';
import axios from 'axios';
import {UncontrolledCollapse, Button, CardBody, Card, Row, Col, Label, Input, FormGroup} from 'reactstrap';

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
    if (this.state.rooms) {
        let url = backend_url + 'booking/';
        let rooms_list = this.state.rooms.replace(/ /g, '')
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
    } else {
        alert('Fill in form');
    }
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

    const listBookings = this.state.bookings.map((booking) => <li key={booking["id"]} class="list-group-item">

        <Row form className="pt-0 pb-0 text-muted">
            <Col md={8} className="d-flex align-items-center">
              <div>
                <div>{booking["first_name"]} {booking["last_name"]}</div>
                <div><small>{booking["reservation_from"]} - {booking["reservation_to"]}</small></div>
                <div><small>reserved rooms: { typeof booking['rooms'] == 'object' && booking['rooms'].map((room) => (room['room_number'] + ', ')) }</small></div>
                <div><small>total days: {booking["total_days"]}</small></div>
                <div><small>total cost: {booking["total_cost"]}</small></div>
              </div>
            </Col>
            <Col md={2}>
                <Button color="primary" value={booking["id"]} onClick={(event) => this.handleBookingEditTrigger(
                    event,
                    booking["first_name"],
                    booking["last_name"],
                    booking["reservation_from"],
                    booking["reservation_to"],
                    booking["rooms"],
                )}>Edit</Button>
            </Col>
            <Col md={2}>
                <Button color="danger" value={booking["id"]} onClick={this.handleBookingDelete}>Delete</Button>
            </Col>
        </Row>

        <span>
          {this.state.booking_for_edit == booking["id"] ? (
            <div>

              <Row form className="text-muted pt-4">
                  <Col md={4}>
                      <FormGroup className="mb-0">
                          <Label for="firstName">First name</Label>
                          <Input name="first_name" id="first_name_edit" value={this.state.first_name} placeholder="John" onChange={this.handleBookingFirstName} />
                      </FormGroup>
                  </Col>
                  <Col md={4}>
                      <FormGroup className="mb-0">
                          <Label for="lastName">Last name</Label>
                          <Input name="last_name" id="last_name_edit" value={this.state.last_name} placeholder="Doe" onChange={this.handleBookingLastName} />
                      </FormGroup>
                  </Col>
                  <Col md={4}>
                      <FormGroup className="mb-0">
                          <Label for="rooms">Existing room (s)</Label>
                          <Input name="rooms" id="rooms_edit" value={this.state.rooms} placeholder="305, 306" onChange={this.handleBookingRooms} />
                      </FormGroup>
                  </Col>
              </Row>

              <Row form className="text-muted mt-2">
                  <Col md={5}>
                      <FormGroup className="mb-0">
                          <Label for="reservationFrom">Reservation from</Label>
                          <Input name="reservation_from" id="reservation_from_edit" value={this.state.reservation_from} placeholder="2021-12-20T13:50" onChange={this.handleBookingReservationFrom} />
                      </FormGroup>
                  </Col>
                  <Col md={5}>
                      <FormGroup className="reservationTo">
                          <Label for="roomNumber">Reservation to</Label>
                          <Input name="reservation_to" id="reservation_to_edit" value={this.state.reservation_to} placeholder="2021-12-31T12:00" onChange={this.handleBookingReservationTo} />
                      </FormGroup>
                  </Col>
                  <Col md={2}>
                      <FormGroup className="mb-0">
                          <Label for="add">Add</Label>
                          <Button color="success" block value={booking["id"]} onClick={this.handleBookingEditPost}>Add</Button>
                      </FormGroup>
                  </Col>
              </Row>

            </div>
          ) : (
            // <LoginButton onClick={this.handleLoginClick} />
              <span></span>
          )}
        </span>
    </li>);

    return (
      <div>

        <h3 className="pt-4 text-muted">Add reservation</h3>

        <Row form className="text-muted">
            <Col md={4}>
                <FormGroup className="mb-0">
                    <Label for="firstName">First name</Label>
                    <Input name="first_name" id="first_name" placeholder="John" onChange={this.handleBookingFirstName} />
                </FormGroup>
            </Col>
            <Col md={4}>
                <FormGroup className="mb-0">
                    <Label for="lastName">Last name</Label>
                    <Input name="last_name" id="last_name" placeholder="Doe" onChange={this.handleBookingLastName} />
                </FormGroup>
            </Col>
            <Col md={4}>
                <FormGroup className="mb-0">
                    <Label for="rooms">Existing room (s)</Label>
                    <Input name="rooms" id="rooms" placeholder="305, 306" onChange={this.handleBookingRooms} />
                </FormGroup>
            </Col>
        </Row>

        <Row form className="text-muted mt-2">
            <Col md={5}>
                <FormGroup className="mb-0">
                    <Label for="reservationFrom">Reservation from</Label>
                    <Input name="reservation_from" id="reservation_from" placeholder="2021-12-20T13:50" onChange={this.handleBookingReservationFrom} />
                </FormGroup>
            </Col>
            <Col md={5}>
                <FormGroup className="reservationTo">
                    <Label for="roomNumber">Reservation to</Label>
                    <Input name="reservation_to" id="reservation_to" placeholder="2021-12-31T12:00" onChange={this.handleBookingReservationTo} />
                </FormGroup>
            </Col>
            <Col md={2}>
                <FormGroup className="mb-0">
                    <Label for="add">Add</Label>
                    <Button color="success" block onClick={this.handleBookingPost}>Add</Button>
                </FormGroup>
            </Col>
        </Row>

        {/*This line below will show only when we receive error, like existing booking */}
        <p>{this.state.booking_warning}</p>

        <h3 className="pt-5 text-muted">Reservations</h3>

        <ul className="fortest">{listBookings}</ul>

        {/*<button onClick={this.getBooking}>Get bookings</button>*/}

      </div>
    );
  }

}
