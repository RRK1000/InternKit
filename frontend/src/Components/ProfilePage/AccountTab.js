import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useGetAndSet, useStoreValue } from "react-context-hook";

const useStyles = makeStyles((theme) => ({
    form: {
        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            width: "50ch",
        },
    },
    container: {
        marginTop: theme.spacing(3),
    },
    button: {
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    caption: {
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(0),
        paddingTop: theme.spacing(0),
        marginBottom: theme.spacing(2),
        fontSize: 9,
    },
}));

export default function AccountTab() {
    const classes = useStyles();
    const username = useStoreValue("username");
    
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");

    const [usertype] = useGetAndSet("usertype");
    const [isLoggedIn] = useGetAndSet("isLoggedIn");

    const handleChange = (e) => {
        if (e.target.name === "currentPassword")
            setCurrentPassword(e.target.value);
        else if (e.target.name === "password") setPassword(e.target.value);
    };

    const changePassword = () => {
        const data = Object.assign(
            {},
            { username, current_password: currentPassword, new_password: password, usertype, token: isLoggedIn}
        );
        console.log(data);
        fetch("http://127.0.0.1:5000/api/v1/editpassword", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                console.log(response);
                if (response.ok) {
                    alert("Successfully Changed Password.");
                    window.location.reload();
                } else throw Error(response.status + " " + response.statusText);
            })
            .catch((err) => {
                // console.log(err);
                alert("Failed to change password.");
            });
    };

    return (
        <form className={classes.form} noValidate autoComplete="off">
            <Grid container>
                
                {/* <Grid container item>
          <Typography className={classes.caption} variant="caption">
            We won't share your email with anyone else.
          </Typography>
        </Grid> */}

                <Grid container item>
                    <TextField
                        id="standard-password-input1"
                        label="Current Password"
                        type="password"
                        name="currentPassword"
                        value={currentPassword}
                        onChange={handleChange}
                        // autoComplete="current-password"
                        variant="outlined"
                    />
                </Grid>

                <Grid container item>
                    <TextField
                        id="standard-password-input2"
                        label="New Password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        // autoComplete="current-password"
                        variant="outlined"
                    />
                </Grid>

                <Grid container item>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={changePassword}
                    >
                        Change Password
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}
