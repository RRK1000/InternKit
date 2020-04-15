import React from 'react';
import { Link } from '@material-ui/core';
import OneApplicant from './OneApplicant.js'

function ViewApplications(props) {
	const applicants = props.applicants;
	return (
		<div>
			{!Object.keys(applicants).length ?
				<p>No applicants.</p> :
				<ol>
					{Object.keys(applicants).map((keyName, i) => (
						<li className="travelcompany-input" key={i}>
							<OneApplicant details={applicants[keyName]} internshipId={props.internshipId} />
						</li>
					))}
				</ol>
			}
			<Link onClick={props.hideApplications} color="primary">
				Hide Applications
			</Link>
		</div>
	)
}

export default ViewApplications;