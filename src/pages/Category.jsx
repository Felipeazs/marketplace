import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

//firebase
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore'
import { db } from '../firebase.config'

import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

const Category = () => {
    const [lastFetchedListing, setLastFetchedListing] = useState(null)
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)

    const { categoryName } = useParams()

    useEffect(() => {
        const fetchListings = async () => {
            try {
                //get reference
                const listingsRef = collection(db, 'listings')

                //set the query
                const q = query(
                    listingsRef,
                    where('type', '==', categoryName),
                    orderBy('timestamp', 'desc'),
                    limit(10)
                )

                //execute query
                const querySnap = await getDocs(q)

                const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                setLastFetchedListing(lastVisible)

                const listings = []
                querySnap.forEach(doc => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data(),
                    })
                })

                setListings(listings)
                setLoading(false)
            } catch (error) {
                toast.error('Could not fetch listings')
            }
        }

        fetchListings()
    }, [categoryName])

    //Pagination/load more
    const onFetchedMoreListings = async () => {
        try {
            //get reference
            const listingsRef = collection(db, 'listings')

            //set the query
            const q = query(
                listingsRef,
                where('type', '==', categoryName),
                orderBy('timestamp', 'desc'),
                startAfter(lastFetchedListing),
                limit(10)
            )

            //execute query
            const querySnap = await getDocs(q)

            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchedListing(lastVisible)

            const listings = []
            querySnap.forEach(doc => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })

            setListings(prevState => [...prevState, ...listings])
            setLoading(false)
        } catch (error) {
            toast.error('Could not fetch listings')
        }
    }

    return (
        <div className="category">
            <header>
                <p className="pageHeader">
                    {categoryName === 'rent' ? 'Places for rent' : 'Places for sale'}
                </p>
            </header>
            {loading ? (
                <Spinner />
            ) : listings && listings.length > 0 ? (
                <>
                    <main>
                        <ul className="categoryListings">
                            {listings.map(listing => (
                                <ListingItem
                                    listing={listing.data}
                                    id={listing.id}
                                    key={listing.id}
                                />
                            ))}
                        </ul>
                    </main>
                    <br />
                    <br />
                    {lastFetchedListing && (
                        <p
                            className="loadMore"
                            onClick={onFetchedMoreListings}>
                            Load More
                        </p>
                    )}
                </>
            ) : (
                <p>No listings for {categoryName}</p>
            )}
        </div>
    )
}

export default Category
