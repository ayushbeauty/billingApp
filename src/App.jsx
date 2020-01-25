import React, { useReducer, useEffect } from 'react';
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom';

import './App.scss';
import Header from './components/header';
import BillingBlock from './pages/billing-block';
import Axios from 'axios';
import Invoice from './pages/invoice';

const types = {
	REQ: 'Request_Service',
	RES: 'Response_Service',
	FAIL: 'Falied_Service'
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

const App = () => {
	const [ state, dispatch ] = useReducer(reducer, initialState);

	useEffect(() => {
		getServices(dispatch);
	}, []);

	return (
		<div>
			<Context.Provider value={{ data: { service: state }, dispatches: { serviceDispatch: dispatch } }}>
				<Header />
				<section className="container">
					<BrowserRouter>
						<Switch>
							<Route path="/" exact component={BillingBlock} />
							<Route path="/invoice/:id" component={Invoice} />
							<Redirect to="/" />
						</Switch>
					</BrowserRouter>
				</section>
			</Context.Provider>
		</div>
	);
};

export default App;
