import React from "react";
import { Redirect } from "react-router-dom";

class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.deleteToken = this.deleteToken.bind(this);
  }
  deleteToken() {
    console.log("HERE");
    localStorage.removeItem("token");
    return <Redirect to="/" />;
  }
  render() {
    return <div>{this.deleteToken()}</div>;
  }
}

export default Logout;
