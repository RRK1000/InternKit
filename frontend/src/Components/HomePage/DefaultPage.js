import React from "react";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import { useSetStoreValue } from 'react-context-hook';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(5),
  },
}));

export default function DefaultPage() {
  const classes = useStyles();
  const setUserType = useSetStoreValue('usertype');

  return (
    <Container className={classes.root} maxWidth="lg">
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        <Button onClick={() => { setUserType("employee"); }}>
          <Link component={RouterLink} to="/signin" color="primary">
            Company Login
          </Link>{" "}
        </Button>
        <Button onClick={() => { setUserType("student"); }}>
          <Link component={RouterLink} to="/signin" color="primary">
            Student Login
          </Link>
        </Button>
      </ButtonGroup>
    </Container>
  );
}
