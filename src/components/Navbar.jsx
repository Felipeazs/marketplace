import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

//iconos
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg';
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg';
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg';

const Navbar = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	//matching routes for styling
	const pathMatchRoute = (route) => {
		if (route === pathname) {
			return true;
		}
	};

	const navigateHandler = (url) => {
		navigate(`/${url}`);
	};

	return (
		<footer className='navbar'>
			<nav className='navbarNav'>
				<ul className='navbarListItems'>
					<li
						className='navbarListItem'
						onClick={() => navigateHandler('')}
					>
						<ExploreIcon
							fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'}
							width='36px'
							height='36px'
						/>
						<p
							className={
								pathMatchRoute('/')
									? 'navbarListItemNameActive'
									: 'navbarListItemName'
							}
						>
							Explore
						</p>
					</li>
					<li
						className='navbarListItem'
						onClick={() => navigateHandler('offers')}
					>
						<OfferIcon
							fill={pathMatchRoute('/offers') ? '#2c2c2c' : '#8f8f8f'}
							width='36px'
							height='36px'
						/>
						<p
							className={
								pathMatchRoute('/offers')
									? 'navbarListItemNameActive'
									: 'navbarListItemName'
							}
						>
							Offer
						</p>
					</li>
					<li
						className='navbarListItem'
						onClick={() => navigateHandler('profile')}
					>
						<PersonOutlineIcon
							fill={pathMatchRoute('/profile') ? '#2c2c2c' : '#8f8f8f'}
							width='36px'
							height='36px'
						/>
						<p
							className={
								pathMatchRoute('/profile')
									? 'navbarListItemNameActive'
									: 'navbarListItemName'
							}
						>
							Profile
						</p>
					</li>
				</ul>
			</nav>
		</footer>
	);
};

export default Navbar;
