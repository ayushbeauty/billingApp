import React from 'react';
import './App.scss';
import Header from './components/header';
import BillingBlock from './components/billing-block';

const App = () => {
	return (
		<div>
			<Header />
			<section className="container">
				<BillingBlock />
			</section>
		</div>
	);
};

export default App;
