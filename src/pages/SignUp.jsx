import React, { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

//icons
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

const SignUp = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({ name: '', email: '', password: '' });
	const { email, password, name } = formData;
	const navigate = useNavigate();

	const onChangeHandler = (event) => {
		setFormData((prevState) => ({
			...prevState,
			[event.target.id]: event.target.value, //Changing according to the id (email or password)
		}));
	};

	return (
		<Fragment>
			<div className='pageContainer'>
				<header>
					<p className='pageHeader'>Welcome back!</p>
				</header>

				<main>
					<form>
						<input
							type='text'
							className='nameInput'
							placeholder='Name'
							id='name'
							value={name}
							onChange={onChangeHandler}
						/>
						<input
							type='email'
							className='emailInput'
							placeholder='email'
							id='email'
							value={email}
							onChange={onChangeHandler}
						/>
						<div className='passwordInputDiv'>
							<input
								type={showPassword ? 'text' : 'password'}
								className='passwordInput'
								placeholder='Password'
								id='password'
								value={password}
								onChange={onChangeHandler}
							/>
							<img
								src={visibilityIcon}
								alt='show password'
								className='showPassword'
								onClick={() => setShowPassword((prevState) => !prevState)}
							/>
						</div>

						<Link
							to='/forgot-password'
							className='forgotPasswordLink'
						>
							Forgot Password
						</Link>

						<div className='signUpBar'>
							<p className='signUpText'>Sign up</p>
							<button className='signUpButton'>
								<ArrowRightIcon
									fill='#fff'
									width='34px'
									height='34px'
								/>
							</button>
						</div>
					</form>

					{/* Google OAuth */}

					<Link
						to='/sign-in'
						className='registerLink'
					>
						Sign in Instead
					</Link>
				</main>
			</div>
		</Fragment>
	);
};

export default SignUp;
