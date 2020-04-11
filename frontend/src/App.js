import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Components/HomePage";
import SignIn from "./Components/SignInPage";
import SignUp from "./Components/SignUpPage";
import Profile from "./Components/ProfilePage";
import Logout from "./Components/Logout";
import AddProfile from "./Components/AddProfilePage";

export default function App() {
  return (
    <Router>
      <div>
        <Header />

        <Switch>
          <Route exact path="/" component={Home} />

          <Route path="/signin" component={SignIn} />

          <Route path="/signup" component={SignUp} />

          <Route path="/addprofile" component={AddProfile} />
          
          <Route path="/profile" component={Profile} />
                    
          <Route path="/logout" component={Logout} />


        </Switch>
      </div>
    </Router>
  );
}
