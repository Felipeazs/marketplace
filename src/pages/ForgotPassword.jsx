import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

//firebase
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'

//icons
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')

    const onChangeHandler = event => {
        setEmail(event.target.value)
    }

    const onSubmitHandler = async event => {
        event.preventDefault()

        try {
            const auth = getAuth()
            await sendPasswordResetEmail(auth, email)

            toast.success('Email was sent')
        } catch (error) {
            toast.error('Could not send reset email')
        }
    }
    return (
        <div className="pageContainer">
            <header>
                <p className="pageHeader"></p>
            </header>
            <main>
                <form onSubmit={onSubmitHandler}>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={onChangeHandler}
                        className="emailInput"
                    />
                    <Link
                        className="forgotPasswordLink"
                        to="/sign-in">
                        Sign in
                    </Link>

                    <div className="signInBar">
                        <div className="signInText">Send Reset Link</div>
                        <button className="signInButton">
                            <ArrowRightIcon
                                fill="#ffffff"
                                width="34px"
                                height="34px"
                            />
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}

export default ForgotPassword
