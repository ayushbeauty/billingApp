// Wrapper Component for Context Management
import React, { useReducer, useEffect } from 'react';

import Axios from 'axios';

const types = {
	REQ: 'Request_Service',
	RES: 'Response_Service',
	FAIL: 'Falied_Service'
};

const invoiceTypes = {
	REQ: 'Request_Invoice',
	RES: 'Response_Invoice',
	FAIL: 'Falied_Invoice'
};

export const initialState = {
	response: [],
	requesting: false
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

const invoiceReducer = (state, { type, payload }) => {
	switch (type) {
		case invoiceTypes.REQ:
			return {
				...state,
				requesting: true
			};
		case invoiceTypes.RES:
			return { ...state, response: payload, requesting: false };
		case invoiceTypes.FAIL:
			return {
				...state,
				response: 'Error',
				requesting: false
			};
		default:
			return state;
	}
};

export const Context = React.createContext();

export const customAxios = Axios.create({
	baseURL: 'http://localhost:8000/'
});

export const getServices = async (dispatch) => {
	try {
		const response = await customAxios.get('service');
		return dispatch({ type: types.RES, payload: response.data });
	} catch (err) {
		return dispatch({ type: types.FAIL, payload: err });
	}
};

export const getInvoices = async (dispatch) => {
	try {
		const response = await customAxios.get('invoice');
		return dispatch({ type: invoiceTypes.RES, payload: response.data });
	} catch (error) {
		return dispatch({ type: invoiceTypes.FAIL, payload: error });
	}
};

const StoreProvider = ({ children }) => {
	const [ service, serviceDispatch ] = useReducer(reducer, initialState);
	const [ invoice, invoiceDispatch ] = useReducer(invoiceReducer, initialState);

	useEffect(() => {
		getServices(serviceDispatch);
		getInvoices(invoiceDispatch);
	}, []);

	return (
		<Context.Provider value={{ data: { service, invoice }, dispatches: { serviceDispatch, invoiceDispatch } }}>
			{children}
		</Context.Provider>
	);
};

export default StoreProvider;
