import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import TableInternship from "./TableInternship"
import { useStoreValue } from 'react-context-hook';

const baseUrl = "http://127.0.0.1:5000"

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(5),
  },
}));

function createDataInternship(id, name, branch, city, stipend, gpa, employer, description = "No description added.", hasApplied = false) {
  return { id, name, branch, city, stipend, gpa, employer, description, hasApplied };
}

function StudentDashboard() {
  const classes = useStyles();
  const [rowsInternship, setRowsInternship] = useState([]);
  const username = useStoreValue('username')
  // const [rowsScholarship, setRowsScholarship] = useState([]);

  const fetchInternships = useCallback(async () => {
    // Fetch applied intnernships
    let appliedInternships = await fetch(baseUrl + "/api/v1/internships_scholarships_posted_applied?" + new URLSearchParams({ uid: username, usertype: "student" }), {
      mode: 'cors',
    }).catch(e => console.log("Failed to fetch" + e));
    appliedInternships = await appliedInternships.json()
    Object.keys(appliedInternships).forEach(v => appliedInternships[v] = true)

    // Fetch all internships
    let res = await fetch(baseUrl + "/api/v1/all_internship_scholarship", {
      mode: 'cors',
    }).catch(e => console.log("Failed to fetch" + e));
    let data = await res.json();
    let rows = []
    for (const uid in data) {
      if (uid[0] === 'i') { // Internship
        let info = data[uid]
        let row = createDataInternship(uid, info.itr_name, info.branch, info.city, info.stipend, info.gpa, info.emp_name, info.description, appliedInternships[uid])
        rows.push(row)
      }
      else { //Scholarship

      }
    }
    setRowsInternship(rows);
  }, [username])

  useEffect(() => {
    fetchInternships()
  }, [fetchInternships]);

  return (
    <Container className={classes.root} maxWidth="lg">
      <TableInternship rows={rowsInternship} />
    </Container>
  )
}

export default StudentDashboard;