import React from "react";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const setToken = require("../../util/auth").setToken;

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "50ch"
    }
  },
  heading: {
    margin: theme.spacing(2)
  },
  button: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1)
  },
  caption:{
    marginLeft:theme.spacing(1)
  }
}));

export default function SignIn() {
  const classes = useStyles();
  const doLogin = () => {
    // make API call, and update call setToken on success
    setToken("SampleToken");
    
  }
  return (
    <Container maxWidth="sm">
      <Typography className={classes.heading} variant="h4">
        Sign In
      </Typography>
      <form className={classes.root} noValidate autoComplete="off">
        <Grid container>
                    <Grid container item>
            <TextField
              required
              id="outlined-required"
              label="Email Address"
              defaultValue=""
              variant="outlined"
            />
          </Grid>

          <Grid container item>
            <TextField
              id="standard-password-input"
              label="Enter Password"
              type="password"
              autoComplete="current-password"
              variant="outlined"
            />
          </Grid>

          <Grid container item>
            <Typography className={classes.caption} variant="caption">
              Don't have an account? <Link href="/signup" color="primary">Click here</Link> 
            </Typography>
          </Grid>
          <Grid container item>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={doLogin()}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
