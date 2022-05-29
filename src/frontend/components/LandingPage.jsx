import React from 'react'
import './LandingPage.css'
import pic from './stufflesHeading.png';

const LandingPage = () => {
	return (
		<div className='landing-page'>
			
			<div className='landing-page__shuffles-img'>
				<img src={pic}/>
			</div>
			{/* <h1 className='landing-page__heading'>INVEST IN ARTISTS.</h1>
			<h1 className='landing-page__subheading'>OWN YOUR FAVORITE MUSIC.</h1> */}

		</div>
	)
}

export default LandingPage