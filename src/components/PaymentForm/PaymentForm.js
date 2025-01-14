

import React, { useEffect, useState } from 'react';

import './PaymentForm.css';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import { emailJsKey } from '../../keys/emailJsKey';
import  emailjs  from '@emailjs/browser';
import sendEmail from '../../utilities/sendEmail';




const PaymentForm = () => {
    const location=useLocation();
    const navigate=useNavigate();
  const stripe = useStripe();
  const elements = useElements();

const [error,setError]=useState("")
const [bookingInfo,setBookingInfo]=useState({})


 

useEffect(()=>{
    fetch( `https://trip-tuck-2-server.onrender.com/bookings/singleBooking/${location.state}`).then(res=>res.json()).then(data=>setBookingInfo(data))
    emailjs.init(emailJsKey);
},[location.state])
  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();
    if(bookingInfo.paymentStatus==='paid'){
        alert("You already had paid for this trip!")
        return
    }
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });
    
    if (error) {
      
      setError(error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      if(paymentMethod.id){
        try {
            
            const response = await fetch(`https://trip-tuck-2-server.onrender.com/bookings/paymentStatus/${location.state}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
            });
        
            const data = await response.json();
            console.log(data)
            if(data.acknowledged){
                alert("Payment is successful!Get ready for the amazing experience of your life");
                sendEmail(bookingInfo);
                navigate('/myBookings')
            }
            
          } catch (error) {
            setError(error)
          }
        //   alert("Payment is successful");
        // handleClose();
        
      }
    }
  };

  return (

    <form onSubmit={handleSubmit} className='payment-form-style'>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      
      <button type="submit" disabled={!stripe} style={{marginRight:'35%'}}>
        Pay :	&#2547; {bookingInfo.totalCost}
      </button>
      
      <h5 style={{color:'red',textAlign:"center",marginRight:"30%",marginTop:"10%"}}>{error?.message}</h5>
    </form>
 
  );
};


export default PaymentForm;