import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  form: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "50ch"
    }
  },
  container: {
    marginTop: theme.spacing(3)
  },
  button: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1)
  },
  caption: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(0),
    paddingTop: theme.spacing(0),
    marginBottom: theme.spacing(2),
    fontSize: 9
  }
}));

export default function AccountTab() {
  const classes = useStyles();

  return (
    <form className={classes.form} noValidate autoComplete="off">
      <Grid container>
        <Grid container item>
          <TextField
            required
            label="Name"
            defaultValue=""
            variant="outlined"
          />
        </Grid>
        <Grid container item>
          <TextField
            required
            label="Email Address"
            defaultValue=""
            variant="outlined"
          />
        </Grid>
        <Grid container item>
          <Typography className={classes.caption} variant="caption">
            We won't share your email with anyone else.
          </Typography>
        </Grid>

        <Grid container item>
          <TextField
            id="standard-password-input"
            label="Change Password"
            type="password"
            autoComplete="current-password"
            variant="outlined"
          />
        </Grid>

        <Grid container item>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
          >
            Edit Account
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
