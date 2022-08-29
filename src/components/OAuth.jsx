import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

//firebase
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';

//icons
import googleIcon from '../assets/svg/googleIcon.svg';

import Spinner from './Spinner';

const OAuth = () => {
	const [loading, setLoading] = useState(false);
	const { pathname } = useLocation();
	const navigate = useNavigate();

	const onGoogleHandler = async () => {
		setLoading(true);
		try {
			const auth = getAuth();
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const user = result.user;

			// getting user in database
			const docRef = doc(db, 'users', user.uid);
			const docSnap = await getDoc(docRef);

			//create user if not exists
			if (!docSnap.exist) {
				await setDoc(doc(db, 'users', user.uid), {
					name: user.displayName,
					email: user.email,
					timestamp: serverTimestamp(),
				});
			}

			setLoading(false);

			navigate('/');
		} catch (error) {
			setLoading(false);
			toast.error('Could not authorize with google');
		}
	};

	if (loading) {
		return <Spinner />;
	}

	return (
		<div className='socialLogin'>
			<p>Sign {pathname === '/sign-up' ? 'up' : 'in'} with</p>
			<button
				className='socialIconDiv'
				onClick={onGoogleHandler}
			>
				<img
					className='socialIconImg'
					src={googleIcon}
					alt='google'
				/>
			</button>
		</div>
	);
};

export default OAuth;
