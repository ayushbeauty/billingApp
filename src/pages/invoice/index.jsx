import React, { useState } from 'react';
import { customAxios } from '../../App';
import { useParams } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import _ from 'lodash';
import { useEffect } from 'react';

const Invoice = () => {
	const [ state, updateState ] = useState({});
	let { id } = useParams();
	useEffect(
		() => {
			customAxios({ method: 'GET', url: `invoice/get/${id}` }).then(({ data, status }) => {
				if (status === 200) updateState(data);
			});
		},
		[ id ]
	);

	const renderServices = (services) => {
		return _.map(services, ({ serviceId: { _id, title, amount }, quantity }) => (
			<Row>
				<Col xs={8}>{title}</Col>
				<Col xs={2}>{quantity}</Col>
				<Col xs={2}>{amount * quantity}</Col>
			</Row>
		));
	};
	return (
		<div>
			<Row>
				<Col>
					<h2 className="text-center font-weight-light">Invoice</h2>
				</Col>
			</Row>
			{state.customerId && (
				<Row>
					<Col>
						<h3 className="font-weight-light">{state.customerId.name}</h3>
						<span className="text-muted">{state.customerId.mobileNumber}</span>
					</Col>
				</Row>
			)}
			<hr />

			<Row className="font-italic mb-3">
				<Col xs={8}>Service</Col>
				<Col xs={2}>Quantity</Col>
				<Col xs={2}>Amount</Col>
			</Row>
			{renderServices(state.services)}
		</div>
	);
};

export default Invoice;
