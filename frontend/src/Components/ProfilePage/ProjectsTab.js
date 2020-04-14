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
    project: {
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
            width: "132ch",
        },
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1),
    },
}));

export default function ProjectsTab() {
    const classes = useStyles();

    const [pdescription, setPdescription] = useState("");

    const token = useStoreValue("isLoggedIn");
    const username = useStoreValue("username");
    const usertype = useStoreValue("usertype");

    const [project, setProject] = useState({ val: [] });
    const [desc, setDesc] = useState({ val: [] });

    const createProject = () => {
        let x;
        return project.val.map((el, i) => (
            <Paper className={classes.paper} elevation={3} key={i}>
                <TextField
                    id={i}
                    label="Project Title"
                    className={classes.project}
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
            setPdescription(JSON.stringify(data.pdescription));
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    const displayProjects = () => {
        let projects = pdescription
            .slice(1, pdescription.length - 1)
            .split("\\n");
        console.log(projects);
        let list = [];
        for (var proj = 0; proj < projects.length - 1; proj += 2) {
            let tmp = projects[proj] + ";" + projects[proj + 1];
            list.push(tmp);
        }
        console.log(list);
        return list.map((el, i) => (
            // let index = data.snetwork.search(";");
            //     let git = data.snetwork.substr(0, index);
            //     let l = data.snetwork.substr(index + 1, data.snetwork.length);
            <Paper className={classes.paper} elevation={3} key={i}>
                <TextField
                    id={i}
                    label="Project Title"
                    className={classes.project}
                    variant="outlined"
                    value={el.substr(0, el.search(";"))}
                    // onChange={handleProjectChange.bind(i)}
                />
                <TextField
                    id={i}
                    label="Project Description"
                    variant="outlined"
                    value={el.substr(el.search(";") + 1, el.length)}
                    // onChange={handleDescChange.bind(i)}
                />
            </Paper>
        ));
    };

    const editAcc = () => {
        var tmp = pdescription.slice(1, pdescription.length - 1);
        for (var i = 0; i < project.val.length; i++) {
            tmp += project.val[i] + "\\n" + desc.val[i] + "\\n";
        }
        console.log(tmp)

        let ndetails =
            "[" + "'" + tmp + "'" + "]";
        console.log(ndetails);
        const body = Object.assign(
            {},
            {
                uid: username,
                column_details: "['pdescription']",
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
                {displayProjects()}
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
                        onClick={editAcc}
                    >
                        Add Project Details
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}
