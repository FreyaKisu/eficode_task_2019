import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      event: {},
      history: {},
      token: ""
    };
    this.url = "https://opendata.hopefully.works/";
    this.backend = "http://localhost:1234/";
    this.signUp();
  }

  getEvents() {
    fetch(this.url + "api/events", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          event: responseJson
        });
        fetch(this.backend + "writeLog", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-urlencoded"
          },

          body: JSON.stringify(responseJson)
        })
          .then(response => response.body)
          .then(r => {
            console.log(r);
          });
      })

      .catch(error => {
        console.log(error);
      });
  }

  getHistory = () => {
    fetch(this.backend + "getHistory", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          history: responseJson
        });
      });
  };

  signUp() {
    console.log("signUp");

    console.log(this.url);

    const body = { email: "edit.orosz.office@gmail.com", password: "höpöhöpö" };

    //fetch(this.url + "api/signup", { <- this was for signup
    fetch(this.url + "api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({
          token: responseJson.accessToken
        });

        this.getEvents();
      })
      .catch(error => {
        console.log(error);
      });
  }
  render() {
    return (
      <div className="App">
        <div>{JSON.stringify(this.state.event)}</div>
        <div>{JSON.stringify(this.state.history)}</div>
        <button onClick={this.getHistory}>History</button>
      </div>
    );
  }
}

export default App;
