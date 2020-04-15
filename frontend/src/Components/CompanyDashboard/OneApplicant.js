import React, { useState } from 'react';
import { Link, Container } from '@material-ui/core';

function OneApplicant(props) {
	const details = props.details;
	const [showDetails, setShowDetails] = useState(false)
	return (
		<div>
			<Link className="input-label"
				onClick={() => setShowDetails(!showDetails)}>
				{details.name} ({details.email})
			</Link>
			{
				!showDetails ?
					<span></span> :
					<span>
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
							{/* <Link
								variant="outlined"
								color="primary"
							>
								View Acceptance probability
							</Link> 
							<br /> */}
							<Link onClick={() => setShowDetails(false)}>hide</Link>
						</div>
					</span>
			}
		</div>
	)
}

export default OneApplicant;