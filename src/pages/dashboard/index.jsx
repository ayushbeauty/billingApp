import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import { useEffect } from 'react';
import { customAxios } from '../../store';

const Dashboard = () => {
	const [ total, updateTotal ] = useState(0);
	useEffect(() => {
		customAxios.get('invoice/insight').then(({ data }) => {
			updateTotal(data.total);
		});
	}, []);
	return (
		<Row>
			<Col>
				<div className="text-center">
					<h1>{total}</h1>
					<h4>Total billing amount</h4>
				</div>
			</Col>
		</Row>
	);
};

export default Dashboard;
