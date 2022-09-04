import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

//styles
import 'react-toastify/dist/ReactToastify.css'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

//firebase
import { getAuth, updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase.config'
import {
    updateDoc,
    doc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
    deleteDoc,
} from 'firebase/firestore'

//components
import ListingItem from '../components/ListingItem'

const Profile = () => {
    const auth = getAuth()
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [changeDetails, setChangeDetails] = useState(false)
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    })
    const { name, email } = formData

    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, 'listings')

            const q = query(
                listingsRef,
                where('userRef', '==', auth.currentUser.uid),
                orderBy('timestamp', 'desc')
            )

            const querySnap = await getDocs(q)
            const listings = []
            querySnap.forEach(doc =>
                listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            )

            setListings(listings)
            setLoading(false)
        }

        fetchUserListings()
    }, [auth.currentUser.uid])

    const onLogout = () => {
        auth.signOut()
        navigate('/')
    }

    const changeHandler = event => {
        setFormData(prevState => ({
            ...prevState,
            [event.target.id]: event.target.value,
        }))
    }

    const onDelete = async listingId => {
        if (window.confirm('Are you sure you want to delete')) {
            await deleteDoc(doc(db, 'listings', listingId))

            const updatedListings = listings.filter(listing => listing.id !== listingId)
            setListings(updatedListings)

            toast.success('Successfully deleted listing')
        }
    }

    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                //update name
                await updateProfile(auth.currentUser, {
                    displayName: name,
                })

                //update firestore
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, { name })
            }
        } catch (error) {
            toast.error('Could not update profile details')
        }
    }

    return (
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">My Profile</p>
                <button
                    className="logOut"
                    type="button"
                    onClick={onLogout}>
                    Logout
                </button>
            </header>

            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetailsText">Personal Details</p>
                    <p
                        className="changePersonalDetails"
                        onClick={() => {
                            changeDetails && onSubmit()
                            setChangeDetails(prevState => !prevState)
                        }}>
                        {changeDetails ? 'done' : 'change'}
                    </p>
                </div>
                <div className="profileCard">
                    <form>
                        <input
                            type="text"
                            id="name"
                            className={!changeDetails ? 'profileName' : 'profileNameActive'}
                            disabled={!changeDetails}
                            value={name}
                            onChange={changeHandler}
                        />
                        <input
                            type="text"
                            id="email"
                            className="profileEmail"
                            disabled={!changeDetails}
                            value={email}
                            onChange={changeHandler}
                        />
                    </form>
                </div>
                <Link
                    to="/create-listing"
                    className="createListing">
                    <img
                        src={homeIcon}
                        alt="home"
                    />
                    <p>Sell or rent your home</p>
                    <img
                        src={arrowRight}
                        alt="arrow"
                    />
                </Link>
                {!loading && listings.length > 0 && (
                    <>
                        <p className="listingText">Your Listings</p>
                        <ul className="listingList">
                            {listings.map(listing => (
                                <ListingItem
                                    key={listing.id}
                                    listing={listing.data}
                                    id={listing.id}
                                    onDelete={() => onDelete(listing.id)}
                                />
                            ))}
                        </ul>
                    </>
                )}
            </main>
        </div>
    )
}

export default Profile
