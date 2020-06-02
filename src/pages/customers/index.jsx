import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Media, Modal, ModalHeader, ModalBody, FormGroup, Label, Button } from 'reactstrap';
import { useEffect } from 'react';
import { customAxios } from '../../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';

import './style.scss';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const Customers = () => {
	const [ data, setData ] = useState([]);
	const [ editData, seteditData ] = useState();
	const [ modal, setmodal ] = useState(false);
	const getCustomers = () => {
		customAxios.get('/customer').then(({ data, status }) => {
			if (status === 200) setData(data);
		});
	};
	useEffect(() => {
		getCustomers();
	}, []);
	const renderCustomers = (customers) => {
		return customers.map((customer) => {
			return (
				<Col key={customer._id} xs={12} sm={6} md={4} lg={3} xl={3}>
					<Card className="shadow-sm">
						<CardBody>
							<Media>
								<Media
									left
									onClick={() => {
										setmodal(!modal);
										seteditData(customer);
									}}
								>
									{customer.name[0]}
									<FontAwesomeIcon icon={faPen} />
								</Media>
								<Media body>
									{customer.name}
									<br />
									<small>{customer.mobileNumber}</small>
								</Media>
							</Media>
						</CardBody>
					</Card>
				</Col>
			);
		});
	};
	return (
		<div>
			<Modal isOpen={modal} centered={true} toggle={() => setmodal(!modal)}>
				<ModalHeader>Edit</ModalHeader>
				<ModalBody>
					<Formik
						initialValues={editData}
						validate={(values) => {
							let errors = {};
							if (!values.name) errors.name = 'Enter the Name';
							return errors;
						}}
						onSubmit={(values) => {
							customAxios.post('/customer/update', values).then(({ data, status }) => {
								if (status === 200) {
									getCustomers();
									setmodal(!modal);
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
											placeholder="Type customer name"
										/>
										<br />
										<ErrorMessage name="name" />
									</Col>
								</FormGroup>
								<div>
									<div className="float-right">
										<Button color="secondary" className="mr-2" onClick={() => setmodal(!modal)}>
											Cancel
										</Button>
										<Button color="danger" type="submit">
											Save
										</Button>
									</div>
								</div>
							</Form>
						)}
					</Formik>
				</ModalBody>
			</Modal>
			<Row>
				<Col>
					<h2 className="text-center font-weight-light">Customers</h2>
				</Col>
			</Row>
			<hr />
			<Row className="customers-list">{renderCustomers(data)}</Row>
		</div>
	);
};

export default Customers;
