import React, { Component } from 'react';
import './Rooms.css';
import axios from 'axios';
import { UncontrolledCollapse, Button, CardBody, Card } from 'reactstrap';

let backend_url = 'https://eeehotel.herokuapp.com/api/'

export default class Rooms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {rooms: []};

    this.getRooms = this.getRooms.bind(this);
    this.handleRoomNumber = this.handleRoomNumber.bind(this);
    this.handleRoomClass = this.handleRoomClass.bind(this);
    this.handleRoomPost = this.handleRoomPost.bind(this);
    this.handleRoomEditTrigger = this.handleRoomEditTrigger.bind(this);
    this.handleRoomEditPost = this.handleRoomEditPost.bind(this);
    this.handleRoomDelete = this.handleRoomDelete.bind(this);
  }

  getRooms() {
    let url = backend_url + 'room/';
    axios.get(url)
      .then(res => {
        const response = res.data;
        this.setState({ rooms: response });
        this.setState({'room_warning': ''});
        document.getElementById('room_number').value = '';
        document.getElementById('room_class').value = 'A';
      })
  }

  handleRoomNumber(event) {this.setState({'room_number': event.target.value});}
  handleRoomClass(event) {this.setState({'room_class': event.target.value});}

  handleRoomPost() {
    let url = backend_url + 'room/';
    var data = {
      room_number: this.state.room_number,
      room_class: this.state.room_class,
    }
    console.log(data);
    axios.post(url, data)
      .then(res => {
        // console.log(res.data);
        this.getRooms();
      }).catch(error => {
        let error_response = error.response.request.response;
        this.setState({'room_warning': error_response});
        console.log(error_response);
      }
    )
  }
  handleRoomEditTrigger(event, room_number, room_class) {
      let room_id = event.target.value;
      console.log(room_id)

      if (room_id != this.state.room_for_edit) {
          this.setState({
              'room_for_edit': room_id,
              'room_number': room_number,
              'room_class': room_class,
          })
      } else {
          this.setState({
              'room_for_edit': '',
              'room_number': '',
              'room_class': '',
          })
      }
  }
  handleRoomEditPost(event) {
    let room_id = event.target.value;
    let url = backend_url + 'room/' + room_id + '/';
    var data = {
      room_number: this.state.room_number,
      room_class: this.state.room_class,
    }
    // console.log(url);
    // console.log(data);
    axios.put(url, data)
      .then(res => {
        // console.log(res.data);
          this.setState({'room_for_edit': ''});
        this.getRooms();
      }).catch(error => {
        let error_response = error.response.request.response;
        this.setState({'room_warning': error_response});
        console.log(error_response);
      }
    )
  }
  handleRoomDelete(event) {
    let url = backend_url + 'room/' + event.target.value;
    axios.delete(url)
      .then(res => {
        // console.log(res.data);
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

        <button value={room["id"]} onClick={(event) => this.handleRoomEditTrigger(event, room["room_number"], room["room_class"])}>Edit</button>
        <button value={room["id"]} onClick={this.handleRoomDelete}>Delete</button>
        <span>
          {this.state.room_for_edit == room["id"] ? (
            <div>
              <form>
                <label>
                    Room number:
                    <input type="text" name="room_number" id="room_number_edit" value={this.state.room_number} onChange={this.handleRoomNumber} />
                </label>
                <label>
                    Room class:
                    <select id="room_class_edit" onChange={this.handleRoomClass}>
                      {room["room_class"] == "A" ? <option value="A" selected="selected">A</option> : <option value="A">A</option>}
                      {room["room_class"] == "B" ? <option value="B" selected="selected">B</option> : <option value="B">B</option>}
                      {room["room_class"] == "C" ? <option value="C" selected="selected">C</option> : <option value="C">C</option>}
                      {room["room_class"] == "D" ? <option value="D" selected="selected">D</option> : <option value="D">D</option>}
                    </select>
                </label>
                <button type="button" value={room["id"]} onClick={this.handleRoomEditPost}>Save</button>
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
          <input type="button" value="Add" onClick={this.handleRoomPost} />
        </form>

        {/*This line below will show only when we receive error, like existing room */}
        <p>{this.state.room_warning}</p>

        <ul className="fortest">{listRooms}</ul>

        {/*<button onClick={this.getRooms}>Get rooms</button>*/}

      </div>
    );
  }

}
