import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";

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
    const [age, setAge] = React.useState("");

    const handleChange = (event) => {
        setAge(event.target.value);
    };
    return (
        <form className={classes.form} noValidate autoComplete="off">
            <Grid container>
                <Grid container item>
                    <TextField
                        id="outlined"
                        label="Enter Age"
                        defaultValue=""
                        variant="outlined"
                    />
                </Grid>
                <Grid container item>
                    <FormControl
                        variant="outlined"
                        className={classes.formControl}
                    >
                        <InputLabel id="demo-simple-select-outlined-label">
                            Age
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={age}
                            onChange={handleChange}
                            label="Gender"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={"M"}>Male</MenuItem>
                            <MenuItem value={"F"}>Female</MenuItem>
                            <MenuItem value={"O"}>Other</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid container item>
                    <TextField
                        id="outlined"
                        label="Enter Location/City"
                        defaultValue=""
                        variant="outlined"
                    />
                </Grid>

                <Grid container item>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                    >
                        Edit Personal Details
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}
