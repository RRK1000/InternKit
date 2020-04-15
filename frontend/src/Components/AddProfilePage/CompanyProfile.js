import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useGetAndSet, useStoreValue } from "react-context-hook";

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            width: "50ch",
        },
    },
    heading: {
        margin: theme.spacing(2),
        marginLeft: theme.spacing(1),
    },
    button: {
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3),
    },
    caption: {
        marginTop: theme.spacing(4),
        marginLeft: theme.spacing(1),
    },
    skills: {
        width: "20ch",
    },
}));

export default function CompanyProfile() {
    const classes = useStyles();
    const [dob, setDob] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [cname, setCname] = useState("");
    const [post, setPost] = useState("");
    const [github, setGithub] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    const [cdescription, setCdescription] = useState("");

    const token = useStoreValue("isLoggedIn");
    const username = useStoreValue("username");
    const usertype = useGetAndSet("usertype");
    console.log(usertype);
    const [hasProfile, setHasProfile] = useGetAndSet("hasProfile");

    const handleChange = (e) => {
        if (e.target.name === "dob") setDob(e.target.value);
        else if (e.target.name === "email") setEmail(e.target.value);
        else if (e.target.name === "phone") setPhone(e.target.value);
        else if (e.target.name === "cname") setCname(e.target.value);
        else if (e.target.name === "post") setPost(e.target.value);
        else if (e.target.name === "github") setGithub(e.target.value);
        else if (e.target.name === "linkedIn") setLinkedIn(e.target.value);
        else if (e.target.name === "cdescription")
            setCdescription(e.target.value);
    };

    const createAcc = () => {
        const data = Object.assign(
            {},
            {
                username,
                dob,
                token,
                email,
                phone,
                cname,
                snetwork: github + ";" + linkedIn,
                cdescription,
                usertype: usertype[0],
            }
        );
        console.log(data);
        fetch("http://127.0.0.1:5000/api/v1/addprofile", {
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
                setHasProfile(true);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(error);
            });
    };

    if (hasProfile) return <Redirect to="/" />;
    return (
        <Container maxWidth="sm">
            <Typography className={classes.heading} variant="h3">
                Add Profile
            </Typography>
            <form
                className={classes.root}
                noValidate
                autoComplete="off"
                // onSubmit={createAcc}
            >
                <Grid container>
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
                        <Typography className={classes.caption} variant="h4">
                            Company Details
                        </Typography>
                    </Grid>

                    <Grid container item>
                        <TextField
                            required
                            id="outlined-required"
                            label="Company Name"
                            name="cname"
                            value={cname}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid container item>
                        <TextField
                            id="outlined1"
                            className={classes.skills}
                            label="Company Description"
                            name="cdescription"
                            value={cdescription}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid container item>
                        <TextField
                            required
                            id="outlined-required"
                            label="Post"
                            name="post"
                            value={post}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid container item>
                        <Typography className={classes.caption} variant="h4">
                            Network Details
                        </Typography>
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
                            //   type="submit"
                            onClick={createAcc}
                        >
                            Create Account
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}
