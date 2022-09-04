import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

//additional - slider
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

//firestore
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'

//components
import Spinner from '../components/Spinner'

//styles
import shareIcon from '../assets/svg/shareIcon.svg'

const Listings = () => {
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkedCopied, setShareLinkedCopied] = useState(false)

    const navigate = useNavigate()
    const { listingId } = useParams()

    //
    const auth = getAuth()

    //fetching
    useEffect(() => {
        const getFetchListing = async () => {
            const docRef = doc(db, 'listings', listingId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setListing(docSnap.data())
                setLoading(false)
            }
        }

        getFetchListing()
    }, [navigate, listingId])

    if (loading) {
        return <Spinner />
    }

    return (
        <main>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                scrollbar={{ draggable: true }}
                slidesPerView={1}
                pagination={{ clickable: true }}>
                {listing.imageUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                        <div
                            style={{
                                background: `url(${url}) center no-repeat`,
                                backgroundSize: 'cover',
                            }}
                            className="swiperSlideDiv"></div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div
                className="shareIconDiv"
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    setShareLinkedCopied(true)
                    setTimeout(() => {
                        setShareLinkedCopied(false)
                    }, 2000)
                }}>
                <img
                    src={shareIcon}
                    alt=""
                />
            </div>
            {shareLinkedCopied && <p className="linkCopied">Link copied!</p>}
            <div className="listingDetails">
                <p className="listingName">
                    {listing.name} - $
                    {listing.offer
                        ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </p>
                <p className="listingLocation">{listing.location}</p>
                <p className="listingType">For {listing.type === 'rent' ? 'Rent' : 'Sale'}</p>
                {listing.offer && (
                    <p className="discountPrice">
                        ${listing.regularPrice - listing.discountedPrice} discount
                    </p>
                )}
                <ul className="listingDetailsList">
                    <li>{listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}</li>
                    <li>
                        {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}
                    </li>
                    <li>{listing.parking && 'Parking Spot'}</li>
                    <li>{listing.furnished && 'Furnished'}</li>
                </ul>
                <p className="listingLocationTitle">Location</p>

                <div className="leafletContainer">
                    <MapContainer
                        style={{ height: '100%', width: '100%' }}
                        center={[listing.geolocation.lat, listing.geolocation.lng]}
                        zoom={13}
                        scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[listing.geolocation.lat, listing.geolocation.lng]} />
                    </MapContainer>
                </div>

                {auth.currentUser?.uid !== listing.userRef && (
                    <Link
                        to={`/contact/${listing.userRef}?listingName=${listing.name}`}
                        className="primaryButton">
                        Contact Landlord
                    </Link>
                )}
            </div>
        </main>
    )
}

export default Listings
