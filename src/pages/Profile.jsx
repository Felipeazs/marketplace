import React, { Fragment, useState, useEffect } from 'react';

//firebase
import { getAuth } from 'firebase/auth';

const Profile = () => {
	const [user, setUser] = useState(null);

	const { currentUser } = getAuth();

	useEffect(() => {
		setUser(currentUser);
	}, [currentUser]);

	return <Fragment>{user ? <h1>{user.displayName}</h1> : 'Not Logged in'}</Fragment>;
};

export default Profile;
