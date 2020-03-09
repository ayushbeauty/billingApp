import React, { useState, useContext } from 'react';
import { customAxios, getInvoices } from '../../store';
import { useParams, useHistory } from 'react-router-dom';
import { Row, Col, Button } from 'reactstrap';
import _ from 'lodash';
import { useEffect } from 'react';
import moment from 'moment';
import BootstrapTable from 'react-bootstrap-table-next';

import { renderTotal } from './../billing-block';
import { Context } from '../../store';

const columns = [
	{
		dataField: '_id',
		text: 'S.No',
		formatter: (cell, row, rowIndex) => rowIndex + 1
	},
	{
		dataField: 'created_at',
		text: 'Date',
		sort: true,
		formatter: (cell, row, rowIndex) => (cell ? moment(cell).format('DD/MM/YYYY') : 'Date not specified')
	},
	{
		dataField: 'customerId.name',
		text: 'Name',
		sort: true
	},
	{
		dataField: 'services',
		text: 'Particulars',
		formatter: (cell, row) => {
			return _.map(cell, ({ serviceId: { title, category: { name } } }, index) => {
				return `${title} - ${name}${cell.length > 0
					? index >= 0 && index < cell.length - 1 ? `, ` : ``
					: ``}`;
			});
		}
	},
	{
		dataField: 'updated_at',
		text: 'Bill Amount',
		formatter: (cell, { services }) => renderTotal(services)
	}
];

const Invoice = () => {
	const [ state, updateState ] = useState([]);
	const [ invoiceData, updateInvoiceData ] = useState({});
	const { data: { invoice }, dispatches: { invoiceDispatch } } = useContext(Context);
	let { id } = useParams();
	let history = useHistory();
	useEffect(
		() => {
			if (id) {
				customAxios({ method: 'GET', url: `invoice/get/${id}` }).then(({ data, status }) => {
					if (status === 200) {
						getInvoices(invoiceDispatch);
						updateInvoiceData(data);
					}
				});
			} else if (invoice.response) {
				updateState(invoice.response);
			}
		},
		[ id, id || invoice ]
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

	if (id) {
		return (
			<div>
				<Row>
					<Col>
						<h2 className="text-center font-weight-light">Invoice</h2>
					</Col>
				</Row>
				{invoiceData.customerId && (
					<Row>
						<Col>
							<h3 className="font-weight-light">{invoiceData.customerId.name}</h3>
							<span className="text-muted">{invoiceData.customerId.mobileNumber}</span>
						</Col>
					</Row>
				)}
				<hr />

				<Row className="font-italic mb-3">
					<Col xs={8}>Service</Col>
					<Col xs={2}>Quantity</Col>
					<Col xs={2}>Amount</Col>
				</Row>
				{renderServices(invoiceData.services)}
				<Row className="mt-4 no-print">
					<Col className="text-right">
						<Button
							color="danger"
							onClick={() => {
								window.print();
							}}
						>
							Print
						</Button>
					</Col>
				</Row>
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
				<BootstrapTable
					bootstrap4
					keyField="_id"
					columns={columns}
					data={state}
					hover
					noDataIndication="No invoice found"
					rowEvents={{
						onClick: (e, { _id }) => {
							history.push(`/invoice/${_id}`);
						}
					}}
				/>
			</div>
		);
	}
};

export default Invoice;
