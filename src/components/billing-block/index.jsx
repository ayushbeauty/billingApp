import React, { useState } from 'react';
import {
	Row,
	Col,
	FormGroup,
	Label,
	Input,
	Button,
	UncontrolledCollapse,
	Card,
	CardHeader,
	CardBody,
	ButtonGroup
} from 'reactstrap';
import moment from 'moment';
import _ from 'lodash';

import './style.scss';

const BillingBlock = () => {
	const [ cart, setCart ] = useState([]);

	const services = {
		Facial: [
			{
				id: 1,
				title: 'De-Tan Facial',
				amount: 500
			},
			{
				id: 2,
				title: 'Diamond Facial',
				amount: 1500
			}
		],
		Wax: [
			{
				id: 3,
				title: 'Brazilian liposoluble wax',
				amount: 600
			},
			{
				id: 4,
				title: 'Rica liposoluble wax',
				amount: 1000
			}
		],
		SPA: [
			{
				id: 5,
				title: 'Hair SPA - Loreal',
				amount: 1500
			},
			{
				id: 6,
				title: 'Hair SPA - Matrix',
				amount: 1000
			}
		],
		Bleach: [
			{
				id: 7,
				title: 'Oxy Crème Bleach',
				amount: 500
			},
			{
				id: 8,
				title: 'Fruit Bleach',
				amount: 500
			}
		]
	};

	const addToCart = (data) => {
		let alreadyInCartIndex = _.findIndex(cart, [ 'id', data.id ]);
		if (alreadyInCartIndex >= 0) {
			let tempCart = cart;
			tempCart[alreadyInCartIndex].quantity = tempCart[alreadyInCartIndex].quantity + 1;
			setCart([ ...tempCart ]);
		} else {
			data.quantity = 1;
			setCart([ ...cart, data ]);
		}
	};

	const removeFromCart = (data) => {
		let alreadyInCartIndex = _.findIndex(cart, [ 'id', data.id ]);
		if (alreadyInCartIndex >= 0) {
			let tempCart = cart;
			if (tempCart[alreadyInCartIndex].quantity > 1)
				tempCart[alreadyInCartIndex].quantity = tempCart[alreadyInCartIndex].quantity - 1;
			else tempCart.splice(alreadyInCartIndex, 1);
			setCart([ ...tempCart ]);
		}
	};

	const renderList = (list) => {
		return _.map(list, (data) => {
			return (
				<Row key={data.id}>
					<Col xs={8}>{data.title}</Col>
					<Col xs={2}>
						<Button onClick={() => addToCart(data)}>+</Button>
					</Col>
				</Row>
			);
		});
	};

	const renderServices = (categories) => {
		return _.map(categories, (value, key) => {
			return (
				<Card key={key}>
					<CardHeader id={key}>{key}</CardHeader>
					<UncontrolledCollapse toggler={`#${key}`}>
						<CardBody>{renderList(value)}</CardBody>
					</UncontrolledCollapse>
				</Card>
			);
		});
	};

	const renderCart = (list) => {
		if (list.length > 0) {
			return _.map(list, (data) => {
				return (
					<Row key={data.id} className="mb-1">
						<Col xs={8}>{data.title}</Col>
						<Col xs={2}>
							<ButtonGroup>
								<Button onClick={() => removeFromCart(data)}>-</Button>
								<Button>{data.quantity}</Button>
								<Button onClick={() => addToCart(data)}>+</Button>
							</ButtonGroup>
						</Col>
						<Col xs={2} className="text-right">
							{data.amount * data.quantity}
						</Col>
					</Row>
				);
			});
		} else {
			return <div className="text-muted text-center">Cart is empty</div>;
		}
	};
	return (
		<div className="billing-block">
			<Row>
				<Col xs={4}>
					<FormGroup row>
						<Label xs={2}>Name</Label>
						<Col xs={10}>
							<Input type="text" placeholder="Type a customer name here" />
						</Col>
					</FormGroup>
				</Col>
				<Col xs={5}>
					<FormGroup row>
						<Label xs={2}>Mobile</Label>
						<Col xs={10}>
							<Input type="text" placeholder="Type a mobile number here" />
						</Col>
					</FormGroup>
				</Col>
				<Col xs={3}>
					<FormGroup row>
						<Label xs={2}>Date</Label>
						<Col xs={10}>
							<Input
								type="text"
								placeholder="Type a customer name here"
								value={moment().format('DD/MM/YYYY')}
							/>
						</Col>
					</FormGroup>
				</Col>
			</Row>
			<br />
			<Row>
				<Col>
					<p>Services</p>
					<hr />
					<div className="accordion">{renderServices(services)}</div>
				</Col>
				<Col>
					<p>Cart</p>
					<hr />
					{cart.length > 0 ? (
						<Row className="mb-3 font-italic">
							<Col xs={8}>Service</Col>
							<Col xs={2}>Quantity</Col>
							<Col xs={2} className="text-right">
								Amount
							</Col>
						</Row>
					) : null}
					{renderCart(cart)}
				</Col>
			</Row>
			<br />
			<Row>
				<Col>
					<div className="text-right">
						<Button color="danger">Generate Bill & Print</Button>
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default BillingBlock;
