import React from "react";
import axios from "axios";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const isLoggedIn = require("../../util/auth").isLoggedIn;

const useStyles = (theme) => ({
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
    },
    caption: {
        marginTop: theme.spacing(4),
        marginLeft: theme.spacing(1),
    },
    skills: {
        width: "20ch",
    },
});

class StudentProfile extends React.Component {
    constructor(props) {
        super(props);
        // To Do, pass username as props
        this.state = {
            username: "",
            dob: "",
            email: "",
            phone: "",
            grade12: "",
            gpa: "",
            college: "",
            branch: "",
            github: "",
            linkedIn: "",
            skills: "",
            pdescription: "",
            usertype: "student",
        };
        this.createAcc = this.createAcc.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    
    createAcc() {
        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        };
        const data = {
            "username": this.state.username,
            "dob": this.state.dob,
            "token": isLoggedIn(),
            "email": this.state.email,
            "phone": this.state.phone,
            "education": this.state.grade12 + ";" + this.state.gpa,
            "college": this.state.college,
            "branch": this.state.branch,
            "snetwork": this.state.github + ";" + this.state.linkedIn,
            "skills": "python-5;java-6;ml-9",
            "pdescription":
                "ProjectTitle1#projectdescription;ProjectTitle2#projectdescription;ProjectTitle3#projectdescription",
            "usertype": this.state.usertype,
        };
        axios
            .post("http://127.0.0.1:5000/api/v1/addprofile", data, headers)
            .then((res) => {
                localStorage.setItem("profile", true);
            });
    }
    render() {
        const { classes } = this.props;
        return (
            <Container maxWidth="sm">
                <Typography className={classes.heading} variant="h3">
                    Add Profile
                </Typography>
                <form
                    className={classes.root}
                    noValidate
                    autoComplete="off"
                    onSubmit={this.createAcc}
                >
                    <Grid container>
                        <Grid container item>
                            <TextField
                                required
                                id="outlined-required"
                                label="Username"
                                name="username"
                                value={this.state.username}
                                variant="outlined"
                                onChange={this.handleChange}
                            />
                        </Grid>

                        <Grid container item>
                            <TextField
                                required
                                id="outlined-required"
                                label="Date of Birth (DD/MM/YYYY)"
                                name="dob"
                                value={this.state.dob}
                                variant="outlined"
                                onChange={this.handleChange}
                            />
                        </Grid>

                        <Grid container item>
                            <TextField
                                required
                                id="outlined-required"
                                label="Email"
                                name="email"
                                value={this.state.email}
                                variant="outlined"
                                onChange={this.handleChange}
                            />
                        </Grid>
                        <Grid container item>
                            <TextField
                                required
                                id="outlined-required"
                                label="Phone"
                                name="phone"
                                value={this.state.phone}
                                variant="outlined"
                                onChange={this.handleChange}
                            />
                        </Grid>
                        <Grid container item>
                            <TextField
                                required
                                id="outlined-required"
                                label="College Name"
                                name="college"
                                value={this.state.college}
                                variant="outlined"
                                onChange={this.handleChange}
                            />
                        </Grid>
                        <Grid container item>
                            <TextField
                                required
                                id="outlined-required"
                                label="Branch"
                                name="branch"
                                value={this.state.branch}
                                variant="outlined"
                                onChange={this.handleChange}
                            />
                        </Grid>

                        <Grid container item>
                            <Typography
                                className={classes.caption}
                                variant="h4"
                            >
                                Education Details
                            </Typography>
                        </Grid>
                        <Grid container item>
                            <TextField
                                required
                                id="outlined-required"
                                label="12th grade(%)"
                                name="grade12"
                                value={this.state.grade12}
                                variant="outlined"
                                onChange={this.handleChange}
                            />
                        </Grid>
                        <Grid container item>
                            <TextField
                                required
                                id="outlined-required"
                                label="College GPA"
                                name="gpa"
                                value={this.state.gpa}
                                variant="outlined"
                                onChange={this.handleChange}
                            />
                        </Grid>

                        <Grid container item>
                            <Typography
                                className={classes.caption}
                                variant="h4"
                            >
                                Network Details
                            </Typography>
                        </Grid>
                        <Grid container item>
                            <TextField
                                id="outlined1"
                                label="Github"
                                name="github"
                                value={this.state.github}
                                variant="outlined"
                                onChange={this.handleChange}
                            />
                        </Grid>
                        <Grid container item>
                            <TextField
                                id="outlined2"
                                label="LinkedIn"
                                name="linkedIn"
                                value={this.state.linkedIn}
                                variant="outlined"
                                onChange={this.handleChange}
                            />
                        </Grid>

                        <Grid container item>
                            <Typography
                                className={classes.caption}
                                variant="h4"
                            >
                                Skills
                            </Typography>
                        </Grid>
                        <Grid container item>
                            <TextField
                                id="outlined1"
                                className={classes.skills}
                                label="Add Skill"
                                name="skills"
                                value={this.state.skills}
                                variant="outlined"
                                onChange={this.handleChange}
                            />
                        </Grid>

                        <Grid container item>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                Create Account
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        );
    }
}
export default withStyles(useStyles)(StudentProfile);
