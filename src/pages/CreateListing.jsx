import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

//firebase
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';

import Spinner from '../components/Spinner';

const CreateListing = () => {
	const [geolocationEnabled, setGeolocationEnabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		type: 'rent',
		name: '',
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		address: '',
		offer: false,
		regularPrice: 0,
		discountedPrice: 0,
		images: {},
		latitude: 0,
		longitude: 0,
	});

	const {
		type,
		name,
		bedrooms,
		bathrooms,
		parking,
		furnished,
		address,
		offer,
		regularPrice,
		discountedPrice,
		images,
		latitude,
		longitude,
	} = formData;

	const auth = getAuth();
	const navigate = useNavigate();

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setFormData({ ...formData, userRef: user.uid });
			} else {
				navigate('/sign-in');
			}
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (loading) {
		return <Spinner />;
	}

	const onSubmitHandler = async (event) => {
		event.preventDefault();

		setLoading(true);

		//check prices
		if (+discountedPrice >= +regularPrice) {
			setLoading(false);
			toast.error('Discount price needs to be less than regular price');
			return;
		}

		//check images
		if (images.length > 6) {
			setLoading(false);
			toast.error('Max. 6 images');
			return;
		}

		//get the geolocation
		let geolocation = {};
		let location;

		if (geolocationEnabled) {
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`,
			);
			const data = await response.json();

			geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
			geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
			location =
				data.status === 'ZERO_RESULTS' ? 'undefined' : data.results[0]?.formatted_address;

			if (location === undefined || location.includes('undefined')) {
				setLoading(false);
				toast.error('Please enter a valid address');
				return;
			}
		} else {
			geolocation.lat = latitude;
			geolocation.lng = longitude;
		}

		//Storage images
		const storeImage = async (image) => {
			return new Promise((resolve, reject) => {
				const storage = getStorage();
				const fileName = `${auth.currentUser.uid}-${uuidv4()}-${image.name}`;
				const storageRef = ref(storage, `/images/${fileName}`);

				const uploadTask = uploadBytesResumable(storageRef, image);

				uploadTask.on(
					'state_changed',
					(snapshot) => {
						const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						console.log('Upload is ' + progress + '% done');
						switch (snapshot.state) {
							case 'paused':
								console.log('Upload is paused');
								break;
							case 'running':
								console.log('Upload is running');
								break;
							default:
								break;
						}
					},
					(error) => {
						reject(error);
					},
					() => {
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							resolve(downloadURL);
						});
					},
				);
			});
		};

		const imageUrls = await Promise.all([...images].map((image) => storeImage(image))).catch(
			(error) => {
				setLoading(false);
				toast.error('Images not uploaded');
				return;
			},
		);

		//Saving listing to database

		const formDataCopy = {
			...formData,
			imageUrls,
			geolocation,
			timestamp: serverTimestamp(),
		};

		formDataCopy.location = address;
		delete formDataCopy.images;
		delete formDataCopy.address;
		!formDataCopy.offer && delete formDataCopy.discountedPrice;

		const docRef = await addDoc(collection(db, 'listings'), formDataCopy);

		setLoading(false);
		toast.success('Listing saved!');

		navigate(`/category/${formDataCopy.type}/${docRef.id}`);

		setLoading(false);
	};

	const changeHandler = (event) => {
		let boolean = null;
		// check if boolean
		if (event.target.value === 'true') {
			boolean = true;
		}
		if (event.target.value === 'false') {
			boolean = false;
		}

		//check if file
		if (event.target.files) {
			setFormData((prevState) => ({
				...prevState,
				images: event.target.files,
			}));
		}
		if (!event.target.files) {
			setFormData((prevState) => ({
				...prevState,
				[event.target.id]: boolean ?? event.target.value,
			}));
		}
	};

	return (
		<div className='profile'>
			<header>
				<p className='pageHeader'>Create a listing</p>
			</header>

			<main>
				<form onSubmit={onSubmitHandler}>
					<label className='formLabel'>Sell / Rent</label>
					<div className='formButtons'>
						<button
							type='button'
							className={type === 'sell' ? 'formButtonActive' : 'formButton'}
							id='type'
							value='sell'
							onClick={changeHandler}
						>
							Sell
						</button>
						<button
							type='button'
							className={type === 'rent' ? 'formButtonActive' : 'formButton'}
							id='type'
							value='rent'
							onClick={changeHandler}
						>
							Rent
						</button>
					</div>
					<label className='formLabel'>Name</label>
					<input
						className='formInputName'
						type='text'
						id='name'
						value={name}
						onChange={changeHandler}
						maxLength='32'
						minLength='10'
						required
					/>
					<div className='formRooms flex'>
						<div>
							<label className='formLabel'>Bedrooms</label>
							<input
								className='formInputSmall'
								type='number'
								id='bedrooms'
								value={bedrooms}
								onChange={changeHandler}
								min='1'
								max='50'
								required
							/>
						</div>
						<div>
							<label className='formLabel'>Bathrooms</label>
							<input
								className='formInputSmall'
								type='number'
								id='bathrooms'
								value={bathrooms}
								onChange={changeHandler}
								min='1'
								max='50'
								required
							/>
						</div>
					</div>
					<label className='formLabel'>Parking spot</label>
					<div className='formButtons'>
						<button
							className={parking ? 'formButtonActive' : 'formButton'}
							type='button'
							id='parking'
							value={true}
							onClick={changeHandler}
							min='1'
							max='50'
						>
							Yes
						</button>
						<button
							className={
								!parking && parking !== null ? 'formButtonActive' : 'formButton'
							}
							type='button'
							id='parking'
							value={false}
							onClick={changeHandler}
						>
							No
						</button>
					</div>
					<label className='formLabel'>Furnished</label>
					<div className='formButtons'>
						<button
							className={furnished ? 'formButtonActive' : 'formButton'}
							type='button'
							id='furnished'
							value={true}
							onClick={changeHandler}
						>
							Yes
						</button>
						<button
							className={
								!furnished && furnished !== null ? 'formButtonActive' : 'formButton'
							}
							type='button'
							id='furnished'
							value={false}
							onClick={changeHandler}
						>
							No
						</button>
					</div>

					<label className='formLabel'>Address</label>
					<textarea
						className='formInputAddress'
						type='text'
						id='address'
						value={address}
						onChange={changeHandler}
						required
					/>
					{!geolocationEnabled && (
						<div className='formLatLng flex'>
							<div>
								<label className='formLabel'>Latitude</label>
								<input
									className='formInputSmall'
									type='number'
									id='latitude'
									value={latitude}
									onChange={changeHandler}
									required
								/>
							</div>
							<div>
								<label className='formLabel'>Longitude</label>
								<input
									className='formInputSmall'
									type='number'
									id='longitude'
									value={longitude}
									onChange={changeHandler}
									required
								/>
							</div>
						</div>
					)}
					<label className='formLabel'>Offer</label>
					<div className='formButtons'>
						<button
							className={offer ? 'formButtonActive' : 'formButton'}
							type='button'
							id='offer'
							value={true}
							onClick={changeHandler}
						>
							Yes
						</button>
						<button
							className={!offer && offer !== null ? 'formButtonActive' : 'formButton'}
							type='button'
							id='offer'
							value={false}
							onClick={changeHandler}
						>
							No
						</button>
					</div>

					<label className='formLabel'>Regular Price</label>
					<div className='formPriceDiv'>
						<input
							className='formInputSmall'
							type='number'
							id='regularPrice'
							value={regularPrice}
							onChange={changeHandler}
							min='50'
							max='750000000'
							required
						/>
						{type === 'rent' && <p className='formPriceText'>$ / Month</p>}
					</div>

					{offer && (
						<>
							<label className='formLabel'>Discounted Price</label>
							<input
								className='formInputSmall'
								type='number'
								id='discountedPrice'
								value={discountedPrice}
								onChange={changeHandler}
								min='50'
								max='750000000'
								required={offer}
							/>
						</>
					)}

					<label className='formLabel'>Images</label>
					<p className='imagesInfo'>The first image will be the cover (max 6).</p>
					<input
						className='formInputFile'
						type='file'
						id='images'
						onChange={changeHandler}
						max='6'
						accept='.jpg,.png,.jpeg'
						multiple
						required
					/>
					<button
						type='submit'
						className='primaryButton createListingButton'
					>
						Create Listing
					</button>
				</form>
			</main>
		</div>
	);
};

export default CreateListing;
