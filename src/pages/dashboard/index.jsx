import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import _ from 'lodash';
import { useEffect } from 'react';
import { customAxios } from '../../store';

const Dashboard = () => {
	const [ insight, updateinsighte ] = useState({});
	useEffect(() => {
		customAxios.get('invoice/insight').then(({ data }) => {
			updateinsighte(data);
		});
	}, []);
	const renderCards = (data, key) => {
		return _.map(data, (ins, index) => {
			return (
				<Col key={index}>
					<div className="text-center">
						<h2>{ins.total}</h2>
						<h5>{ins[key]}</h5>
					</div>
				</Col>
			);
		});
	};
	return (
		<div>
			<Row>
				<Col xs={12}>
					<div className="text-center">
						<h4>Overall </h4>
						<h1>{insight.total}</h1>
					</div>
				</Col>
			</Row>
			<hr />
			<Row>
				<Col xs={12}>
					<h4 className="text-center">Year-wise</h4>
				</Col>
				{renderCards(insight.yearly, 'year')}
			</Row>
			<hr />
			<Row>
				<Col xs={12}>
					<h4 className="text-center">Month-wise</h4>
				</Col>
				{renderCards(insight.monthly, 'month')}
			</Row>
		</div>
	);
};

export default Dashboard;
