import React, { useState } from 'react'
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
import { updateDoc, doc } from 'firebase/firestore'

const Profile = () => {
    const auth = getAuth()
    const [changeDetails, setChangeDetails] = useState(false)
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    })
    const { name, email } = formData

    const navigate = useNavigate()

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
                            className={
                                !changeDetails
                                    ? 'profileName'
                                    : 'profileNameActive'
                            }
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
            </main>
        </div>
    )
}

export default Profile
