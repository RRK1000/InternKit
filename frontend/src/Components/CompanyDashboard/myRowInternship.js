import React, { useState } from 'react';
import { TableRow, TableCell, Button } from '@material-ui/core';
import ViewApplications from './ViewApplications'
const baseUrl = "http://127.0.0.1:5000"

function MyRow(props) {
	const row = props.row;
	const uid = row.id;
	const [hasClicked, sethasClicked] = useState(false);
	const [applicants, setApplicants] = useState({})

	async function fetchApplications() {
		let res = await fetch(baseUrl + "/api/v1/students_internship_scholarship?" + new URLSearchParams({ uid }), {
			mode: 'cors',
		}).catch(e => console.log("Failed to fetch" + e));
		// console.log(res)
		if (res && res.ok) {
			sethasClicked(true)
			setApplicants(await res.json())
		}
	};

	return (
		<TableRow key={row.name}>
			<TableCell component="th" scope="row">
				<b>{row.name}</b>
				<p style={{ "whiteSpace": "pre-line" }}>{hasClicked ? "" : row.description}</p>
				<p>{hasClicked ? "" : "GPA criteria: " + row.gpa}</p>
				{
					hasClicked ?
						<ViewApplications hideApplications={() => sethasClicked(false)} applicants={applicants} /> :
						<Button
							variant="contained"
							onClick={fetchApplications}
							color="primary"
						>
							{"View Applications"}
						</Button>
				}
			</TableCell>

			<TableCell align="right">{row.branch}</TableCell>
			<TableCell align="right">{row.city}</TableCell>
			<TableCell align="right">{row.stipend}</TableCell>

			{/* <TableCell align="right">
				
			</TableCell> */}
		</TableRow >
	);
}

export default MyRow;