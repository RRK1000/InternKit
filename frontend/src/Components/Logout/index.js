import React from "react";
import { Redirect } from "react-router-dom";

class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.deleteToken = this.deleteToken.bind(this);
  }
  deleteToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    return <Redirect to="/" />;
  }
  render() {
    return <div>{this.deleteToken()}</div>;
  }
}

export default Logout;
