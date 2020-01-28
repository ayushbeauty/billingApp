import React, { useState, useContext, useReducer } from 'react';
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
	ButtonGroup,
	Modal,
	ModalBody,
	ModalHeader
} from 'reactstrap';
import moment from 'moment';
import _ from 'lodash';

import { Context, initialState, customAxios, getServices } from '../../App';

import './style.scss';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const types = {
	REQ: 'Request_Category',
	RES: 'Response_Category',
	FAIL: 'Falied_Category'
};

const reducer = (state, { type, payload }) => {
	switch (type) {
		case types.REQ:
			return {
				...state,
				requesting: true
			};
		case types.RES:
			return { ...state, response: payload, requesting: false };
		case types.FAIL:
			return {
				...state,
				response: 'Error',
				requesting: false
			};
		default:
			return state;
	}
};

const BillingBlock = () => {
	const history = useHistory();
	const [ cart, setCart ] = useState([]);
	const [ state, dispatch ] = useReducer(reducer, initialState);
	const [ addServiceModalInstance, updateaddServiceModalInstance ] = useState(false);
	const [ addCategoryModalInstance, updateaddCategoryModalInstance ] = useState(false);
	const { data: { service }, dispatches: { serviceDispatch } } = useContext(Context);
	const [ invoice, invoiceDispatch ] = useReducer((state, { type, data }) => {
		switch (type) {
			case 'userData':
				let { mobileNumber, name } = data;
				return { ...state, mobileNumber, name };
			case 'service':
				let list = data.map((data) => {
					return { serviceId: data._id, quantity: data.quantity };
				});
				return { ...state, services: list };
			default:
				return state;
		}
	}, {});
	const services = service.response;

	useEffect(
		() => {
			invoiceDispatch({ type: 'service', data: cart });
		},
		[ cart ]
	);

	const getCategories = () => {
		customAxios
			.get('category')
			.then((response) => dispatch({ type: types.RES, payload: response.data }))
			.catch((err) => dispatch({ type: types.FAIL, payload: err }));
	};

	const addToCart = (data) => {
		let alreadyInCartIndex = _.findIndex(cart, [ '_id', data._id ]);
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
		let alreadyInCartIndex = _.findIndex(cart, [ '_id', data._id ]);
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
				<Row key={data._id}>
					<Col xs={8}>{data.title}</Col>
					<Col xs={4}>
						<Button block={true} size="sm" outline={true} onClick={() => addToCart(data)}>
							Add to Cart
						</Button>
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
					<Row key={data._id} className="mb-1">
						<Col xs={8}>{data.title}</Col>
						<Col xs={2}>
							<ButtonGroup size="sm">
								<Button outline={true} onClick={() => removeFromCart(data)}>
									-
								</Button>
								<Button outline={true}>{data.quantity}</Button>
								<Button outline={true} onClick={() => addToCart(data)}>
									+
								</Button>
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
			<Formik
				initialValues={{
					mobileNumber: '',
					name: ''
				}}
			>
				{({ setFieldValue, values }) => (
					<Form>
						<Row>
							<Col xs={4}>
								<FormGroup row>
									<Label xs={2}>Mobile</Label>
									<Col xs={10}>
										<Field name="mobileNumber">
											{({ field, field: { name } }) => {
												return (
													<Input
														type="number"
														placeholder="Type a mobile number here"
														{...field}
														onChange={({ target: { value } }) => setFieldValue(name, value)}
														onBlur={({ target: { value } }) => {
															if (value) {
																customAxios({
																	method: 'post',
																	url: 'customer/getCustomerByMobileNumber',
																	data: { mobileNumber: value }
																}).then(({ data, status }) => {
																	if (status === 200) {
																		setFieldValue('name', data.name);
																		invoiceDispatch({ type: 'userData', data });
																	}
																});
															}
														}}
													/>
												);
											}}
										</Field>
									</Col>
								</FormGroup>
							</Col>
							<Col xs={5}>
								<FormGroup row>
									<Label xs={2}>Name</Label>
									<Col xs={10}>
										<Field name="name">
											{({ field }) => (
												<Input
													type="text"
													placeholder="Type a customer name here"
													{...field}
													onBlur={({ target: { value } }) => {
														invoiceDispatch({
															type: 'userData',
															data: values
														});
													}}
												/>
											)}
										</Field>
									</Col>
								</FormGroup>
							</Col>
							<Col xs={3}>
								<FormGroup row>
									<Label xs={2}>Date</Label>
									<Col xs={10}>
										<Input
											type="text"
											placeholder="Today's date"
											value={moment().format('DD/MM/YYYY')}
											onChange={({ target: { value } }) => value}
										/>
									</Col>
								</FormGroup>
							</Col>
						</Row>
					</Form>
				)}
			</Formik>
			<br />
			<Row>
				<Col>
					<p>
						Services
						<Button
							className="float-right"
							size="sm"
							color="danger"
							outline={true}
							onClick={() => {
								getCategories();
								updateaddServiceModalInstance(!addServiceModalInstance);
							}}
						>
							+ Add new service
						</Button>
						<Modal
							fade={true}
							centered={true}
							isOpen={addServiceModalInstance}
							toggle={() => updateaddServiceModalInstance(!addServiceModalInstance)}
						>
							<ModalHeader>Add Service</ModalHeader>
							<ModalBody>
								<Formik
									initialValues={{
										title: '',
										category: '',
										amount: ''
									}}
									validate={(values) => {
										let errors = {};
										if (!values.title) errors.title = 'Name is required, ';
										if (!values.category) errors.category = 'Category is required, ';
										if (!values.amount) errors.amount = "Without cost it won't proceed";
										return errors;
									}}
									onSubmit={(values) => {
										customAxios({
											method: 'post',
											url: 'service/add',
											data: values
										}).then(({ data, status }) => {
											if (status === 200) {
												getServices(serviceDispatch);
												updateaddServiceModalInstance(!addServiceModalInstance);
											}
										});
									}}
								>
									{() => (
										<Form>
											<FormGroup row>
												<Label xs={3}>Category</Label>
												<Col xs={9}>
													<Field name="category" as="select" className="form-control">
														<option value="" disabled>
															Select category
														</option>
														{state.response.map((data) => (
															<option value={data._id} key={data._id}>
																{data.name}
															</option>
														))}
													</Field>
												</Col>
											</FormGroup>
											<p className="text-center text-muted">
												Do you want to add new category? &nbsp;
												<Button
													size="sm"
													outline={true}
													onClick={() =>
														updateaddCategoryModalInstance(!addCategoryModalInstance)}
												>
													Add Category
												</Button>
												<Modal
													isOpen={addCategoryModalInstance}
													toggle={() =>
														updateaddCategoryModalInstance(!addCategoryModalInstance)}
												>
													<ModalHeader>Add Category</ModalHeader>
													<ModalBody>
														<Formik
															initialValues={{ name: '' }}
															validate={(values) => {
																let errors = {};
																if (!values.name)
																	errors.name = 'Provide something to proceed!';
																return errors;
															}}
															onSubmit={(values) => {
																customAxios({
																	method: 'post',
																	url: 'category/add',
																	data: values
																}).then(({ status }) => {
																	if (status === 200) {
																		getCategories();
																		updateaddCategoryModalInstance(
																			!addCategoryModalInstance
																		);
																	}
																});
															}}
														>
															{() => (
																<Form>
																	<FormGroup row>
																		<Label xs={3}>Name</Label>
																		<Col xs={9}>
																			<Field
																				type="text"
																				name="name"
																				className="form-control"
																				placeholder="Type the generalized category"
																			/>
																		</Col>
																	</FormGroup>
																	<div>
																		<div className="float-left">
																			<ErrorMessage name="name" />
																		</div>
																		<div className="float-right">
																			<Button
																				className="mr-2"
																				onClick={() =>
																					updateaddCategoryModalInstance(
																						!addCategoryModalInstance
																					)}
																			>
																				Cancel
																			</Button>
																			<Button type="submit" color="danger">
																				Save
																			</Button>
																		</div>
																	</div>
																</Form>
															)}
														</Formik>
													</ModalBody>
												</Modal>
											</p>
											<hr />
											<FormGroup row>
												<Label xs={3}>Name</Label>
												<Col xs={9}>
													<Field
														name="title"
														placeholder="Enter the service name"
														type="text"
														className="form-control"
													/>
												</Col>
											</FormGroup>
											<FormGroup row>
												<Label xs={3}>Amount</Label>
												<Col xs={9}>
													<Field
														name="amount"
														placeholder="How much it cost for this service"
														type="number"
														className="form-control"
													/>
												</Col>
											</FormGroup>
											<div className="text-center">
												<ErrorMessage name="category" />
												<ErrorMessage name="title" />
												<ErrorMessage name="amount" />
												<hr />
												<Button
													className="mr-2"
													onClick={() =>
														updateaddServiceModalInstance(!addServiceModalInstance)}
												>
													Cancel
												</Button>
												<Button type="submit" color="danger">
													Save
												</Button>
											</div>
										</Form>
									)}
								</Formik>
							</ModalBody>
						</Modal>
					</p>
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
					{cart.length > 0 ? (
						<Row className="mt-3">
							<Col xs={8}>Total</Col>
							<Col xs={4} className="text-right">
								{renderTotal(cart)}
							</Col>
						</Row>
					) : null}
				</Col>
			</Row>
			<br />
			<Row>
				<Col>
					<div className="text-right">
						<Button
							color="danger"
							onClick={() => {
								customAxios({
									method: 'POST',
									url: 'invoice/add',
									data: invoice
								}).then(({ data, status }) => {
									if (status === 200) {
										history.push(`/invoice/${data._id}`);
									}
								});
							}}
						>
							Generate Bill & Print
						</Button>
					</div>
				</Col>
			</Row>
		</div>
	);
};

const renderTotal = (cart) => {
	let total = 0;
	cart.map(({ amount, quantity }) => {
		return (total = total + amount * quantity);
	});
	return total;
};

export default BillingBlock;
