import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Rooms from './Rooms';
import Booking from './Booking';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
      <div className="container">
          <div className="row">
              <div className="col p-5 text-right" style={{borderRight: "1px solid lightgrey"}}>
                  <Rooms />
              </div>
              <div className="col p-5 ">
                  <Booking />
              </div>
          </div>
      </div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
