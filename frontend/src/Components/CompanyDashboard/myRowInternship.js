import React, { useState } from 'react';
import { TableRow, TableCell, Button, Grid } from '@material-ui/core';
import ViewApplications from './ViewApplications'
import { useGetAndSet } from 'react-context-hook';
const baseUrl = "http://127.0.0.1:5000"

function MyRow(props) {
	const row = props.row;
	const uid = row.id;
	const [hasClicked, sethasClicked] = useState(false);
	const [applicants, setApplicants] = useState({});
	const [refreshInternships, setRefreshInternships] = useGetAndSet('refreshInternships', 1);
	var intervalId = 0;

	async function fetchApplications() {
		let res = await fetch(baseUrl + "/api/v1/students_internship_scholarship?" + new URLSearchParams({ uid }), {
			mode: 'cors',
		}).catch(e => console.log("Failed to fetch" + e));
		if (res && res.ok) {
			setApplicants(await res.json())
		}
		else throw Error("Failed to fetch")
	};

	function onViewApplications() {
		fetchApplications()
			.then(() => sethasClicked(true))
			.catch(e => alert(e))

		intervalId = setInterval(() => {
			fetchApplications()
				.then(() => sethasClicked(true))
				.catch(e => alert(e))
		}, 5000);
	}

	function hideApplications() {
		clearInterval(intervalId)
		sethasClicked(false)
	}

	async function deleteInternship() {
		let res = await fetch(baseUrl + "/api/v1/delete?" + new URLSearchParams({ uid, usertype: "internship" }), {
			method: 'DELETE',
			mode: 'cors',
		}).catch(e => console.log("Failed to fetch" + e));
		if (res && res.ok) {
			setRefreshInternships(refreshInternships + 1);
		}
	}

	return (
		<TableRow key={row.name}>
			<TableCell component="th" scope="row">
				<b>{row.name}</b>
				{/* <p>{row.employer}</p> */}
				<p style={{ "whiteSpace": "pre-line" }}>{hasClicked ? "" : row.description}</p>
				<p>{hasClicked ? "" : "GPA criteria: " + row.gpa}</p>
				{
					hasClicked ?
						<ViewApplications hideApplications={hideApplications} applicants={applicants} internshipId={row.id} /> :
						<Grid container spacing={1}>
							<Grid item>
								<Button
									variant="contained"
									onClick={onViewApplications}
									color="primary"
								>
									{"View Applications"}
								</Button>
							</Grid>
							<Grid item>
								<Button
									variant="contained"
									onClick={() => {
										if (window.confirm('Delete the item?'))
											deleteInternship()
									}}
									color="secondary"
								>
									{"DELETE"}
								</Button>
							</Grid>

						</Grid>
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