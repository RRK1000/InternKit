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
});

class AddProfile extends React.Component {
    constructor(props) {
        super(props);
        // To Do, pass username and usertype as props
        this.state = {
            username: "",
            dob: "",
            email: "",
            phone: "",
            grade12: "",
            gpa: "",
            college: "",
            branch: "",
            snetwork: "",
            skills: "",
            pdescription: "",
            usertype: "",
        };
        this.doLogin = this.doLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    doLogin() {
        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        };
        const data = this.state;
        console.log(data);
        // axios
        //     .post("http://localhost:5000/api/v1/addprofile", data, headers)
        //     .then((res) => {
        //         console.log(res.data);
        //         setToken(res.data);
        //     });
    }
    render() {
        const { classes } = this.props;
        return (
            <Container maxWidth="sm">
                <Typography className={classes.heading} variant="h2">
                    Add Profile
                </Typography>
                <form
                    className={classes.root}
                    noValidate
                    autoComplete="off"
                    onSubmit={this.doLogin}
                >
                    <Grid container>
                        <Grid container item>
                            <TextField
                                required
                                id="outlined-required"
                                label="Username"
                                name="username"
                                value={this.username}
                                variant="outlined"
                                onChange={this.handleChange}
                            />
                        </Grid>

                        {/* <Grid container item>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="Date picker inline"
                                    value={this.dob}
                                    onChange={this.handleChange}
                                    KeyboardButtonProps={{
                                        "aria-label": "change date",
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid> */}

                        <Grid container item>
                            <TextField
                                required
                                id="outlined-required"
                                label="Email"
                                name="email"
                                value={this.email}
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
                                value={this.phone}
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
                                value={this.college}
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
                                value={this.branch}
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
                                value={this.grade12}
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
                                value={this.gpa}
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
export default withStyles(useStyles)(AddProfile);
