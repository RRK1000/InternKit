import React from "react";
import Container from "@material-ui/core/Container";
import StudentDashBoard from "../StudentDashboard";
import DefaultPage from "./DefaultPage"
import { makeStyles } from "@material-ui/core/styles";
const isLoggedIn = require("../../util/auth").isLoggedIn;

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(5),
  },
}));

export default function Home() {
  const classes = useStyles();
  const loggedInComponent = <StudentDashBoard />;
  const loggedOutComponent = <DefaultPage />;

  return (
    <Container className={classes.root} maxWidth="lg">
      {isLoggedIn() ? loggedInComponent : loggedOutComponent}
    </Container>
  );
}
