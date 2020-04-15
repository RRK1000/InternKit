import React from "react";
import Container from "@material-ui/core/Container";
import StudentDashBoard from "../StudentDashboard";
import CompanyDashBoard from "../CompanyDashboard";
import DefaultPage from "./DefaultPage"
import { makeStyles } from "@material-ui/core/styles";
import { useStoreValue } from 'react-context-hook';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(5),
  },
}));

export default function Home() {
  const classes = useStyles();
  const isLoggedIn = useStoreValue('isLoggedIn', false);
  const usertype = useStoreValue('usertype', 'student');
  const loggedInComponent = usertype === 'student' ? <StudentDashBoard /> : <CompanyDashBoard />;
  const loggedOutComponent = <DefaultPage />;

  return (
    <Container className={classes.root} maxWidth="lg">
      {isLoggedIn ? loggedInComponent : loggedOutComponent}
    </Container>
  );
}
