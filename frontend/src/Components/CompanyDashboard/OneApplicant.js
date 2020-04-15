import React, { useState } from 'react';
import { Link, Container, Button } from '@material-ui/core';
const baseUrl = "http://127.0.0.1:5000"

function OneApplicant(props) {
	const details = props.details;
	const [showDetails, setShowDetails] = useState(false)
	const [clicked, setClicked] = useState(false)
	const [accProb, setAccProb] = useState(-1)

	async function getAcceptanceProb() {
		setClicked(true)
		let res = await fetch(baseUrl + "/api/v1/internship_probability_acceptance?" + new URLSearchParams({ uid: props.internshipId, userid: details.uid }), {
			mode: 'cors',
		}).catch(e => console.log("Failed to fetch" + e));
		console.log(res)
		if (res && res.ok) {
			res = await res.json();
			let probabilityAcceptance = (res["probability_acceptance"] * 100).toPrecision(4)
			setAccProb(probabilityAcceptance)
		}
	}
	return (
		<div>
			<Link className="input-label"
				onClick={() => setShowDetails(!showDetails)}>
				{details.name} ({details.email})
			</Link>
			{showDetails && (
				<div style={{ "whiteSpace": "pre-line" }}>
					branch: {details.branch}<br />
							college: {details.college}<br />
							dob: {details.dob}<br />
							education: {details.education}<br />
							phone: {details.phone}<br />
							skills:
					<Container>
						{details.skills.trim()}<br />
					</Container>
					{(clicked && accProb != -1) ?
						<span style={{ "color": "red" }}>Acceptance probability: {accProb} %</span> :
						<Button
							color="primary"
							size="small"
							onClick={getAcceptanceProb}
						>
							{(clicked && accProb === -1) ? "Fetching..." : "View Acceptance probability"}
						</Button>
					}
					<br />
					<Link onClick={() => setShowDetails(false)}>hide</Link>
				</div>
			)}
		</div>
	)
}

export default OneApplicant;