import React, { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

//firebase
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

//icons
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

const SignIn = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({ email: '', password: '' });
	const { email, password } = formData;
	const navigate = useNavigate();

	const onChangeHandler = (event) => {
		setFormData((prevState) => ({
			...prevState,
			[event.target.id]: event.target.value, //Changing according to the id (email or password)
		}));
	};

	const submitHandler = async (event) => {
		event.preventDefault();

		try {
			const auth = getAuth();
			const userCredentials = await signInWithEmailAndPassword(auth, email, password);

			if (userCredentials.user) {
				navigate('/');
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Fragment>
			<div className='pageContainer'>
				<header>
					<p className='pageHeader'>Welcome back</p>
				</header>

				<main>
					<form onSubmit={submitHandler}>
						<input
							type='email'
							className='emailInput'
							placeholder='Email'
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

						<div className='signInBar'>
							<p className='signInText'>Sign In</p>
							<button className='signInButton'>
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
						to='/sign-up'
						className='registerLink'
					>
						Sign up Instead
					</Link>
				</main>
			</div>
		</Fragment>
	);
};

export default SignIn;
