import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import { useGetAndSet } from "react-context-hook";

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
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

export default function PersonalDetailsTab() {
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [dob, setDob] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [github, setGithub] = useState("");
    const [linkedIn, setLinkedIn] = useState("");

    const [isLoggedIn] = useGetAndSet("isLoggedIn");
    const [usertype] = useGetAndSet("usertype");

    const handleChange = (e) => {
        if (e.target.name === "username") setUsername(e.target.value);
        else if (e.target.name === "dob") setDob(e.target.value);
        else if (e.target.name === "email") setEmail(e.target.value);
        else if (e.target.name === "phone") setPhone(e.target.value);
        else if (e.target.name === "github") setGithub(e.target.value);
        else if (e.target.name === "linkedIn") setLinkedIn(e.target.value);
    };

    const editAcc = () => {
        fetch(
            "http://127.0.0.1:5000/api/v1/getdetails?uid=" +
                username +
                "&usertype=" +
                usertype,
            {
                method: "GET",
                mode: "cors",
            }
        )
            .then((response) => {
                console.log(response);
                if (response.ok) return response.json();
                else throw Error(response.status + " " + response.statusText);
            })
            .then((data) => {
                console.log(data);
                if (dob === "") setDob(data.dob);
                if (email === "") setEmail(data.email);
                if (phone === "") setPhone(data.phone);
                let index = data.snetwork.search(";");
                let git = data.snetwork.substr(0, index);
                let l = data.snetwork.substr(index + 1, data.snetwork.length);
                if (github === "") setGithub(git);
                if (linkedIn === "") setLinkedIn(l);
            })
            .then(() => {
                console.log(dob, email, phone)
                let ndetails =
                    "[" +
                    "'" +
                    dob +
                    "'" +
                    "," +
                    "'" +
                    email +
                    "'" +
                    "," +
                    "'" +
                    phone +
                    "'" +
                    "," +
                    "'" +
                    github +
                    ";" +
                    linkedIn +
                    "'" +
                    "]";
                console.log(JSON.stringify(ndetails));
                const body = Object.assign(
                    {},
                    {
                        uid: username,
                        column_details: "['dob', 'email', 'phone', 'snetwork']",
                        token: isLoggedIn,
                        new_details: ndetails,
                        usertype,
                    }
                );
                console.log(body);
                fetch("http://127.0.0.1:5000/api/v1/editdetails", {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                })
                    .then((response) => {
                        console.log(response);
                        if (response.ok) return response.json();
                        else throw Error(response.status + " " + response.statusText);
                    })
                    .then((data) => {
                        console.log("Success:", data);
                        alert("Successfully Updated.");
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        alert(error);
                    });
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
    return (
        <form className={classes.form} noValidate autoComplete="off">
            <Grid container>
                <Grid container item>
                    <TextField
                        required
                        id="outlined-required"
                        label="Username"
                        name="username"
                        value={username}
                        variant="outlined"
                        onChange={handleChange}
                    />
                </Grid>

                <Grid container item>
                    <TextField
                        required
                        id="outlined-required"
                        label="Date of Birth (DD/MM/YYYY)"
                        name="dob"
                        value={dob}
                        variant="outlined"
                        onChange={handleChange}
                    />
                </Grid>

                <Grid container item>
                    <TextField
                        required
                        id="outlined-required"
                        label="Email"
                        name="email"
                        value={email}
                        variant="outlined"
                        onChange={handleChange}
                    />
                </Grid>
                <Grid container item>
                    <TextField
                        required
                        id="outlined-required"
                        label="Phone"
                        name="phone"
                        value={phone}
                        variant="outlined"
                        onChange={handleChange}
                    />
                </Grid>
                <Grid container item>
                    <TextField
                        id="outlined1"
                        label="Github"
                        name="github"
                        value={github}
                        variant="outlined"
                        onChange={handleChange}
                    />
                </Grid>
                <Grid container item>
                    <TextField
                        id="outlined2"
                        label="LinkedIn"
                        name="linkedIn"
                        value={linkedIn}
                        variant="outlined"
                        onChange={handleChange}
                    />
                </Grid>

                <Grid container item>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={editAcc}
                    >
                        Edit Personal Details
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}
