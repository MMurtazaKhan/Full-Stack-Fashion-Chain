import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// import QueryString from 'query-string';


const CheckoutForm = () => {
	const location = useLocation();

	// useEffect(() => {
	// 	const values = QueryString.parse(location.search);

	// 	if (values.success) {
	// 		console.log(
	// 			'Order placed! You will receive an email confirmation.'
	// 		);
	// 	}

	// 	if (values.canceled) {
	// 		console.log(
	// 			"Order canceled -- continue to shop around and checkout when you're ready."
	// 		);
	// 	}
	// }, []);

	return (
		<section>
		
			<form
				action={`http://localhost:8000/api/orders/create-checkout-session/10`}
				method='POST'
			>
				<button className='button' type='submit'>
					Checkout
				</button>
			</form>
		</section>
	);
};

export default CheckoutForm;



<div className='product'>
<img
	src='https://i.imgur.com/EHyR2nP.png'
	alt='The cover of Stubborn Attachments'
/>
<div className='description'>
	<h3>Airpods</h3>
	<h5>$20.00</h5>
</div>
</div>