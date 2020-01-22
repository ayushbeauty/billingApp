import React, { useReducer, useEffect } from 'react';
import { Route, BrowserRouter, Redirect } from 'react-router-dom';

import './App.scss';
import Header from './components/header';
import BillingBlock from './pages/billing-block';
import Axios from 'axios';

const types = {
	REQ: 'Request_Service',
	RES: 'Response_Service',
	FAIL: 'Falied_Services'
};

const initialState = {
	response: [],
	requesting: false
};

export const Context = React.createContext();

const App = () => {
	const [ state, dispatch ] = useReducer((state, { type, payload }) => {
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
	}, initialState);

	useEffect(() => {
		Axios.get('http://localhost:8000/service')
			.then((response) => dispatch({ type: types.RES, payload: response.data }))
			.catch((err) => dispatch({ type: types.FAIL, payload: err }));
	}, []);

	return (
		<div>
			<Context.Provider value={{ data: { service: state }, dispatches: { serviceDispatch: dispatch } }}>
				<Header />
				<section className="container">
					<BrowserRouter>
						<Route path="/" component={BillingBlock} />
						<Redirect to="/" />
					</BrowserRouter>
				</section>
			</Context.Provider>
		</div>
	);
};

export default App;
