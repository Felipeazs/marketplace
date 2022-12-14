import { Fragment } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

//pages
import Explore from './pages/Explore'
import Offers from './pages/Offers'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import PrivateRoute from './components/PrivateRoute'
import Category from './pages/Category'
import CreateListing from './pages/CreateListing'
import Listings from './pages/Listings'
import Contact from './pages/Contact'
import EditListing from './pages/EditListing'

//layout
import Navbar from './components/Navbar'

function App() {
    return (
        <Fragment>
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={<Explore />}
                    />
                    <Route
                        path="/offers"
                        element={<Offers />}
                    />
                    <Route
                        path="/category/:categoryName/"
                        element={<Category />}
                    />
                    <Route
                        path="/category/:categoryName/:listingId"
                        element={<Listings />}
                    />
                    <Route
                        path="/create-listing"
                        element={<CreateListing />}
                    />
                    <Route
                        path="/profile"
                        element={<PrivateRoute />}>
                        <Route
                            path="/profile"
                            element={<Profile />}
                        />
                    </Route>
                    <Route
                        path="/contact/:landlordId"
                        element={<Contact />}
                    />
                    <Route
                        path="/edit-listing/:listingId"
                        element={<EditListing />}
                    />
                    <Route
                        path="/sign-in"
                        element={<SignIn />}
                    />
                    <Route
                        path="/sign-up"
                        element={<SignUp />}
                    />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                </Routes>
                <Navbar />
            </Router>
            <ToastContainer />
        </Fragment>
    )
}

export default App
