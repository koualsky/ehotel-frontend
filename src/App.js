import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { UncontrolledCollapse, Button, CardBody, Card } from 'reactstrap';

let backend_url = 'https://eeehotel.herokuapp.com/api/'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {rooms: ['---', '---'], reservations: ['---', '---']};

    this.getRooms = this.getRooms.bind(this);
    this.handleRoomNumber = this.handleRoomNumber.bind(this);
    this.handleRoomClass = this.handleRoomClass.bind(this);
    this.handleRoomPost = this.handleRoomPost.bind(this);
  }

  getRooms() {
    let url = backend_url + 'room/';
    axios.get(url)
      .then(res => {
        const response = res.data;
        this.setState({ rooms: response });
        this.setState({'room_warning': ''});
      })
  }

  handleRoomNumber(event) {this.setState({'room_number': event.target.value}); }
  handleRoomClass(event) {this.setState({'room_class': event.target.value});}

  handleRoomPost() {
    let url = backend_url + 'room/';
    var data = {
      room_number: this.state.room_number,
      room_class: this.state.room_class,
    }
    axios.post(url, data)
      .then(res => {
        const response = res.data;
        document.getElementById('room_number').value = '';
        document.getElementById('room_class').value = '';
        this.getRooms();
      }).catch(error => {
        let error_response = error.response.request.response;
        this.setState({'room_warning': error_response});
        console.log(error_response);
      }
    )
  }

  componentDidMount() {
      this.getRooms();
  }

  render() {

    const listRooms = this.state.rooms.map((room) => <li key={room["id"]}>
        room: {room["room_number"]},
        class: {room["room_class"]},
        price: {room["price"]}
    </li>);

    return (
      <div>

        <h1>Rooms</h1>

        <form>
          <label>
              Room number:
              <input type="text" name="room_number" id="room_number" placeholder="303" onChange={this.handleRoomNumber} />
          </label>
          <label>
              Room class:
              <select id="room_class" onChange={this.handleRoomClass}>
                <option value="A" selected>A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
          </label>
          <input type="button" value="Submit" onClick={this.handleRoomPost} />
        </form>

        {/*This line below will show only when we receive error, like existing room */}
        <p>{this.state.room_warning}</p>

        <ul className="fortest">{listRooms}</ul>

        <button onClick={this.getRooms}>Get rooms</button>

      </div>
    );
  }

}
