// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFireStore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyAs07UxOdoLCB7xXj3MeTvXY5q96k1H-sI',
	authDomain: 'marketplace-traversy-343ae.firebaseapp.com',
	projectId: 'marketplace-traversy-343ae',
	storageBucket: 'marketplace-traversy-343ae.appspot.com',
	messagingSenderId: '859937628202',
	appId: '1:859937628202:web:1460f07f2d7df38c706353',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFireStore();
