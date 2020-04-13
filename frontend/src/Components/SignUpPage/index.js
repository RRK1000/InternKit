import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { useGetAndSet } from "react-context-hook";

const setToken = require("../../util/auth").setToken;

const useStyles = (theme) => ({
    root: {
        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            width: "50ch",
        },
    },
    heading: {
        margin: theme.spacing(2),
    },
    button: {
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    caption: {
        marginLeft: theme.spacing(1),
    },
    formControl: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(3),
    },
});

function SignUp(props) {
    const [isLoggedIn, setIsLoggedIn] = useGetAndSet("isLoggedIn");
    const [usertype, setUserType] = useGetAndSet("usertype");
    const [hasProfile, setHasProfile] = useGetAndSet("hasProfile");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const onSubmit = () => {
        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        };
        const data = { username, password, name, usertype };
        console.log(data);
        axios
            .put("http://127.0.0.1:5000/api/v1/signup", data, headers)
            .then((res) => {
                console.log(res.data);
                setToken(res.data.token);
                setIsLoggedIn(res.data.token);
                setUserType(usertype);
                setHasProfile(false);
            })
            .catch((err) => {
                if (err.response) {
                    alert(err.response.data.message);
                } else alert(err);
            });
    };
    const { classes } = props;

    return isLoggedIn ? (
        <Redirect to="/addprofile" />
    ) : (
        <Container maxWidth="sm">
            <Typography className={classes.heading} variant="h4">
                Sign Up
            </Typography>
            <form
                className={classes.root}
                noValidate
                autoComplete="off"
                // onSubmit={this.onSubmit}
            >
                <Grid container>
                    <Grid container item>
                        <TextField
                            required
                            id="outlined-required"
                            label="Username"
                            name="username"
                            value={username}
                            variant="outlined"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Grid>

                    <Grid container item>
                        <TextField
                            required
                            id="standard-password-input1"
                            label="Enter Password"
                            type="password"
                            name="password"
                            value={password}
                            autoComplete="current-password"
                            variant="outlined"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Grid>

                    <Grid container item>
                        <TextField
                            required
                            id="standard-password-input2"
                            label="Re-enter Password"
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            variant="outlined"
                        />
                    </Grid>

                    <Grid container item>
                        <TextField
                            required
                            id="outlined-required2"
                            label="Name"
                            name="name"
                            value={name}
                            variant="outlined"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>

                    <Grid container item>
                        <FormControl
                            className={classes.formControl}
                            component="fieldset"
                        >
                            <FormLabel component="legend">
                                Student/Company
                            </FormLabel>
                            <RadioGroup
                                aria-label="UserType"
                                name="usertype"
                                value={usertype}
                                onChange={(e) => setUserType(e.target.value)}
                            >
                                <FormControlLabel
                                    value="student"
                                    control={<Radio color="primary" />}
                                    label="Student"
                                />
                                <FormControlLabel
                                    value="employee"
                                    control={<Radio color="primary" />}
                                    label="Company"
                                />
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    <Grid container item>
                        <Typography
                            className={classes.caption}
                            variant="caption"
                        >
                            Already have an account?{" "}
                            <Link href="/signin" color="primary">
                                Click here
                            </Link>
                        </Typography>
                    </Grid>
                    <Grid container item>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            // type="submit"
                            onClick={onSubmit}
                        >
                            Proceed to Add Profile
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}

export default withStyles(useStyles)(SignUp);
