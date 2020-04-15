import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import {  useStoreValue } from "react-context-hook";

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

function AddInternship(props) {
    const usertype = "internship";

    // const token = useStoreValue("isLoggedIn");
    const username = useStoreValue("username");

    // const [emp_name, setEmp_name] = useState("");
    const [itr_name, setItr_name] = useState("");
    const [stipend, setStipend] = useState("");
    const [branch, setBranch] = useState("");
    const [city, setCity] = useState("");
    const [description, setDescription] = useState("");
    const [gpa, setGpa] = useState("");
    const [hasCreated, setHasCreated] = useState("");

    const onSubmit = () => {
        const data = {
            emp_name: username,
            itr_name,
            stipend,
            branch,
            city,
            description,
            gpa,
            usertype,
        };
        console.log(data);
        fetch("http://127.0.0.1:5000/api/v1/add_internship_scholarship", {
            method: "PUT",
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
                console.log(data);
                setHasCreated(true);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
    const { classes } = props;

    return hasCreated ? (
        <Redirect to="/" />
    ) : (
        <Container maxWidth="sm">
            <Typography className={classes.heading} variant="h4">
                Add Internship
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
                            label="Job Title"
                            name="itr_name"
                            value={itr_name}
                            variant="outlined"
                            onChange={(e) => setItr_name(e.target.value)}
                        />
                    </Grid>

                    <Grid container item>
                        <TextField
                            required
                            id="outlined-required"
                            label="Stipend provided"
                            name="stipend"
                            value={stipend}
                            variant="outlined"
                            onChange={(e) => setStipend(e.target.value)}
                        />
                    </Grid>

                    <Grid container item>
                        <TextField
                            required
                            id="outlined-required"
                            label="Required Branch"
                            name="branch"
                            value={branch}
                            variant="outlined"
                            onChange={(e) => setBranch(e.target.value)}
                        />
                    </Grid>

                    <Grid container item>
                        <TextField
                            required
                            id="outlined-required"
                            label="City"
                            name="city"
                            value={city}
                            variant="outlined"
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </Grid>

                    <Grid container item>
                        <TextField
                            required
                            id="outlined-required"
                            label="Description"
                            name="description"
                            value={description}
                            variant="outlined"
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Grid>

                    <Grid container item>
                        <TextField
                            required
                            id="outlined-required"
                            label="Minimum GPA"
                            name="gpa"
                            value={gpa}
                            variant="outlined"
                            onChange={(e) => setGpa(e.target.value)}
                        />
                    </Grid>

                    <Grid container item>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            // type="submit"
                            onClick={onSubmit}
                        >
                            Add Internship
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}

export default withStyles(useStyles)(AddInternship);
