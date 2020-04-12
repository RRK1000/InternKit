import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useGetAndSet } from "react-context-hook";

const isLoggedIn = require("../../util/auth").isLoggedIn;

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

export default function StudentProfile() {
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [dob, setDob] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [grade12, setGrade12] = useState("");
    const [gpa, setGpa] = useState("");
    const [college, setCollege] = useState("");
    const [branch, setBranch] = useState("");
    const [github, setGithub] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    const [skills, setSkills] = useState("");
    //   const [pdescription, setPdescription] = useState("");

    const [isLoggedIn, setIsLoggedIn] = useGetAndSet("isLoggedIn");
    const [usertype, setUserType] = useGetAndSet('usertype');

    const handleChange = (e) => {
        if (e.target.name === "username") setUsername(e.target.value);
        else if (e.target.name === "dob") setDob(e.target.value);
        else if (e.target.name === "email") setEmail(e.target.value);
        else if (e.target.name === "phone") setPhone(e.target.value);
        else if (e.target.name === "grade12") setGrade12(e.target.value);
        else if (e.target.name === "gpa") setGpa(e.target.value);
        else if (e.target.name === "college") setCollege(e.target.value);
        else if (e.target.name === "branch") setBranch(e.target.value);
        else if (e.target.name === "github") setGithub(e.target.value);
        else if (e.target.name === "linkedIn") setLinkedIn(e.target.value);
        else if (e.target.name === "skills") setSkills(e.target.value);
        // else if (e.target.name === "pdescription") setPdescription(e.target.value);
    };

    const createAcc = () => {
        const data = Object.assign(
            {},
            {
                username,
                dob,
                token: isLoggedIn,
                email,
                phone,
                education: grade12 + ";" + gpa,
                college,
                branch,
                snetwork: github + ";" + linkedIn,
                skills: "python-5;java-6;ml-9",
                pdescription:
                    "ProjectTitle1#projectdescription;ProjectTitle2#projectdescription;ProjectTitle3#projectdescription",
                usertype,
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
                localStorage.setItem("profile", true);
                //re-route to home page
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(error);
            });
    };
    if(localStorage.getItem("profile") === "true") return <Redirect to='/' />;

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
                            required
                            id="outlined-required"
                            label="College Name"
                            name="college"
                            value={college}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid container item>
                        <TextField
                            required
                            id="outlined-required"
                            label="Branch"
                            name="branch"
                            value={branch}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid container item>
                        <Typography className={classes.caption} variant="h4">
                            Education Details
                        </Typography>
                    </Grid>
                    <Grid container item>
                        <TextField
                            required
                            id="outlined-required"
                            label="12th grade(%)"
                            name="grade12"
                            value={grade12}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid container item>
                        <TextField
                            required
                            id="outlined-required"
                            label="College GPA"
                            name="gpa"
                            value={gpa}
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
                        <Typography className={classes.caption} variant="h4">
                            Skills
                        </Typography>
                    </Grid>
                    <Grid container item>
                        <TextField
                            id="outlined1"
                            className={classes.skills}
                            label="Add Skill"
                            name="skills"
                            value={skills}
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
