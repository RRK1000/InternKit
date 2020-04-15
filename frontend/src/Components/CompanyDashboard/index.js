import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Link, Button } from '@material-ui/core';
import TableInternship from "./TableInternship"
import { useStoreValue } from 'react-context-hook';
import { Link as RouterLink } from 'react-router-dom';

const baseUrl = "http://127.0.0.1:5000"

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(5),
  },
}));

function createDataInternship(id, name, branch, city, stipend, gpa, description = "No description added.") {
  return { id, name, branch, city, stipend, gpa, description };
}

function CompanyDashboard() {
  const classes = useStyles();
  const [rowsInternship, setRowsInternship] = useState([]);
  const username = useStoreValue('username');

  const fetchInternships = useCallback(async () => {
    let res = await fetch(baseUrl + "/api/v1/all_internship_scholarship", {
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
      }
    }).catch(e => console.log("Failed to fetch" + e));
    let data = await res.json();
    let rows = []
    for (const uid in data) {
      if (uid[0] === 'i') { // Internship
        let info = data[uid]
        if (info.emp_id === username) {
          let row = createDataInternship(uid, info.itr_name, info.branch, info.city, info.stipend, info.gpa, info.description)
          rows.push(row)
        }
      }
      else { //Scholarship

      }
    }
    setRowsInternship(rows);
    console.log(data)
  }, [username])

  useEffect(() => {
    fetchInternships()
  }, [fetchInternships]);

  return (
    <Container className={classes.root} maxWidth="lg">
      <Link component={RouterLink} to='addInternship'>
        <Button
          variant="outlined"
          color="primary"
        >
          Add new Internship
        </Button>
      </Link>
      <p />
      <TableInternship rows={rowsInternship} />
    </Container>
  )
}

export default CompanyDashboard;