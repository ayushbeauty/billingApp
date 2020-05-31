import React, { useState, useContext } from 'react';
import { customAxios, getInvoices } from '../../store';
import { useParams, useHistory, Link } from 'react-router-dom';
import { Row, Col, Button } from 'reactstrap';
import _ from 'lodash';
import { useEffect } from 'react';
import moment from 'moment';
import BootstrapTable from 'react-bootstrap-table-next';

import { renderTotal } from './../billing-block';
import { Context } from '../../store';
import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';

const Invoice = () => {
	const [ state, updateState ] = useState([]);
	const [ invoiceData, updateInvoiceData ] = useState({});
	const { data: { invoice }, dispatches: { invoiceDispatch } } = useContext(Context);
	let { id } = useParams();
	let history = useHistory();
	// let total = 0;
	const [ total, updateTotal ] = useState(0);
	const columns = [
		{
			dataField: 'isPaid',
			text: 'S.No',
			formatter: (cell, row, rowIndex) => rowIndex + 1
		},
		{
			dataField: 'entryDate',
			text: 'Date',
			sort: true,
			formatter: (cell, row, rowIndex) => (cell ? moment(cell).format('DD/MM/YYYY') : 'Date not specified')
		},
		{
			dataField: 'customerId.name',
			text: 'Name',
			sort: true,
			events: {
				onClick: (e, column, columnIndex, row, rowIndex) => {
					history.push(`/invoice/${row._id}`);
				}
			},
			style: {
				cursor: 'pointer'
			}
		},
		{
			dataField: 'customerId.mobileNumber',
			text: 'Mobile',
			sort: false
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
		},
		{
			dataField: '_id',
			text: 'Action',
			formatter: (cell) => (
				<Button
					size="sm"
					outline={true}
					color="danger"
					onClick={() => {
						customAxios.get(`invoice/delete/${cell}`).then(({ data, status }) => {
							if (status === 200) {
								getInvoices(invoiceDispatch);
							}
						});
					}}
				>
					<FontAwesomeIcon icon={faTrashAlt} />
				</Button>
			)
		}
	];

	useEffect(
		() => {
			if (id) {
				customAxios({ method: 'GET', url: `invoice/get/${id}` }).then(({ data, status }) => {
					if (status === 200) {
						// total = 0;
						updateTotal(0);
						updateInvoiceData(data);
					}
				});
			} else if (invoice.response) {
				updateState(invoice.response);
			}
		},
		[ id, invoice ]
	);

	const renderServices = useMemo(
		() => {
			let t = 0;
			return _.map(
				invoiceData.services,
				({ serviceId: { _id, title, amount, category: { name } }, quantity }, index) => {
					t = t + amount * quantity;
					if (invoiceData.services.length === index + 1) updateTotal(t);
					return (
						<Row key={_id}>
							<Col xs={8}>{`${title} - ${name}`}</Col>
							<Col xs={2}>{quantity}</Col>
							<Col xs={2}>{amount * quantity}</Col>
						</Row>
					);
				}
			);
		},
		[ invoiceData ]
	);

	if (id) {
		return (
			<div>
				<Link className="no-print" to="/invoice">
					<Button color="link">Go Back</Button>
				</Link>
				<Row>
					<Col className="text-center">
						<h2 className="font-weight-light">Invoice</h2>
						{id}
					</Col>
				</Row>
				{invoiceData.customerId && (
					<Row>
						<Col>
							<h3 className="font-weight-light">{invoiceData.customerId.name}</h3>
							<span className="text-muted">{invoiceData.customerId.mobileNumber}</span>
							<span className="float-right">{moment(invoiceData.entryDate).format('DD/MM/YYYY')}</span>
						</Col>
					</Row>
				)}
				<hr />

				<Row className="font-italic mb-3">
					<Col xs={8}>Service</Col>
					<Col xs={2}>Quantity</Col>
					<Col xs={2}>Amount</Col>
				</Row>
				{renderServices}
				<Row className="mt-3">
					<Col xs={10}>Total</Col>
					<Col xs={2}>{total}</Col>
				</Row>
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
						<h2 className="text-center font-weight-light">Invoices</h2>
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
					// rowEvents={{
					// 	onClick: (e, { _id }) => {
					// 		history.push(`/invoice/${_id}`);
					// 	}
					// }}
				/>
			</div>
		);
	}
};

export default Invoice;
