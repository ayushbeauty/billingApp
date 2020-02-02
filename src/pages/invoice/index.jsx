import React, { useState, useContext } from 'react';
import { customAxios, getInvoices } from '../../store';
import { useParams, Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import _ from 'lodash';
import { useEffect } from 'react';
import moment from 'moment';

import { renderTotal } from './../billing-block';
import { Context } from '../../store';

const Invoice = () => {
	const [ state, updateState ] = useState({});
	const { data: { invoice }, dispatches: { invoiceDispatch } } = useContext(Context);
	let { id } = useParams();
	useEffect(
		() => {
			if (id) {
				customAxios({ method: 'GET', url: `invoice/get/${id}` }).then(({ data, status }) => {
					if (status === 200) {
						getInvoices(invoiceDispatch);
						updateState(data);
					}
				});
			} else {
				updateState(invoice.response);
			}
		},
		[ id ]
	);

	const renderServices = (services) => {
		return _.map(services, ({ serviceId: { _id, title, amount, category: { name } }, quantity }) => (
			<Row key={_id}>
				<Col xs={8}>{`${title} - ${name}`}</Col>
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
						<Col xs={2}>{created_at ? moment(created_at).format('DD/MM/YYYY') : 'Date not specified'}</Col>
						<Col>{name}</Col>
						<Col>{renderTotal(services)}</Col>
					</Row>
				</Link>
			));
		} else {
			return (
				<Row>
					<Col className="text-center text-muted">No invoice found</Col>
				</Row>
			);
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
				{state.length > 0 && (
					<Row className="font-italic mb-3">
						<Col xs={1}>S.No</Col>
						<Col xs={2}>Date</Col>
						<Col>Customer Name</Col>
						<Col>Bill Amount</Col>
					</Row>
				)}
				{renderInvoices(state)}
			</div>
		);
	}
};

export default Invoice;
