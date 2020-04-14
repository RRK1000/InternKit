import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withStore } from 'react-context-hook';
import Header from "./Components/Header";
import Home from "./Components/HomePage";
import SignIn from "./Components/SignInPage";
import SignUp from "./Components/SignUpPage";
import Profile from "./Components/ProfilePage";
import Logout from "./Components/Logout";
import AddProfile from "./Components/AddProfilePage";

const initialState = Object.assign(
  {
    isLoggedIn: false,
    username: null
  },
  JSON.parse(localStorage.getItem('state'))); // Using localStorage to persist on reload

const storeConfig = {
  listener: state => {
    console.log('state changed', state)
    // persist state to localStorage
    localStorage.setItem('state', JSON.stringify(state))
  },
  logging: process.env.NODE_ENV !== 'production'
};

function App() {
  return (
    <Router>
      <Header />

      <Switch>
        <Route exact path="/" component={Home} />

        <Route path="/signin" component={SignIn} />

        <Route path="/signup" component={SignUp} />

        <Route path="/addprofile" component={AddProfile} />

        <Route path="/profile" component={Profile} />

        <Route path="/logout" component={Logout} />

      </Switch>
    </Router>
  );
}

export default withStore(App, initialState, storeConfig);