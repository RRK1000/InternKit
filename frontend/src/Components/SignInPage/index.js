import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { useGetAndSet, useSetStoreValue } from "react-context-hook";

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
});

function SignIn(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    var token = null;

    const [usertype, setUserType] = useGetAndSet("usertype", "student");
    const [hasProfile, setHasProfile] = useGetAndSet("hasProfile", false);
    const [isLoggedIn, setIsLoggedIn] = useGetAndSet("isLoggedIn");
    const setAuthUsername = useSetStoreValue("username");

    const doLogin = () => {
        const data = Object.assign({}, { username, password, usertype });
        console.log(data);
        fetch("http://127.0.0.1:5000/api/v1/login", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                console.log(response);
                if (response.ok) return response.json();
                else throw Error(response.status + " " + response.statusText);
            })
            .then((data) => {
                console.log("Success:", data);
                token = data.token;
                return fetch(
                    "http://127.0.0.1:5000/api/v1/getdetails?" +
                    new URLSearchParams({
                        uid: username,
                        usertype
                    }),
                    {
                        method: "GET",
                        mode: "cors",
                    }
                );
            })
            .then((response) => {
                console.log(response);
                setHasProfile(response.ok);
            })
            .then(() => {
                console.log(token)
                setIsLoggedIn(token);
                setUserType(usertype);
                setAuthUsername(username);
                setToken(token); // maintained so other things don't break.
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(error);
            });
    };
    const { classes } = props;
    if (isLoggedIn)
        if (hasProfile)
            return <Redirect to="/" />;
        else return <Redirect to="/addprofile" />;
    else
        return (
            <Container maxWidth="sm">
                <Typography className={classes.heading} variant="h4">
                    Sign In
                </Typography>
                <form
                    className={classes.root}
                    noValidate
                    autoComplete="off"
                // onSubmit={this.doLogin}
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
                                id="standard-password-input"
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
                            <Typography
                                className={classes.caption}
                                variant="caption"
                            >
                                Don't have an account?{" "}
                                <Link href="/signup" color="primary">
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
                                onClick={doLogin}
                            >
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        );
}

export default withStyles(useStyles)(SignIn);
