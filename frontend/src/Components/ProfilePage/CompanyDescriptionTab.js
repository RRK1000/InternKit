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
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

export default function PersonalDetailsTab() {
    const classes = useStyles();
    const username = useStoreValue("username");

    const [cdescription, setCdescription] = useState("");
    const [ncdescription, setNCdescription] = useState("");

    const [isLoggedIn] = useGetAndSet("isLoggedIn");
    const [usertype] = useGetAndSet("usertype");

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
            setCdescription(data.cdescription);
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    const handleChange = (e) => {
        if (e.target.name === "ncdescription") setNCdescription(e.target.value);
    };
    const displaySDesc = () => {
        return (
            <Grid container item>
                <TextField
                    disabled
                    id="outlined1"
                    className={classes.skills}
                    label="Current Company Description"
                    name="cdescription"
                    value={cdescription}
                    variant="filled"
                    // onChange={handleChange}
                />
            </Grid>
        );
    };
    const editAcc = () => {
        let ndetails = "[" + "'" + ncdescription + "'" + "]";
        console.log(JSON.stringify(ndetails));
        const body = Object.assign(
            {},
            {
                uid: username,
                column_details: "['cdescription']",
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
    };
    return (
        <form className={classes.form} noValidate autoComplete="off">
            {displaySDesc()}
            <Grid container>
                <Grid container item>
                    <TextField
                        id="outlined-required"
                        label="Change Company Description"
                        name="ncdescription"
                        value={ncdescription}
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
                        Edit Company Description
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}
