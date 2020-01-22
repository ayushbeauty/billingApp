import React from 'react';

// import logo from '../../assets/images/logo.png';
import './style.scss';

const Header = () => {
	return (
		<header className="text-center">
			{/* <img src={logo} width="100%" alt="Logo" className="header-logo" /> */}
			<h1 className="font-weight-normal pt-2">Ayush</h1>
			<h5 className="font-weight-light">Beauty Parlour</h5>
			<p>No.73/2, Manjanakkara Street, Opp Lovely Cards, Madurai-625001</p>
		</header>
	);
};

export default Header;
