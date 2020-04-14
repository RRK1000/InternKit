import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
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
    paper: {
        "& .MuiTextField-root": {
            width: "30ch",
        },
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1),
    },
}));

export default function SkillsTab() {
    const classes = useStyles();

    const [skills, setSkills] = useState("");

    const token = useStoreValue("isLoggedIn");
    const username = useStoreValue("username");
    const usertype = useStoreValue("usertype");

    const [skill, setSkill] = useState({ val: [] });
    const [values, setValues] = useState({ val: [] });

    const createSkill = () => {
        let x;
        return skill.val.map((el, i) => (
            <Grid container key={i}>
                <Grid item xs={3} className={classes.skills}>
                    <TextField
                        id={i}
                        label="Skill"
                        className={classes.skills}
                        variant="outlined"
                        value={el}
                        onChange={handleSkillChange.bind(i)}
                    />
                </Grid>
                <Grid item xs={1} className={classes.value}>
                    <TextField
                        id={i}
                        label="1-10"
                        variant="outlined"
                        value={x}
                        onChange={handleValueChange.bind(i)}
                    />
                </Grid>
                <Grid item xs={3} className={classes.value}>
                    <IconButton
                        aria-label="delete"
                        className={classes.button}
                        onClick={removeSkill.bind(i)}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Grid>
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

    // Fetching Previous project details
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
            setSkills(JSON.stringify(data.skills));
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    const displaySkills = () => {
        let tmp_skills = skills.slice(1, skills.length - 1).split("\\n");
        console.log(tmp_skills);
        tmp_skills.pop();
        return tmp_skills.map((el, i) => (
            // let index = data.snetwork.search(";");
            //     let git = data.snetwork.substr(0, index);
            //     let l = data.snetwork.substr(index + 1, data.snetwork.length);
            <Grid container key={i}>
                <Grid item xs={3} className={classes.skills}>
                    <TextField
                        id={i}
                        label="Skill"
                        className={classes.skills}
                        variant="outlined"
                        value={el.substr(0, el.search("-"))}
                        // onChange={handleSkillChange.bind(i)}
                    />
                </Grid>
                <Grid item xs={3} className={classes.value}>
                    <TextField
                        id={i}
                        label="1-10"
                        variant="outlined"
                        value={el.substr(el.search("-") + 1, el.length)}
                        // onChange={handleValueChange.bind(i)}
                    />
                </Grid>
            </Grid>
        ));
    };

    const editAcc = () => {
        var skillsList = skills.slice(1, skills.length - 1);
        for (var i = 0; i < skill.val.length; i++) {
            skillsList += skill.val[i] + "-" + values.val[i] + "\\n";
        }

        let ndetails = "[" + "'" + skillsList + "'" + "]";
        console.log(ndetails);
        const body = Object.assign(
            {},
            {
                uid: username,
                column_details: "['skills']",
                token,
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
            <Grid container>
                {displaySkills()}
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
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={editAcc}
                    >
                        Add New Skills
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}
