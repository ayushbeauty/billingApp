import React, { useState } from 'react';
import { customAxios } from '../../App';
import { useParams, Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import _ from 'lodash';
import { useEffect } from 'react';
import moment from 'moment';

import { renderTotal } from './../billing-block';

const Invoice = () => {
	const [ state, updateState ] = useState({});
	let { id } = useParams();
	useEffect(
		() => {
			if (id) {
				customAxios({ method: 'GET', url: `invoice/get/${id}` }).then(({ data, status }) => {
					if (status === 200) updateState(data);
				});
			} else {
				customAxios({ method: 'GET', url: 'invoice' }).then(({ data, status }) => {
					if (status === 200) {
						updateState(data);
					}
				});
			}
		},
		[ id ]
	);

	const renderServices = (services) => {
		return _.map(services, ({ serviceId: { _id, title, amount }, quantity }) => (
			<Row key={_id}>
				<Col xs={8}>{title}</Col>
				<Col xs={2}>{quantity}</Col>
				<Col xs={2}>{amount * quantity}</Col>
			</Row>
		));
	};

	const renderInvoices = (invoices) => {
		if (invoices.length > 0) {
			return _.map(invoices, ({ _id, customerId: { name }, services, created_at }, index) => (
				<Link key={_id} to={`/invoice/${_id}`}>
					<Row>
						<Col xs={1}>{index + 1}</Col>
						<Col>{name}</Col>
						<Col>{renderTotal(services)}</Col>
						<Col xs={2}>{moment(created_at).format('DD/MM/YYYY')}</Col>
					</Row>
				</Link>
			));
		}
	};

	if (id) {
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
	} else {
		return (
			<div>
				<Row>
					<Col>
						<h2 className="text-center font-weight-light">Invoice</h2>
					</Col>
				</Row>
				<hr />
				<Row className="font-italic mb-3">
					<Col xs={1}>S.No</Col>
					<Col>Customer Name</Col>
					<Col>Total</Col>
					<Col xs={2}>Date</Col>
				</Row>
				{renderInvoices(state)}
			</div>
		);
	}
};

export default Invoice;
