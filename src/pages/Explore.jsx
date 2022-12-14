import React from 'react'
import { Link } from 'react-router-dom'

//components
import HomeSlider from '../components/HomeSlider'

//images
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'

const Explore = () => {
    return (
        <div className="explore">
            <header>
                <p className="pageHeader">Explorer</p>
            </header>
            <HomeSlider />

            <main>
                <p className="exploreCategoryHeading">Categories</p>
                <div className="exploreCategories">
                    <Link to="/category/rent">
                        <img
                            src={rentCategoryImage}
                            alt="rentImg"
                            className="exploreCategoryImg"
                        />
                        <p className="exploreCategoryName">Places for rent</p>
                    </Link>
                    <Link to="/category/sell">
                        <img
                            src={sellCategoryImage}
                            alt="sellImg"
                            className="exploreCategoryImg"
                        />
                        <p className="exploreCategoryName">Places for sale</p>
                    </Link>
                </div>
            </main>
        </div>
    )
}

export default Explore
