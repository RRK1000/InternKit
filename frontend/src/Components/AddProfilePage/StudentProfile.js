import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
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
        "& .MuiTextField-root": {
            width: "30ch",
        },
    },
    value: {
        "& .MuiTextField-root": {
            width: "10ch",
        },
    },
    paper:{
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1)
    }
}));

export default function StudentProfile() {
    const classes = useStyles();
    const [dob, setDob] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [grade12, setGrade12] = useState("");
    const [gpa, setGpa] = useState("");
    const [college, setCollege] = useState("");
    const [branch, setBranch] = useState("");
    const [github, setGithub] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    // const [skills, setSkills] = useState("");
    //   const [pdescription, setPdescription] = useState("");

    const token = useStoreValue("isLoggedIn");
    const username = useStoreValue("username");
    const usertype = useStoreValue("usertype");
    const [isLoggedIn] = useGetAndSet("isLoggedIn");
    const [hasProfile, setHasProfile] = useGetAndSet("hasProfile");

    const handleChange = (e) => {
        if (e.target.name === "dob") setDob(e.target.value);
        else if (e.target.name === "email") setEmail(e.target.value);
        else if (e.target.name === "phone") setPhone(e.target.value);
        else if (e.target.name === "grade12") setGrade12(e.target.value);
        else if (e.target.name === "gpa") setGpa(e.target.value);
        else if (e.target.name === "college") setCollege(e.target.value);
        else if (e.target.name === "branch") setBranch(e.target.value);
        else if (e.target.name === "github") setGithub(e.target.value);
        else if (e.target.name === "linkedIn") setLinkedIn(e.target.value);
        // else if (e.target.name === "skills") setSkills(e.target.value);
        // else if (e.target.name === "pdescription") setPdescription(e.target.value);
    };
    const [skill, setSkill] = useState({ val: [] });
    const [values, setValues] = useState({ val: [] });

    const createSkill = () => {
        let x;
        return skill.val.map((el, i) => (
            <Grid container key={i}>
                <Grid item xs={7} className={classes.skills}>
                    <TextField
                        id={i}
                        label="Skill"
                        className={classes.skills}
                        variant="outlined"
                        value={el}
                        onChange={handleSkillChange.bind(i)}
                    />
                </Grid>
                <Grid item xs={3} className={classes.value}>
                    <TextField
                        id={i}
                        label="1-10"
                        variant="outlined"
                        value={x}
                        onChange={handleValueChange.bind(i)}
                    />
                </Grid>
                <IconButton
                    aria-label="delete"
                    className={classes.button}
                    onClick={removeSkill.bind(i)}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Grid>
        ));
    };

    const handleSkillChange = (event) => {
        let vals = [...skill.val];

        vals[event.target.id] = event.target.value;
        console.log(vals);
        setSkill({ val: vals });
    };

    const handleValueChange = (event) => {
        let vals = [...values.val];

        vals[event.target.id] = event.target.value;
        console.log(vals);
        setValues({ val: vals });
    };

    const addSkill = () => {
        setSkill({ val: [...skill.val, ""] });
        setValues({ val: [...values.val, ""] });
    };

    const removeSkill = (i) => {
        let vals = [...skill.val];
        vals.splice(this, 1);
        setSkill({ val: vals });

        let vals1 = [...values.val];
        vals1.splice(this, 1);
        setValues({ val: vals });
    };

    const [project, setProject] = useState({ val: [] });
    const [desc, setDesc] = useState({ val: [] });

    const createProject = () => {
        let x;
        return project.val.map((el, i) => (
            <Paper className={classes.paper} elevation={3} key={i}>
                <TextField
                    id={i}
                    label="Project Title"
                    className={classes.skills}
                    variant="outlined"
                    value={el}
                    onChange={handleProjectChange.bind(i)}
                />
                <TextField
                    id={i}
                    label="Project Description"
                    variant="outlined"
                    value={x}
                    onChange={handleDescChange.bind(i)}
                />
                <IconButton
                    aria-label="delete"
                    className={classes.button}
                    onClick={removeProject.bind(i)}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Paper>
        ));
    };

    const handleProjectChange = (event) => {
        let vals = [...project.val];

        vals[event.target.id] = event.target.value;
        console.log(vals);
        setProject({ val: vals });
    };

    const handleDescChange = (event) => {
        let vals = [...desc.val];

        vals[event.target.id] = event.target.value;
        console.log(vals);
        setDesc({ val: vals });
    };

    const addProject = () => {
        setProject({ val: [...project.val, ""] });
        setDesc({ val: [...desc.val, ""] });
    };

    const removeProject = (i) => {
        let vals = [...project.val];
        vals.splice(this, 1);
        setProject({ val: vals });

        let vals1 = [...desc.val];
        vals1.splice(this, 1);
        setDesc({ val: vals });
    };
    const createAcc = () => {
        var skillsList = "";
        for (var i = 0; i < skill.val.length; i++) {
            skillsList += skill.val[i] + "-" + values.val[i] + "\n";
        }

        var projList = "";
        for (var i = 0; i < project.val.length; i++) {
            projList += project.val[i] + "\n" + desc.val[i] + "\n";
        }
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
                skills: skillsList,
                pdescription: projList,
                usertype,
            }
        );
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
                //re-route to home page
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
                    {createSkill()}
                    <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        className={classes.button}
                        onClick={addSkill}
                    >
                        Add Skill
                    </Button>

                    <Grid container item>
                        <Typography className={classes.caption} variant="h4">
                            Projects
                        </Typography>
                    </Grid>
                    {createProject()}
                    <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        className={classes.button}
                        onClick={addProject}
                    >
                        Add Project
                    </Button>

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
