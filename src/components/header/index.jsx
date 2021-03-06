import React from 'react';

// import logo from '../../assets/images/logo.png';
import './style.scss';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'reactstrap';

const Header = () => {
	return (
		<header className="text-center">
			<div className="container">
				{/* <img src={logo} width="100%" alt="Logo" className="header-logo" /> */}
				<h1 className="font-weight-light pt-2">Ayush</h1>
				<h5 className="font-weight-light">Beauty Parlour</h5>
				<p>No.73/2, Manjanakkara Street, Opp Lovely Cards, Madurai-625001</p>
				<Navbar color="pink" expand="md" className="no-print">
					<Nav>
						<NavItem>
							<NavLink className="nav-link" to="/dashboard">
								Insights
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink className="nav-link" to="/bill">
								Generate Bill
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink className="nav-link" to="/invoice">
								Invoices
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink className="nav-link" to="/customers">
								Customers
							</NavLink>
						</NavItem>
					</Nav>
				</Navbar>
			</div>
		</header>
	);
};

export default Header;
