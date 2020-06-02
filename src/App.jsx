import React from 'react';
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom';

import './App.scss';
import Header from './components/header';
import BillingBlock from './pages/billing-block';
import Invoice from './pages/invoice';
import Dashboard from './pages/dashboard';
import StoreProvider from './store';
import Customers from './pages/customers';

const App = () => {
	return (
		<div>
			<StoreProvider>
				<BrowserRouter>
					<Header />
					<section className="container">
						<Switch>
							<Route path="/dashboard" exact component={Dashboard} />
							<Route path="/bill" component={BillingBlock} />
							<Route path="/invoice/:id?" component={Invoice} />
							<Route path="/customers" component={Customers} />
							<Redirect to="/bill" />
						</Switch>
					</section>
				</BrowserRouter>
			</StoreProvider>
		</div>
	);
};

export default App;
