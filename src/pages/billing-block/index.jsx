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
import moment, { isMoment } from 'moment';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';

import { Context, initialState, customAxios, getServices, getInvoices } from '../../store';

import './style.scss';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import DateTime from 'react-datetime';

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

const serviceInitData = {
	title: '',
	category: '',
	amount: ''
};

const categoryInitData = { name: '' };

const BillingBlock = () => {
	const history = useHistory();
	const [ cart, setCart ] = useState([]);
	const [ state, dispatch ] = useReducer(reducer, initialState);
	const [ updateFlag, setUpdateFlag ] = useState(false);
	const [ serviceData, updateServiceData ] = useState(serviceInitData);
	const [ categoryData, updateCategoryData ] = useState(categoryInitData);
	const [ addServiceModalInstance, updateaddServiceModalInstance ] = useState(false);
	const [ addCategoryModalInstance, updateaddCategoryModalInstance ] = useState(false);
	const { data: { service }, dispatches: { serviceDispatch, invoiceDispatch } } = useContext(Context);
	const [ payload, payloadDispatch ] = useReducer((state, { type, data }) => {
		switch (type) {
			case 'userData':
				let { mobileNumber, name, entryDate } = data;
				return { ...state, mobileNumber, name, entryDate };
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
			payloadDispatch({ type: 'service', data: cart });
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
				<Row key={data._id} className="mb-1">
					<Col xs={6} className="text-capitalize">
						<span className="mr-2">
							<Button
								size="sm"
								outline={true}
								color="link"
								onClick={() => {
									getCategories();
									updateServiceData({ ...data, category: data.category._id });
									setUpdateFlag(true);
									updateaddServiceModalInstance(!addServiceModalInstance);
								}}
							>
								<FontAwesomeIcon icon={faPen} />
							</Button>
						</span>
						{data.title}
					</Col>
					<Col xs={2} className="text-right">
						{data.amount}
					</Col>
					<Col xs={4}>
						<Button block={true} size="sm" onClick={() => addToCart(data)}>
							Add to Cart
						</Button>
					</Col>
				</Row>
			);
		});
	};

	const renderServices = (categories) => {
		if (!_.isEmpty(categories)) {
			return _.map(categories, (value, key) => {
				let id = '_' + Math.random().toString(36).substr(2, 9);
				return (
					<Card key={key}>
						<CardHeader id={id} xs={6} className="text-capitalize">
							{key}
							<span className="float-right">
								<Button
									size="sm"
									outline={true}
									color="link"
									onClick={(e) => {
										e.preventDefault();
										updateCategoryData(value[0].category);
										setUpdateFlag(true);
										updateaddCategoryModalInstance(!addCategoryModalInstance);
									}}
								>
									<FontAwesomeIcon icon={faPen} />
								</Button>
							</span>
						</CardHeader>
						<UncontrolledCollapse toggler={`#${id}`}>
							<CardBody>{renderList(value)}</CardBody>
						</UncontrolledCollapse>
					</Card>
				);
			});
		} else {
			return <div className="text-center text-muted">Please add a new service to proceed forward</div>;
		}
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
			<Modal
				fade={true}
				centered={true}
				isOpen={addServiceModalInstance}
				toggle={() => {
					setUpdateFlag(!updateFlag);
					updateServiceData(serviceInitData);
					updateaddServiceModalInstance(!addServiceModalInstance);
				}}
			>
				<ModalHeader>Service</ModalHeader>
				<ModalBody>
					<Formik
						initialValues={serviceData}
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
								url: `service/${updateFlag ? 'update' : 'add'}`,
								data: values
							}).then(({ data, status }) => {
								if (status === 200) {
									getServices(serviceDispatch);
									updateServiceData(serviceInitData);
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
										onClick={() => updateaddCategoryModalInstance(!addCategoryModalInstance)}
									>
										Add Category
									</Button>
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
										onClick={() => {
											setUpdateFlag(!updateFlag);
											updateServiceData(serviceInitData);
											updateaddServiceModalInstance(!addServiceModalInstance);
										}}
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
			<Modal
				fade={true}
				centered={true}
				isOpen={addCategoryModalInstance}
				toggle={() => {
					setUpdateFlag(!updateFlag);
					updateCategoryData(categoryInitData);
					updateaddCategoryModalInstance(!addCategoryModalInstance);
				}}
			>
				<ModalHeader>Category</ModalHeader>
				<ModalBody>
					<Formik
						initialValues={categoryData}
						validate={(values) => {
							let errors = {};
							if (!values.name) errors.name = 'Provide something to proceed!';
							return errors;
						}}
						onSubmit={(values) => {
							customAxios({
								method: 'post',
								url: `category/${updateFlag ? 'update' : 'add'}`,
								data: values
							}).then(({ status }) => {
								if (status === 200) {
									getCategories();
									updateCategoryData(categoryInitData);
									if (updateFlag) getServices(serviceDispatch);
									updateaddCategoryModalInstance(!addCategoryModalInstance);
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
											onClick={() => {
												setUpdateFlag(!updateFlag);
												updateCategoryData(categoryInitData);
												updateaddCategoryModalInstance(!addCategoryModalInstance);
											}}
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
			<Formik
				initialValues={{
					mobileNumber: '',
					name: ''
				}}
				validate={({ mobileNumber, name }) => {
					let errors = {};
					if (!mobileNumber) {
						errors.mobileNumber = 'Number is required';
					} else if (mobileNumber.length < 10 || mobileNumber.length > 10)
						errors.mobileNumber = 'Enter a valid number';
					if (!name) {
						errors.name = 'Name is required';
					}
					return errors;
				}}
			>
				{({ setFieldValue, values, setFieldTouched }) => (
					<Form>
						<Row>
							<Col xs={4}>
								<FormGroup row>
									<Label xs={2}>Mobile</Label>
									<Col xs={10}>
										<Field name="mobileNumber">
											{({ field, field: { name }, form }) => {
												return (
													<Input
														type="number"
														placeholder="Type a mobile number here"
														{...field}
														onChange={({ target: { value } }) => setFieldValue(name, value)}
														onBlur={({ target: { value } }) => {
															if (value && _.isEmpty(form.errors.mobileNumber)) {
																setFieldTouched(name, true);
																customAxios({
																	method: 'post',
																	url: 'customer/getCustomerByMobileNumber',
																	data: { mobileNumber: value }
																}).then(({ data, status }) => {
																	if (status === 200) {
																		setFieldValue('name', data.name);
																		payloadDispatch({ type: 'userData', data });
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
														payloadDispatch({
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
										<DateTime
											defaultValue={moment()}
											dateFormat={'DD/MM/YYYY'}
											isValidDate={(currentDate) => {
												return currentDate.isBetween(moment().subtract(7, 'days'), moment());
											}}
											timeFormat={false}
											onBlur={(entryDate) => {
												if (isMoment(entryDate)) {
													payloadDispatch({
														type: 'userData',
														data: { ...values, entryDate }
													});
												}
											}}
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
			<Row className="mb-3">
				<Col>
					<div className="text-right">
						<Button
							color="danger"
							disabled={
								!payload.name ||
								!payload.mobileNumber ||
								(payload.services && payload.services.length === 0)
							}
							onClick={() => {
								customAxios({
									method: 'POST',
									url: 'invoice/add',
									data: payload
								}).then(({ data, status }) => {
									if (status === 200) {
										getInvoices(invoiceDispatch);
										history.push(`/invoice/${data._id}`);
									}
								});
							}}
						>
							Generate Bill
						</Button>
					</div>
				</Col>
			</Row>
		</div>
	);
};

export const renderTotal = (cart) => {
	let total = 0;
	cart.map(({ amount, quantity, serviceId }) => {
		amount = serviceId ? serviceId.amount : amount;
		return (total = total + amount * quantity);
	});
	return total;
};

export default BillingBlock;
