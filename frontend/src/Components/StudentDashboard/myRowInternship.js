import React, { useState } from 'react';
import { TableRow, TableCell, Button, Link } from '@material-ui/core';
import { useStoreValue } from 'react-context-hook';
const baseUrl = "http://127.0.0.1:5000"

function MyRow(props) {
	const row = props.row;
	const uid = row.id;
	const [hasApplied, setHasApplied] = useState(row.hasApplied);
	const username = useStoreValue('username')
	const token = useStoreValue('isLoggedIn')

	async function applyInternship() {
		if (hasApplied) return;
		let data = { username, uid, usertype: "internship", token }
		console.log(data);
		let res = await fetch(baseUrl + "/api/v1/apply", {
			method: "PUT",
			mode: 'cors',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data)
		}).catch(e => alert(e));
		console.log(res)
		if (res.ok) { setHasApplied(true) }
		else alert(JSON.stringify(res))
	};

	async function revokeInternship() {
		let res = await fetch(baseUrl + "/api/v1/delete_applied?" + new URLSearchParams({ userid: username, uid }), {
			method: "DELETE",
			mode: "cors"
		}).catch(e => alert(e));
		if (res && res.ok)
			setHasApplied(false);
	}

	return (
		<TableRow key={row.name}>
			<TableCell component="th" scope="row">
				<b>{row.name}</b>
				<p style={{ "whiteSpace": "pre-line" }}>{row.description}</p>
				<p>GPA criteria: {row.gpa}</p>
			</TableCell>
			<TableCell align="right">{row.branch}</TableCell>
			<TableCell align="right">{row.city}</TableCell>
			<TableCell align="right">{row.stipend}</TableCell>
			<TableCell align="right">
				<Button
					variant={hasApplied ? "contained" : "outlined"}
					onClick={applyInternship}
					color="primary"
				>
					{hasApplied ? "Applied" : "Apply"}
				</Button>
				{hasApplied ?
					<Link component="button" onClick={revokeInternship}>
						Revoke
					</Link> :
					<span />
				}
			</TableCell>
		</TableRow>
	);
}

export default MyRow;